import { schema } from '@angular/forms/signals';
import { ProfileModel } from './profile.interface';

export const profileSchema = schema<ProfileModel>(() => {});
