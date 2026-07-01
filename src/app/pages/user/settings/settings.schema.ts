import { required, schema } from '@angular/forms/signals';
import { SecurityModel } from './settings.interface';

export const securitySchema = schema<SecurityModel>((path) => {
	required(path.currentPassword, {
		message: 'Введіть поточний пароль...',
	});

	required(path.newPassword, {
		message: 'Введіть новий пароль...',
	});

	required(path.confirmPassword, {
		message: 'Підтвердіть новий пароль...',
	});
});
