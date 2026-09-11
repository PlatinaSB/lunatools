import type { LayoutServerLoad } from './$types';
import { jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';

export const load = (async ({ cookies }) => {
	const token = cookies.get('jwt');
	if (!token || !env.JWT_SECRET) {
		return { user: null };
	}
	try {
		const secret = new TextEncoder().encode(env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
		return { user: { email: String(payload.email ?? '') } };
	} catch {
		return { user: null };
	}
}) satisfies LayoutServerLoad;
