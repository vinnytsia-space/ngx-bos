import {
	Component,
	DestroyRef,
	computed,
	inject,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, submit } from '@angular/forms/signals';
import {
	ButtonComponent,
	InputComponent,
	MaterialComponent,
	ThemeComponent,
} from '@wawjs/ngx-ui';
import { UserService } from '@wawjs/ngx-bos';
import {
	LanguageService,
	TranslateDirective,
	TranslateService,
} from '@wawjs/ngx-translate';
import { SecurityModel } from './settings.interface';
import { securitySchema } from './settings.schema';

@Component({
	imports: [
		InputComponent,
		ButtonComponent,
		ThemeComponent,
		MaterialComponent,
		TranslateDirective,
	],
	templateUrl: './settings.component.html',
})
export class SettingsComponent {
	readonly userService = inject(UserService);
	readonly languageService = inject(LanguageService);
	readonly translateService = inject(TranslateService);
	private readonly _destroyRef = inject(DestroyRef);

	readonly currentLanguage = computed(() =>
		this.languageService.getLanguage(this.languageService.language()),
	);

	readonly securityModel = signal<SecurityModel>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	readonly securityForm = form(this.securityModel, securitySchema);

	readonly isSecurityDisabled = computed(() => {
		const m = this.securityModel();
		return (
			this.securityForm().invalid() || m.newPassword !== m.confirmPassword
		);
	});

	wSecuritySubmit(): void {
		submit(this.securityForm, (formTree) => {
			const payload = formTree().value() as SecurityModel;

			this.userService
				.changePassword(payload.currentPassword, payload.newPassword)
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe({
					next: () => {
						this.securityForm().reset();
						this.securityModel.set({
							currentPassword: '',
							newPassword: '',
							confirmPassword: '',
						});
					},
				});

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

	nextLanguage(): void {
		const languages = this.languageService.languages();
		if (languages.length < 2) return;

		const code = this.languageService.language();
		const index = languages.findIndex((language) => language.code === code);
		const nextLanguage =
			languages[(index + 1) % languages.length] ?? languages[0];

		void this.languageService.setLanguage(nextLanguage.code);
	}
}
