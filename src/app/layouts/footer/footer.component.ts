import {
	Component,
	computed,
	inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@env';
import { ButtonComponent, MaterialComponent, ThemeService } from '@wawjs/ngx-ui';
import { UserService } from '@wawjs/ngx-bos';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { FooterLink } from './footer.types';

@Component({
	selector: 'layout-footer',
	templateUrl: './footer.component.html',
	imports: [
		RouterLink,
		MaterialComponent,
		TranslateDirective,
		ButtonComponent,
	],
})
export class FooterComponent {
	readonly userService = inject(UserService);
	readonly themeService = inject(ThemeService);

	readonly year = new Date().getFullYear();
	readonly metaTitle = environment.meta.title;
	readonly metaDescription = environment.meta.description;

	readonly mode = computed(() => this.themeService.mode() ?? 'light');
	readonly modes = computed(() => this.themeService.modes());

	readonly density = computed(
		() => this.themeService.density() ?? 'comfortable',
	);
	readonly densities = computed(() => this.themeService.densities());

	readonly radius = computed(() => this.themeService.radius() ?? 'rounded');
	readonly radiuses = computed(() => this.themeService.radiuses());

	setMode(mode: string): void {
		this.themeService.setMode(mode);
	}

	setDensity(density: string): void {
		this.themeService.setDensity(density);
	}

	setRadius(radius: string): void {
		this.themeService.setRadius(radius);
	}

	private readonly allLinks = computed<FooterLink[]>(() => [
		{ label: 'Головна', icon: 'home', to: '/' },
		{ label: 'Профіль', icon: 'account_circle', to: '/profile' },
		{
			label: 'Користувачі',
			icon: 'manage_accounts',
			to: '/admin/users',
			adminOnly: true,
		},
		{
			label: 'Клієнти',
			icon: 'people',
			to: '/admin/clients',
			adminOnly: true,
		},
		{
			label: 'Форми',
			icon: 'backup_table',
			to: '/admin/forms',
			adminOnly: true,
		},
		{
			label: 'Переклади',
			icon: 'translate',
			to: '/admin/translates',
			adminOnly: true,
		},
	]);

	readonly links = computed(() => {
		const isAdmin = this.userService.role('admin');
		return this.allLinks().filter((l) => !l.adminOnly || isAdmin);
	});
}
