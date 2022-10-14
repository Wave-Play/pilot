/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { NextRouter } from 'next/router';
import { ComponentProps, ComponentType, createElement, ReactElement } from 'react';
import { PilotRouteOptions } from './route';
import { RadixRouter } from './radix-router';
import lru, { Lru } from 'tiny-lru';
import { Default404, Default500, generateNumber } from './internal';
import pino from 'pino';

interface ActionResult {
	page?: PilotPage
	redirect?: string
}

type DataMap = { [key: string]: string }

interface FlightOptions {
	action: (path: string) => Promise<ActionResult | null>
	addToStack?: boolean
}

type Url = string | {
	pathname: string
	query?: DataMap
}

export interface PilotConfig {
	id?: string
	cacheSize?: number
	i18n?: {
		defaultLocale: string
		locales: string[]
	}
	logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error'
	nextRouter?: NextRouter | null
	router?: PilotRouter
}

export interface PilotFlyOptions {
	locale?: string | false
	scroll?: boolean
	shallow?: boolean
}

export interface PilotEvent {
	error?: any
	page?: PilotPage
	type: PilotEventType
}

export type PilotEventType = '*' | 'error' | 'load-complete' | 'load-start' | 'redirect'

export interface PilotHook {
	callback: (path: string, event: PilotEvent) => string | void
	id: number
	type: PilotEventType
}

export interface PilotPage {
	component: ComponentType
	params: DataMap
	props: ComponentProps<any>
	query: DataMap
}

export interface PilotRouter {
	addRoute: (route: PilotRouteOptions) => void
	find: (path: string, options: PilotRouterOptions) => PilotRouteResult
	removeRoute: (path: string) => void
	stats: () => {
		key: string
		numRoutes: number
		routes: PilotRouteOptions[]
	}
}

export interface PilotRouterOptions {
	pilot: Pilot
}

export interface PilotRouteResult extends PilotRouteOptions {
	params?: DataMap
	query?: DataMap
}

export interface PilotStateProps {
	visible?: boolean
}

export class Pilot {
	// Constructor parameters
	private _config: PilotConfig;

	// Loaded props cache
	private _cache: Lru;

	// Handy lil' logger for debugging
	private _logger = pino();

	// Trackers
	private _currentLocale?: string;
	private _currentPage?: PilotPage;
	private readonly _hooks: PilotHook[] = [];
	private readonly _stack: string[] = [];

	constructor(config?: PilotConfig) {
		this._config = config || {};

		// Update log level based on preference
		this._logger.level = config?.logLevel || 'warn';

		// Create cache
		this._cache = lru(config?.cacheSize || 100);

		// Use built-in default router if none is specified
		if (!config?.router) {
			this._config.router = new RadixRouter();
		}

		// Assign default path if router was provided
		if (config?.nextRouter) {
			this._stack.push(config?.nextRouter.asPath);
		}

		this._logger.debug(`[${this._getId()}] New instance created`);
	}

	public addHook(event: PilotEventType, callback: (path: string, event: PilotEvent) => void): number {
		this._logger.debug(`[${this._getId()}] addHook()`);
		const id = generateNumber();
		this._hooks.push({
			callback,	id, type: event
		});
		return id;
	}

	public addRoute(route: PilotRouteOptions) {
		this._logger.debug(`[${this._getId()}] addRoute(${JSON.stringify(route)})`);
		if (!this._config.router) throw new Error('');
		this._config.router.addRoute(route);
	}

	public async back() {
		this._logger.debug(`[${this._getId()}] back()`);

		// Get previous page in stack
		this._stack.pop();
		const path = this._stack[this._stack.length - 1];

		return this._fly(path, {
			action: async (path: string) => {
				// Delegate to NextJS router if one exists; use internal otherwise
				if (this._config.nextRouter) {
					const event = eventWaiter('popstate');
					this._config.nextRouter.back();
					window.removeEventListener('popstate', await event);
					return null;
				} else {
					return await this._load(path);
				}
			},
			addToStack: false
		});
	}

	public config(config: PilotConfig) {
		this._logger.debug(`[${this._getId()}] config(${JSON.stringify(config)})`);

		// Update only defined properties from new config
		// You can still remove/reset a property by setting it to null
		for (const key in config) {
			if (config[key] !== undefined) {
				this._config[key] = config[key];
			}
		}

		// Update config for cache and logger separately
		this._cache.max = config?.cacheSize !== undefined ? config.cacheSize : 100;
		this._logger.level = config?.logLevel || 'warn';
		this._currentLocale = config?.i18n?.defaultLocale;
	}

	public getDefaultLocale(): string | undefined {
		return this._config.i18n?.defaultLocale;
	}

	public getLocale(): string | undefined {
		this._logger.debug(`[${this._getId()}] getLocale()`);
		return this._currentLocale;
	}

	public getLocales(): string[] | undefined {
		this._logger.debug(`[${this._getId()}] getLocales()`);
		return this._config.i18n?.locales;
	}

	public getParams(): DataMap {
		this._logger.debug(`[${this._getId()}] getParams()`);
		return this._currentPage?.params || {};
	}

	public getPath(options?: { includeLocale?: boolean }): string {
		this._logger.debug(`[${this._getId()}] getPath()`);
		const { includeLocale } = options || {};

		if (this._config.nextRouter) {
			return this._config.nextRouter.asPath;
		} else if (includeLocale && this._currentLocale) {
			return '/' + this._currentLocale + this._stack[this._stack.length - 1];
		} else {
			return this._stack[this._stack.length - 1];
		}
	}

	public getProps(): any {
		this._logger.debug(`[${this._getId()}] getProps()`);
		return this._currentPage?.props || {};
	}

	public getQuery(): DataMap {
		this._logger.debug(`[${this._getId()}] getQuery()`);
		if (this._config.nextRouter) {
			return this._config.nextRouter.query as DataMap;
		} else {
			return this._currentPage?.query || {};
		}
	}

	/**
	 * Equivalent to Next's router.push().
	 * Updates content with registered path component, also loading their props.
	 * If a placeholder has been specified, it'll render that while the props are fetching.
	 * 
	 * @param path 
	 */
	public async fly(url: Url, as?: string, options?: PilotFlyOptions) {
		this._logger.debug(`[${this._getId()}] fly(${JSON.stringify(url)})`);

		return this._fly(url, {
			action: async (path: string) => {
				// Delegate to NextJS router if one exists; use internal router otherwise
				if (this._config.nextRouter) {
					// Account for updated path (e.g. hook overrides)
					if (typeof url !== 'string') {
						url.pathname = path;
					}

					await this._config.nextRouter.push(url, as, options);
					return null;
				} else {
					return await this._load(path, options);
				}
			}
		});
	}

	public log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', message?: string, ...args: any[]) {
		this._logger[level](`[${this._getId()}] ` + message, ...args);
	}

	public async reload() {
		this._logger.debug(`[${this._getId()}] refresh()`);

		// Get previous page in stack
		const path = this._stack[this._stack.length - 1];

		return this._fly(path, {
			action: async (path: string) => {
				// Delegate to NextJS router if one exists; use internal otherwise
				if (this._config.nextRouter) {
					const event = eventWaiter('load');
					this._config.nextRouter.reload();
					window.removeEventListener('load', await event);
					return null;
				} else {
					return await this._load(path);
				}
			},
			addToStack: false
		});
	}

	public removeHook(id: number) {
		this._logger.debug(`[${this._getId()}] removeHook(${id})`);
		const index = this._hooks.findIndex(hook => hook.id === id);
		this._hooks.splice(index, 1);
	}

	public removeRoute(path: string) {
		this._logger.debug(`[${this._getId()}] removeRoute(${path})`);
		this._config.router?.removeRoute(path);
	}

	public render(): ReactElement | null {
		this._logger.debug(`[${this._getId()}] render()`);

		// Can't render anything if no page has been set
		if (!this._currentPage) return null;

		// Render whatever is currently set, plus the props!
		const { component, props } = this._currentPage;
		return createElement(component, props);
	}

	public stats() {
		return {
			id: this._getId(),
			logLevel: this._logger.level,
			nextRouter: !!this._config.nextRouter,
			path: this.getPath() || null,
			params: this.getParams(),
			routerStats: this._config.router?.stats(),
			query: this.getQuery(),
			stackLength: this._stack.length,
		}
	}

	/**
	 * Boilerplate function mainly used to de-duplicate a lot of logic.
	 * To be called by certain other functions like back(), fly(), and refresh().
	 * 
	 * @param path Path to navigate to. Mainly used for notifying listeners.
	 * @param options Should contain action to execute + other options.
	 */
	private async _fly(url: Url, options: FlightOptions) {
		const { action, addToStack = true } = options;

		// Get path from URL or use directly if string
		let path = typeof url === 'string' ? url : url.pathname;

		// Query values are important too, ya know
		if (typeof url !== 'string' && url.query) {
			let token = '?';
			for (let key in url.query) {
				path += `${token}${key}=${url.query[key]}`;
				token = '&';
			}
		}

		// Notify listeners and allow them to modify the path
		const originalPath = path;
		path = await this._notify(path, { type: 'load-start' });
		if (path !== originalPath) {
			this._logger.info(`[${this._getId()}] A hook has modified this path: ${path}`);
		}

		try {
			// Execute specified action
			const result = await action(path);

			// If redirected, recursively call this function again with the new path after notifying hooks
			if (result?.redirect) {
				this._notify(path, { type: 'redirect' });
				return await this._fly(result.redirect, options);
			}
			this._currentPage = result?.page;
		} catch (e) {
			// In case of error, exit early & notify listeners
			this._logger.error(`[${this._getId()}] Error while executing action:`, e);
			this._notify(path, {
				type: 'error',
				page: undefined
			});
		}

		// Add to stack
		if (addToStack) {
			this._stack.push(path);
			this._logger.debug(`[${this._getId()}] New stack size: ${this._stack.length}`);
		}

		// Notify listeners
		this._notify(path, {
			type: this._config.nextRouter || this._currentPage ? 'load-complete' : 'error',
			page: this._currentPage
		});
	}

	/**
	 * Convenience function to get the unique ID for this pilot.
	 */
	private _getId(): string {
		return `pilot${this._config.id ? '-' + this._config.id : ''}`;
	}

	/**
	 * Loads a page and its props by calling it's `getServerSideProps()` or `getStaticProps()` function.
	 * The result is then stored into _currentPage to be rendered via the `render()` function.
	 * 
	 * This will not create an instance of the page component, but rather just call the props function.
	 * The component instance will be created when the page is rendered.
	 * 
	 * @param path Path to load.
	 * @returns Component and props for the specified path. If no component is found, returns null.
	 */
	private async _load(path: string, options?: PilotFlyOptions): Promise<ActionResult> {
		const hasQuery = path.includes('?');

		// Handle locale prefix only as long as caller doesn't opt out
		if (options?.locale !== false) {
			// If this path starts with another registered locale, make sure to update the current locale
			const locale = options?.locale || this._config.i18n?.locales?.find(locale => 
				path.startsWith(`/${locale}/`)
				|| path === `/${locale}`
				|| (hasQuery && path.substring(0, path.indexOf('?')) === `/${locale}`)
			);
			if (locale && locale !== this._currentLocale) {
				this._logger.debug(`[${this._getId()}] Locale changed from ${this._currentLocale} to ${locale}`);
				this._currentLocale = locale;
			}

			// Paths are handled internally, so we need to strip the locale prefix or router won't match
			if (path.startsWith(`/${this._currentLocale}/`)) {
				path = path.replace(`/${this._currentLocale}`, '');
			} else if (path === `/${this._currentLocale}`) {
				path = '/';
			} else if (hasQuery && path.substring(0, path.indexOf('?')) === `/${this._currentLocale}`) {
				path = '/';
			}
		}

		// Look up the route data for this path
		let route = this._config.router?.find(path, { pilot: this });

		// If no route is found, load 404 page instead
		if (route) {
			this._logger.debug(`[${this._getId()}] Route found for path: ${path} ...`, route);
		} else if (path === '/404' || path === '/500') {
			// Assign a default 404 page if none is found for convenience and to avoid infinite loops
			this._logger.warn(`[${this._getId()}] Using default ${path} ...`);
			route = {
				component: path === '/404' ? Default404 : Default500,
				path, params: {}, query: {}
			};
		} else {
			this._logger.warn(`[${this._getId()}] No route found for path: ${path}`);
			return await this._load('/404');
		}

		// Call this page's internal server side or static props function
		// This will emulate a NextJS page load, but without the usual server parameters, so be aware
		let props: any;
		try {
			props = await this._loadProps(path, route);
		} catch (e) {
			this._logger.error(`[${this._getId()}] Error loading props for path: ${path}`, e);
			this._notify(path, { error: e, type: 'error' });
			return await this._load('/500');
		}

		if (props?.props) {
			this._logger.info(`[${this._getId()}] Loaded props for ${path}:`, Object.keys(props.props));
		} else if (props?.notFound) {
			this._logger.info(`[${this._getId()}] Route responded with "notFound": ${path}`);
			return await this._load('/404');
		} else if (props?.redirect?.destination) {
			this._logger.info(`[${this._getId()}] Route responded with "redirect": ${path} -> ${props.redirect.destination}`);
			return {
				redirect: props.redirect.destination
			};
		}

		return {
			page: {
				component: route.component,
				params: route.params || {},
				props: props?.props,
				query: route.query || {}
			}
		};
	}

	/**
	 * Calls route's getProps() function to load props for the specified path.
	 * This basically emulates NextJS' getServerSideProps() or getStaticProps() function.
	 * If a "revalidate" value is returned, it will be stored in our LRU memory cache.
	 * 
	 * @param path Path to load.
	 * @param route Route for the specified path.
	 * @returns Props for the specified path.
	 */
	private async _loadProps(path: string, route: PilotRouteResult): Promise<any> {
		let props: any = null;

		// Return early if there's nothing to load
		if (!route.getProps) {
			return props;
		}

		// See if we can find a cached version of this page's props
		const cacheKey = (this._currentLocale || '') + path + JSON.stringify(route.query);
		const cachedProps = this._cache.get(cacheKey);
		const isExpired = !cachedProps || cachedProps?.__pilot?.expires < Date.now();
		if (cachedProps && isExpired) {
			this._logger.debug(`[${this._getId()}] Cached props for ${path} have expired, removing from cache...`);
			this._cache.delete(cacheKey);
		} else if (cachedProps && !isExpired) {
			this._logger.debug(`[${this._getId()}] Found cached props for path: ${path}`);
			return cachedProps;
		}
		
		// Get props from route's getProps() function
		props = await route.getProps({
			locale: this._currentLocale,
			params: route.params || {},
			query: route.query || {},
			req: {} as any,
			res: {} as any,
			resolvedUrl: path
		});

		// If a "revalidate" value is returned, cache the props for that amount of time
		// This emulates ISR (Incremental Static Regeneration) from NextJS
		if (props?.revalidate) {
			this._logger.debug(`[${this._getId()}] Caching props for path: ${path} (revalidate: ${props.revalidate})`);
			this._cache.set(cacheKey, {
				...props,
				__pilot: {
					expires: Date.now() + props.revalidate * 1000
				}
			});
		}

		return props;
	}

	/**
	 * Notifies all added hooks of a certain event.
	 * This allows hooks to modify the path, or do other things in response to events.
	 * 
	 * @param path Path to notify listeners about.
	 * @param event Event to notify listeners about.
	 * @returns The modified path. If no hooks modify the path, this will be the same as the original.
	 */
	private async _notify(path: string, event: PilotEvent): Promise<string> {
		this._logger.debug(`[${this._getId()}] _notify(${path})`);
		for (let hook of this._hooks) {
			if (hook.type === event.type || hook.type === '*') {
				const result = hook.callback(path, event);
				if (result) {
					path = result;
				}
			}
		}

		return path;
	}
}

/**
 * Smol utility function meant to help us wait for a window event to fire.
 * This is super useful for waiting for window reload and back events!
 */
const eventWaiter = async (event: string): Promise<any> => {
	return new Promise<any>((resolve) => {
		const callback = () => resolve(callback);
		window.addEventListener(event, callback);
	});
};
