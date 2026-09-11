import { required, schema } from '@angular/forms/signals';
import { User } from '@wawjs/ngx-bos';

export const clientSchema = schema<User>((path) => {
	required(path.name, { message: 'Введіть ім\'я...' });
	required(path.email, { message: 'Введіть email...' });
	required(path.phone, { message: 'Введіть телефон...' });
});
