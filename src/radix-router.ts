/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { PilotRouter, PilotRouteResult, PilotRouterOptions } from './pilot';
import { PilotRouteOptions } from './route';
import { createRouter } from 'radix3';

export class RadixRouter implements PilotRouter {
	private readonly _router = createRouter();
	private readonly _routes = [];

	addRoute (route: PilotRouteOptions) {
		this._router.insert(route.path, route);
		this._routes.push(route);
	}

	find (path: string, options: PilotRouterOptions): PilotRouteResult {
		options.pilot.log('debug', `RadixRouter: find(${path})`);

		// Find using radix3 library. We also remove query params from the path to avoid param issues.
		const hasQuery = path.includes('?');
		const route = this._router.lookup(hasQuery ? path.substring(0, path.indexOf('?')) : path);
		options.pilot.log('debug', `RadixRouter: Found matching page... ${JSON.stringify(route)}`);

		return route ? {
			component: route.component,
			default: route.default,
			getProps: route.getProps,
			params: route.params,
			path: route.path,
			query: hasQuery ? parseQuery(path) : {}
		} : null;
	}

	removeRoute (path: string) {
		this._router.remove(path);
		const routeIndex = this._routes.findIndex(route => route.path === path);
		this._routes.splice(routeIndex, 1);
	}

	stats () {
		return {
			key: 'radix-router',
			numRoutes: this._routes.length,
			routes: this._routes
		}
	}
}

const parseQuery = (path: string): {[key: string]: any} => {
	let result = {};

	// Parse out queries!
	const queries = path.substring(path.indexOf('?') + 1).split("&");
	for (let queryPair of queries) {
		const query = queryPair.split('=');
		const key = query[0];
		result[key] = query[1].split(',') || [];

		for (let i = 0; i < result[key].length; i++) {
			result[key][i] = decodeURIComponent(result[key][i]);
		}

		// Don't store as array if there's only one value
		if (result[key].length === 1) {
			result[key] = result[key][0];
		}
	}

	return result;
};
