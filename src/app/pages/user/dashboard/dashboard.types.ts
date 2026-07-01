export type DashboardView = 'client';

export interface ProjectCreateModel {
	name: string;
	slug: string;
	description: string;
	isPrivate: boolean;
}

export interface Project {
	_id: string;
	name: string;
	slug: string;
	description: string;
	isPrivate: boolean;
	createdAt: string;
}

export const PROJECT_CREATE_INIT: ProjectCreateModel = {
	name: '',
	slug: '',
	description: '',
	isPrivate: false,
};
