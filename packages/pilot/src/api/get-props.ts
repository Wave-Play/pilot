/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { importPage, pageRoutes } from '../_generated-pages'
import type { Pilot } from '../pilot'
import { RadixRouter } from '../radix-router'

// Create router using generated routes
const router = createRouter();

export async function handleGetProps (req: NextApiRequest, res: NextApiResponse, pilot: Pilot): Promise<void> {
	const { locale, path } = req.body

	// Validate path
	if (!path) {
		return res.status(400).json({
			error: 'Invalid path. Make sure you are sending a "path" property in the request body.'
		})
	}

	// Find route
	const route = router.find(path, { pilot })
	if (!route) {
		return res.status(404).json({
			error: 'Page not found: ' + path
		})
	}

	// This API shouldn't even be called for pages that don't have getProps
	const { getPropsType } = route
	if (!getPropsType) {
		return res.status(400).json({
			error: 'Page does not have getProps: ' + path
		});
	}

	// Load props for page
	const page = await importPage(path);
	const props = await page[getPropsType]({
		locale, req, res,
		params: route.params ?? {},
		query: route.query ?? {},
		resolvedUrl: path
	});
	pilot.log('debug', `Loaded props:`, props);

	res.status(200).json(props);
};

function createRouter() {
	const router = new RadixRouter();

	for (const route of pageRoutes) {
		router.addRoute({
			getPropsType: route.getPropsType,
			path: route.path,
			Component: null
		});
	}

	return router;
}
