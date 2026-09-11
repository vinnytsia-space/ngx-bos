import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '@wawjs/ngx-bos';

@Component({
	imports: [RouterOutlet],
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent {
	private readonly _httpService = inject(UserService);
}
