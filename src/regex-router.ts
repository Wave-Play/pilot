/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { PilotRouter, PilotRouteResult, PilotRouterOptions } from './pilot';
import { PilotRouteOptions } from './route';
import { match } from 'node-match-path';

export class RegexRouter implements PilotRouter {
	private readonly _routes: PilotRouteOptions[] = [];

	addRoute (route: PilotRouteOptions) {
		this._routes.push(route);
	}

	find (path: string, options: PilotRouterOptions): PilotRouteResult {
		options.pilot.log('debug', `RegexRouter: find(${path})`);

		// Find saved path that matches this one through an NPM library because I'm lazy
		// node-match-path can't handle dashes, so convert to underscores
		const hasQuery = path.includes('?');
		const cleanPath = hasQuery ? path.substring(0, path.indexOf('?')) : path;
		const route = this._routes.find(savedPath => {
			return match(savedPath.path.replaceAll('-', '_'), cleanPath).matches;
		});
		options.pilot.log('debug', `RegexRouter: Found matching page: ${JSON.stringify(route)}`);

		return route ? {
			...route,
			params: cleanParams(match(route.path, cleanPath).params),
			query: hasQuery ? parseQuery(path) : {}
		} : null;
	}

	removeRoute (path: string) {
		const routeIndex = this._routes.findIndex(route => route.path === path);
		this._routes.splice(routeIndex, 1);
	}

	stats () {
		return {
			key: 'regex-router',
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

const cleanParams = (params: any): any => {
	for (let key in params) {
		const param = params[key];

		// node-match-path can't handle dashes but can handle underscores
		// We never use underscores anyway, so assume that if we see one, it's a dash
		if (key.includes('_')) {
			delete params[key];
			key = key.replaceAll('_', '-');
			params[key] = param;
		}
		if (param.includes('?')) {
			params[key] = param.substring(0, param.indexOf('?'));
		}
	}
	
	return params;
};
