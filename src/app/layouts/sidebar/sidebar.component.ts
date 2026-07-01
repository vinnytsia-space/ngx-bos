import {
	Component,
	computed,
	inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialComponent, ThemeService } from '@wawjs/ngx-ui';
import { UserService } from '@wawjs/ngx-bos';
import { TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { SidebarService } from './sidebar.service';

@Component({
	selector: 'layout-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	imports: [RouterLink, TranslateDirective, MaterialComponent],
})
export class SidebarComponent {
	readonly themeService = inject(ThemeService);
	readonly userService = inject(UserService);
	readonly translateService = inject(TranslateService);
	readonly sidebarService = inject(SidebarService);

	readonly showNames = this.sidebarService.showNames;
	readonly widthPx = this.sidebarService.widthPx;

	readonly isPreview = this.sidebarService.previewVisible;
	readonly isMobile = this.sidebarService.isMobile;

	readonly isOverlay = computed(() => this.isMobile() || this.isPreview());
	readonly isMinimized = computed(
		() =>
			!this.isMobile() &&
			!this.isPreview() &&
			this.sidebarService.webMode() === 'minimized',
	);

	closeIfOverlay(): void {
		if (this.isOverlay()) this.sidebarService.closeAfterNavigation();
	}

	closeBackdrop(e: MouseEvent): void {
		e.preventDefault();
		e.stopPropagation();

		this.sidebarService.requestClose();
	}

	logout(): void {
		this.userService.logout();
		this.sidebarService.closeAfterNavigation();
	}
}
