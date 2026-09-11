import { redirect } from '@sveltejs/kit';

export const POST = ({ cookies }) => {
	cookies.delete('jwt', { path: '/' });
	throw redirect(303, '/login');
};
