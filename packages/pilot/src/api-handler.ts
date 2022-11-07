/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { pino } from 'pino';
import { importPage, pageRoutes } from './_generated-pages'
import { Pilot } from './pilot';
import { RadixRouter } from './radix-router'

// Create router using generated routes
const router = createRouter();
console.log(router);
const pilot = new Pilot({
	id: '__server',
	logger: pino({ level: 'debug' }),
});

export const createHandler = () => {
	return async (req, res): Promise<void> => {
		let {
			query: { route }
		} = req;

		const path = '/' + route.join('/');
		const result = router.find(path, { pilot });
		if (result?.getPropsType) {
			const page = await importPage(result.path);
			const props = await page[result.getPropsType]({});
			pilot.log('debug', `Loaded props:`, props);
		}

		res.status(200).end('Done!');
	};
}

function createRouter() {
	const router = new RadixRouter();

	for (const route of pageRoutes) {
		router.addRoute({
			getPropsType: route.getProps,
			path: route.path,
			Component: null
		});
	}

	return router;
}
