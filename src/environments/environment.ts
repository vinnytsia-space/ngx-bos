// This file can be replaced during build by using the `fileReplacements` array.
import { environment as environmentProd } from './environment.prod';

export const environment = {
	...environmentProd,
	url: '',
	sign: {
		logo: '',
		email: 'ceo@webart.work',
		password: 'asdasdasdasd',
	},
	production: false,
};
