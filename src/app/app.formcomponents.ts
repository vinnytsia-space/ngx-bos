import {
	APP_INITIALIZER,
	ApplicationRef,
	EnvironmentInjector,
	Provider,
	Type,
	createComponent,
} from '@angular/core';
import { FormInterface } from '@wawjs/ngx-form';
import {
	FORM_COMPONENTS as NGX_BOS_FORM_COMPONENTS,
	FORM_COMPONENT_FORM as NGX_BOS_FORM_COMPONENT_FORM,
	FORM_TEMPLATE_COMPONENTS as NGX_BOS_FORM_TEMPLATE_COMPONENTS,
} from '@wawjs/ngx-bos';

export const FORM_COMPONENTS = [
	...NGX_BOS_FORM_COMPONENTS,
	/* addComponentNames */
];

export const FORM_COMPONENT_FORM = (key: string): FormInterface => {
	return (
		{
			/* addComponentForms */
		}[key] || NGX_BOS_FORM_COMPONENT_FORM(key)
	) as FormInterface;
};

export const FORM_TEMPLATE_COMPONENTS: Record<string, Type<unknown>> = {
	...NGX_BOS_FORM_TEMPLATE_COMPONENTS,
	/* addComponents */
};

function registerFormTemplatesFactory(
	injector: EnvironmentInjector,
	appRef: ApplicationRef,
): () => void {
	return () => {
		Object.values(FORM_TEMPLATE_COMPONENTS).forEach((cmp) => {
			const ref = createComponent(cmp, {
				environmentInjector: injector,
			});

			appRef.attachView(ref.hostView);
			(ref.hostView as { detectChanges?: () => void }).detectChanges?.();
		});
	};
}

export const provideFormComponents = (): Provider => {
	return {
		provide: APP_INITIALIZER,
		multi: true,
		useFactory: registerFormTemplatesFactory,
		deps: [EnvironmentInjector, ApplicationRef],
	};
};
