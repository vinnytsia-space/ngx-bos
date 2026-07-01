import {
	Component,
	computed,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, submit } from '@angular/forms/signals';
import { ButtonComponent, InputComponent, MaterialComponent } from '@wawjs/ngx-ui';
import { FileComponent } from '@wawjs/ngx-bos';
import { UserService } from '@wawjs/ngx-bos';
import { EmitterService } from '@wawjs/ngx-core';
import { TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { ProfileModel } from './profile.interface';
import { profileSchema } from './profile.schema';

@Component({
	imports: [
		InputComponent,
		ButtonComponent,
		FileComponent,
		MaterialComponent,
		TranslateDirective,
	],
	templateUrl: './profile.component.html',
})
export class ProfileComponent {
	readonly userService = inject(UserService);
	readonly translateService = inject(TranslateService);
	private readonly _emitterService = inject(EmitterService);

	private readonly _initialProfile = computed<ProfileModel>(() => {
		const u = this.userService.user();
		return {
			name: u.name || '',
			phone: u.phone || '',
			bio: u.bio || '',
		};
	});

	readonly profileModel = signal<ProfileModel>(this._initialProfile());
	readonly profileForm = form(this.profileModel, profileSchema);
	readonly isSubmitDisabled = computed(() => this.profileForm().invalid());

	constructor() {
		this._emitterService
			.onComplete('us.user')
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this.profileModel.set(this._initialProfile());
				this.profileForm().reset();
			});
	}

	wFormSubmit(): void {
		submit(this.profileForm, (formTree) => {
			this.userService.user.set({
				...this.userService.user(),
				...(formTree().value() as ProfileModel),
			});

			this.userService.updateMe();
			return Promise.resolve();
		});
	}

	updateThumb(thumb: string): void {
		this.userService.user.set({
			...this.userService.user(),
			thumb,
		});

		this.userService.updateMe();
	}
}
