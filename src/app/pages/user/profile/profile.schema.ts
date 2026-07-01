import { required, schema } from '@angular/forms/signals';
import { ProfileModel } from './profile.interface';

export const profileSchema = schema<ProfileModel>((path) => {
	required(path.name, { message: 'Введіть ім\'я...' });

	required(path.phone, { message: 'Введіть телефон...' });

	required(path.bio, { message: 'Введіть біографію...' });
});
