import { environment } from '@env';
import { DEFAULT_NETWORK_CONFIG } from '@wawjs/ngx-http';

const dbName = 'wawjs-store';
const storeName = 'kv';
const version = 1;

let _dbPromise: Promise<IDBDatabase> | null = null;

const _hasIndexedDb = () => typeof indexedDB !== 'undefined';

const _open = () => {
	if (!_hasIndexedDb()) {
		return Promise.reject(
			new Error('IndexedDB is not available in this environment'),
		);
	}

	if (_dbPromise) return _dbPromise;

	_dbPromise = new Promise((resolve, reject) => {
		const req = indexedDB.open(dbName, version);

		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(storeName)) {
				db.createObjectStore(storeName);
			}
		};

		req.onsuccess = () => resolve(req.result);
		req.onerror = () =>
			reject(req.error ?? new Error('IndexedDB open failed'));
		req.onblocked = () =>
			reject(
				new Error('IndexedDB open blocked (another tab may hold it)'),
			);
	});

	return _dbPromise;
};

export const wawjsConfig = {
	store: {
		prefix: 'wawjs:',

		async set(
			key: string,
			value: string | number,
			callback: () => void = () => {},
			errCallback: (err: unknown) => void = () => {},
		): Promise<boolean> {
			if (!_hasIndexedDb()) {
				callback();
				return false;
			}

			try {
				const db = await _open();

				// Store as string to match your service/localStorage behavior
				const toStore = String(value);

				await new Promise<void>((resolve, reject) => {
					const tx = db.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);

					store.put(toStore, key);

					tx.oncomplete = () => resolve();
					tx.onabort = () =>
						reject(tx.error ?? new Error('IndexedDB tx aborted'));
					tx.onerror = () =>
						reject(tx.error ?? new Error('IndexedDB tx error'));
				});

				callback();
				return true;
			} catch (err) {
				console.error(err);
				errCallback(err);
				return false;
			}
		},

		async get(
			key: string,
			callback?: (value: string) => void,
			errCallback: (err: unknown) => void = () => {},
		): Promise<string> {
			if (!_hasIndexedDb()) {
				callback?.('');
				return '';
			}

			try {
				const db = await _open();

				const value = await new Promise<string>((resolve, reject) => {
					const tx = db.transaction(storeName, 'readonly');
					const store = tx.objectStore(storeName);

					const req = store.get(key);

					req.onsuccess = () => {
						const result = req.result;
						// StoreConfig expects string; use '' when missing
						resolve(typeof result === 'string' ? result : '');
					};
					req.onerror = () =>
						reject(req.error ?? new Error('IndexedDB get failed'));

					tx.onabort = () =>
						reject(tx.error ?? new Error('IndexedDB tx aborted'));
					tx.onerror = () =>
						reject(tx.error ?? new Error('IndexedDB tx error'));
				});

				callback?.(value);
				return value;
			} catch (err) {
				console.error(err);
				errCallback(err);
				callback?.('');
				return '';
			}
		},

		async remove(
			key: string,
			callback: () => void = () => {},
			errCallback: (err: unknown) => void = () => {},
		): Promise<boolean> {
			if (!_hasIndexedDb()) {
				callback();
				return false;
			}

			try {
				const db = await _open();
				await new Promise<void>((resolve, reject) => {
					const tx = db.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);

					store.delete(key);

					tx.oncomplete = () => resolve();
					tx.onabort = () =>
						reject(tx.error ?? new Error('IndexedDB tx aborted'));
					tx.onerror = () =>
						reject(tx.error ?? new Error('IndexedDB tx error'));
				});

				callback();
				return true;
			} catch (err) {
				console.error(err);
				errCallback(err);
				return false;
			}
		},

		async clear(
			callback: () => void = () => {},
			errCallback: (err: unknown) => void = () => {},
		): Promise<boolean> {
			if (!_hasIndexedDb()) {
				callback();
				return false;
			}

			try {
				const db = await _open();
				await new Promise<void>((resolve, reject) => {
					const tx = db.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);

					store.clear();

					tx.oncomplete = () => resolve();
					tx.onabort = () =>
						reject(tx.error ?? new Error('IndexedDB tx aborted'));
					tx.onerror = () =>
						reject(tx.error ?? new Error('IndexedDB tx error'));
				});

				callback();
				return true;
			} catch (err) {
				console.error(err);
				errCallback(err);
				return false;
			}
		},
	},

	http: { url: environment.url },
	socket: environment.production,
	network: environment.production
		? DEFAULT_NETWORK_CONFIG
		: {
				...DEFAULT_NETWORK_CONFIG,
				endpoints: ['http://localhost:4200/status'],
			},
	meta: {
		warnMissingGuard: false,
		useTitleSuffix: true,
		defaults: {
			title: environment.meta.title,
			favicon: environment.meta.favicon,
			description: environment.meta.description,
			titleSuffix: ' | ' + environment.meta.title,
			'og:image': environment.meta.image,
		},
	},
};
