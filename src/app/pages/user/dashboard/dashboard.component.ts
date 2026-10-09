import { TitleCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@wawjs/ngx-ui';
import { ClientComponent } from './client/client.component';
import type { DashboardView } from './dashboard.types';

@Component({
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
	imports: [ButtonComponent, TitleCasePipe, ClientComponent],
})
export class DashboardComponent {
	readonly view = signal<DashboardView>('client');

	views: DashboardView[] = ['client'];

	onSelectView(view: DashboardView) {
		this.view.set(view);
	}
}
