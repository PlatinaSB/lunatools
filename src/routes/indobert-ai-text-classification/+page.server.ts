import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';

type Prediction = {
	score: number;
	label: string;
};

async function getUserFromJWT(token: string | undefined) {
	if (!token || !env.JWT_SECRET) {
		return null;
	}

	try {
		const secret = new TextEncoder().encode(env.JWT_SECRET);

		const { payload } = await jwtVerify(token, secret, {
			algorithms: ['HS256']
		});

		if (!payload.sub) {
			return null;
		}

		return {
			id: Number(payload.sub),
			email: String(payload.email ?? '')
		};
	} catch {
		return null;
	}
}

export const load = (async ({ cookies }) => {
	const token = cookies.get('jwt');

	const user = await getUserFromJWT(token);

	if (!user) {
		throw redirect(303, '/login');
	}

	return {
		user
	};
}) satisfies PageServerLoad;

async function query(text: string, fetchFn: typeof fetch): Promise<Prediction[]> {
	const response = await fetchFn(env.hf_endpoints, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${env.hf_endpoints_key}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			inputs: text,
			parameters: {}
		})
	});

	const result: Prediction[] | { error?: string } = await response.json();

	if (!response.ok) {
		throw new Error(
			'error' in result
				? (result.error ?? 'Detection API request failed.')
				: 'Detection API request failed.'
		);
	}

	return result as Prediction[];
}

export const actions: Actions = {
	detect: async ({ request, fetch, cookies }) => {
		const token = cookies.get('jwt');

		const user = await getUserFromJWT(token);

		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const text = formData.get('text');

		if (typeof text !== 'string' || !text.trim()) {
			return fail(400, {
				error: 'Text cannot be empty.',
				text: ''
			});
		}

		try {
			const result = await query(text.trim(), fetch);

			return {
				success: true,
				text,
				result
			};
		} catch (error) {
			console.error(error);

			return fail(500, {
				error: error instanceof Error ? error.message : 'Failed to detect the text.',
				text
			});
		}
	}
};
