import {
	ApplicationConfig,
	provideZonelessChangeDetection,
} from '@angular/core';
import {
	PreloadAllModules,
	provideRouter,
	withInMemoryScrolling,
	withPreloading,
} from '@angular/router';
import {
	provideNgxAce,
	registerAceMode,
	registerAceTheme,
} from '@wawjs/ngx-ace';
import { provideNgxCore } from '@wawjs/ngx-core';
import { provideNgxCrud } from '@wawjs/ngx-crud';
import { provideNgxHttp } from '@wawjs/ngx-http';
import { provideNgxSocket } from '@wawjs/ngx-socket';
import { provideNgxTinymce } from '@wawjs/ngx-tinymce';
import { provideTranslate } from '@wawjs/ngx-translate';
import { ModalService, provideNgxUi } from '@wawjs/ngx-ui';
import { NGX_FORM_CONFIG } from '@wawjs/ngx-form';
import { NgxBosConfig, ngxBosProvide } from '@wawjs/ngx-bos';
import { io } from 'socket.io-client';
import { environment } from '@env';
import { provideFormComponents } from './app.formcomponents';
import { routes } from './app.routes';
import { tinymceConfig } from './tinymce.config';
import { wawjsConfig } from './wawjs.config';

registerAceMode('javascript', () =>
	import('ace-builds/src-noconflict/mode-javascript'),
);
registerAceTheme('clouds', () =>
	import('ace-builds/src-noconflict/theme-clouds'),
);
registerAceTheme('github', () =>
	import('ace-builds/src-noconflict/theme-github'),
);

export const appConfig: ApplicationConfig = {
	providers: [
		provideZonelessChangeDetection(),
		ngxBosProvide({
			appId: environment.appId,
			url: environment.url,
			roles: environment.roles,
			userFields:
				(environment as unknown as { userFields?: string[] })
					.userFields ?? [],
			userForm:
				(environment as unknown as {
					userForm?: NgxBosConfig['userForm'];
				}).userForm ?? [],
			defaultUserThumb: 'assets/default.png',
		}),
		provideFormComponents(),
		provideNgxCore(wawjsConfig),
		provideNgxHttp(wawjsConfig),
		provideNgxCrud(wawjsConfig),
		provideNgxSocket({ ...wawjsConfig, io }),
		provideNgxAce({
			mode: 'text',
			theme: 'github',
			useWorker: false,
		}),
		provideTranslate({
			language: environment.defaultLanguageCode,
			defaultLanguage: environment.defaultLanguageCode,
			languages: environment.languages,
			folder: '/i18n/',
			persistLanguage: true,
		}),
		provideNgxUi(),
		// provideNgxForm() only supports static config; keep a factory so modal helpers get the injected ModalService.
		{
			provide: NGX_FORM_CONFIG,
			useFactory: (modalService: ModalService) => ({
				appId: environment.appId,
				modalService,
			}),
			deps: [ModalService],
		},
		provideNgxTinymce(tinymceConfig),
		provideRouter(
			routes,
			withPreloading(PreloadAllModules),
			withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
		),
	],
};
