/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { createElement, FunctionComponent, ReactElement } from 'react'
import { createRouter } from 'radix3'
import type { ActionResult, DataMap, FlightOptions, PilotHookCallback, Redirect, Url } from '../../_internal/types'
import { Default404, Default500 } from '../../_internal/ui'
import { eventWaiter, generateNumber, matchesLocale } from '../../_internal/utils'
import { RadixRouter } from './radix-router'
import { config as defaultConfig } from '../../_generated/config'
import { localUrl, tunnelUrl } from '../../_generated/dev'
import type {
	PilotConfig,
	PilotEvent,
	PilotEventType,
	PilotFlyOptions,
	PilotHook,
	PilotPage,
	PilotRouteOptions,
	PilotRouteResult
} from '../types'

export const PilotRoute: FunctionComponent<PilotRouteOptions> = () => null

export class Pilot {
	// Constructor parameters
	private _config: PilotConfig

	// State
	private _currentLocale?: string
	private _currentPage?: PilotPage
	private readonly _hooks: PilotHook[] = []
	private readonly _routerRedirects = createRouter<Redirect>()
	private readonly _routerRewrites = createRouter<Redirect>()
	private readonly _stack: string[] = []

	// Development only
	private readonly _localUrl?: string | null
	private readonly _localTunnel?: string | null

	constructor(config?: PilotConfig) {
		this._config = {
			...defaultConfig,
			...(config || {})
		}

		// Use built-in default router if none is specified
		if (!config?.router) {
			this._config.router = new RadixRouter()
		}

		// Add redirects to router
		if (this._config?.redirects) {
			for (const redirect of this._config.redirects) {
				this._routerRedirects.insert(redirect.source, redirect)
			}
		}

		// Add rewrites to router
		if (this._config?.rewrites) {
			for (const rewrite of this._config.rewrites) {
				this._routerRewrites.insert(rewrite.source, rewrite)
			}
		}

		// Assign default locale if 18n is enabled
		this._currentLocale = this._config?.i18n?.defaultLocale

		// Assign default path if router was provided
		if (config?.nextRouter) {
			this._stack.push(config?.nextRouter.asPath)
		}

		this.log('debug', `New instance created`)

		// Only use local tunnel outside of production
		if (process.env.NODE_ENV !== 'production') {
			this._localUrl = localUrl
			this._localTunnel = tunnelUrl
		}
		this.log('debug', `Using host: ${this.getHost()}`)
	}

	public addHook(event: PilotEventType, callback: PilotHookCallback): number {
		this.log('debug', `addHook()`)
		const id = generateNumber()
		this._hooks.push({
			callback,
			id,
			type: event
		})
		return id
	}

	public addRoute(route: PilotRouteOptions) {
		this.log('debug', `addRoute(${JSON.stringify(route)})`)
		if (!this._config.router) throw new Error('No router configured')
		this._config.router.addRoute(route)
	}

	public async back() {
		this.log('debug', `back()`)

		// Get previous page in stack
		this._stack.pop()
		const previousPath = this._stack[this._stack.length - 1]

		return this._fly(previousPath, {
			action: async (path: string | undefined) => {
				// Delegate to NextJS router if one exists; use internal otherwise
				if (this._config.nextRouter) {
					const event = eventWaiter('popstate')
					this._config.nextRouter.back()
					window.removeEventListener('popstate', await event)
					return null
				} else {
					return await this._load(path)
				}
			},
			addToStack: false
		})
	}

	public config(config?: PilotConfig): PilotConfig {
		this.log('debug', `config(${JSON.stringify(config)})`)

		// It's perfectly fine to use this method just to get the current config
		if (!config) {
			return this._config
		}

		// Update only defined properties from new config
		// You can still remove/reset a property by setting it to null
		for (const key in config) {
			if (config[key] !== undefined) {
				this._config[key] = config[key]
			}
		}

		// Assign current locale if 18n is enabled
		if (!this._currentLocale) {
			this._currentLocale = config?.i18n?.defaultLocale
		}

		// Add redirects to router
		if (this._config?.redirects) {
			for (const redirect of this._config.redirects) {
				this._routerRedirects.insert(redirect.source, redirect)
			}
		}

		// Add rewrites to router
		if (this._config?.rewrites) {
			for (const rewrite of this._config.rewrites) {
				this._routerRewrites.insert(rewrite.source, rewrite)
			}
		}

		return this._config
	}

	public getDefaultLocale(): string | undefined {
		return this._config.i18n?.defaultLocale
	}

	public getHost(): string {
		this.log('debug', `getHost()`)
		return this._localTunnel ?? this._localUrl ?? this._config.host
	}

	public getLocale(): string | undefined {
		this.log('debug', `getLocale()`)
		return this._currentLocale
	}

	public getLocales(): string[] | undefined {
		this.log('debug', `getLocales()`)
		return this._config.i18n?.locales
	}

	public getParams(): DataMap {
		this.log('debug', `getParams()`)
		return this._currentPage?.params || {}
	}

	public getPath(options?: { includeLocale?: boolean }): string {
		this.log('debug', `getPath()`)
		const { includeLocale } = options || {}

		if (this._config.nextRouter) {
			return this._config.nextRouter.asPath
		} else if (includeLocale && this._currentLocale) {
			const path = this._stack[this._stack.length - 1]
			return path ? '/' + this._currentLocale + path : undefined
		} else {
			return this._stack[this._stack.length - 1]
		}
	}

	public getProps(): any {
		this.log('debug', `getProps()`)
		return this._currentPage?.pageProps || {}
	}

	public getQuery(): DataMap {
		this.log('debug', `getQuery()`)
		if (this._config.nextRouter) {
			return this._config.nextRouter.query as DataMap
		} else {
			return this._currentPage?.query || {}
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
		this.log('debug', `fly(${JSON.stringify(url)})`)

		return this._fly(url, {
			action: async (path: string) => {
				// Delegate to NextJS router if one exists; use internal router otherwise
				if (this._config.nextRouter) {
					// Account for updated path (e.g. hook overrides, redirects)
					if (typeof url !== 'string') {
						// Extract just the pathname from "path" along with any query params
						const splitPath = path.split('?')
						url.pathname = splitPath?.[0]
						url.query = splitPath?.[1]
							?.split('&')
							.reduce((acc, param) => {
								const [key, value] = param.split('=')
								acc[key] = value
								return acc
							}, {} as DataMap)
					}

					await this._config.nextRouter.push(url, as, options)
					return null
				} else {
					return await this._load(path, options)
				}
			}
		})
	}

	public log(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', message?: string, ...args: any[]) {
		const id = `PilotJS${this._config.id ? '-' + this._config.id : ''}`
		if (this._config.logger) {
			this._config.logger?.[level]?.(`[${id}] ` + message, ...args)
		} else if (level === 'error') {
			// Error is the only level that should be logged to console by default
			// You can disable this by passing in a custom logger
			console.error(`[${id}] ` + message, ...args)
		}
	}

	/**
	 * Alias for fly().
	 *
	 * See {@link fly} for more details.
	 */
	public async push(url: Url, as?: string, options?: PilotFlyOptions) {
		return this.fly(url, as, options)
	}

	public async reload() {
		this.log('debug', `refresh()`)

		// Get current page in stack
		const currentPath = this._stack[this._stack.length - 1]

		return this._fly(currentPath, {
			action: async (path: string) => {
				// Delegate to NextJS router if one exists; use internal otherwise
				if (this._config.nextRouter) {
					const event = eventWaiter('load')
					this._config.nextRouter.reload()
					window.removeEventListener('load', await event)
					return null
				} else {
					return await this._load(path)
				}
			},
			addToStack: false
		})
	}

	public removeHook(id: number) {
		this.log('debug', `removeHook(${id})`)
		const index = this._hooks.findIndex((hook) => hook.id === id)
		this._hooks.splice(index, 1)
	}

	public removeRoute(path: string) {
		this.log('debug', `removeRoute(${path})`)
		this._config.router?.removeRoute(path)
	}

	public render(): ReactElement | null {
		this.log('debug', `render()`)

		// Can't render anything if no page has been set
		if (!this._currentPage) return null

		// See if an _app component has been registered (without the unnecessary _load() overhead)
		const appRoute = this._config.router?.find('/_app', { pilot: this })

		// Render whatever is currently set, plus the props!
		// If an _app component has been registered, wrap the page in it
		const { Component, pageProps } = this._currentPage
		if (appRoute) {
			return createElement(appRoute.Component, { Component, pageProps } as any) // safe to assume _app follows this prop signature
		} else {
			return createElement(Component, pageProps)
		}
	}

	public stats() {
		return {
			dev: {
				localUrl: this._localUrl,
				tunnelUrl: this._localTunnel
			},
			host: this._config.host,
			id: this._config.id,
			i18: this._config.i18n,
			logger: this._config.logger,
			nextRouter: !!this._config.nextRouter,
			path: this.getPath() || null,
			params: this.getParams(),
			routerStats: this._config.router?.stats(),
			query: this.getQuery(),
			stackLength: this._stack.length
		}
	}

	/**
	 * Boilerplate function mainly used to de-duplicate a lot of logic.
	 * To be called by certain other functions like back(), fly(), and refresh().
	 *
	 * @param path Path to navigate to. Mainly used for notifying listeners.
	 * @param options Should contain action to execute + other options.
	 */
	private async _fly(url: Url | undefined, options: FlightOptions) {
		const { action, addToStack = true } = options

		// Get path from URL or use directly if string
		let path: string
		if (url) {
			path = typeof url === 'string' ? url : url.pathname

			// Query values are important too, ya know
			if (typeof url !== 'string' && url.query) {
				let token = '?'
				for (let key in url.query) {
					path += `${token}${key}=${url.query[key]}`
					token = '&'
				}
			}

			// Notify listeners and allow them to modify the path
			const originalPath = path
			path = await this._notify(path, { type: 'load-start' })
			if (path !== originalPath) {
				this.log('info', `A hook has modified this path: ${path}`)
			}
		}

		try {
			// Execute specified action
			const result = await action(path)

			// If redirected, recursively call this function again with the new path after notifying hooks
			if (result?.redirect) {
				this._notify(path, { type: 'redirect' })
				const redirect = typeof url === 'string' ? result.redirect : { ...url, pathname: result.redirect }
				return await this._fly(redirect, options)
			}
			this._currentPage = result?.page
		} catch (e) {
			// In case of error, exit early & notify listeners
			this.log('error', `Error while executing action:`, e)
			this._notify(path, {
				type: 'error',
				page: undefined
			})
		}

		// Add to stack
		if (path && addToStack) {
			this._stack.push(path)
			this.log('debug', `New stack size: ${this._stack.length}`)
		}

		// Notify listeners
		if (path) {
			this._notify(path, {
				type: this._config.nextRouter || this._currentPage ? 'load-complete' : 'error',
				page: this._currentPage
			})
		}
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
		const hasQuery = path.includes('?')

		// Handle locale prefix only as long as caller doesn't opt out
		if (options?.locale !== false) {
			// If this path starts with another registered locale, make sure to update the current locale
			const locale = options?.locale ?? matchesLocale(path, this._config.i18n?.locales, hasQuery)

			if (locale && locale !== this._currentLocale) {
				this.log('debug', `Locale changed from ${this._currentLocale} to ${locale}`)
				this._currentLocale = locale
			}

			// Paths are handled internally, so we need to strip the locale prefix or router won't match
			if (path.startsWith(`/${this._currentLocale}/`)) {
				path = path.replace(`/${this._currentLocale}`, '')
			} else if (path === `/${this._currentLocale}`) {
				path = '/'
			} else if (hasQuery && path.substring(0, path.indexOf('?')) === `/${this._currentLocale}`) {
				path = '/'
			}
		}

		// Check if this path matches any of the redirects defined in the config
		const redirect = this._routerRedirects.lookup(hasQuery ? path.substring(0, path.indexOf('?')) : path)

		if (redirect) {
			let destination = redirect.destination
			this.log('info', `Redirect found for path "${path}" -> "${destination}"`)

			// Add query params to redirect destination
			if (hasQuery) {
				destination += path.substring(path.indexOf('?'))
			}

			return {
				redirect: destination
			}
		}

		// Check if this path matches any of the rewrites defined in the config
		const rewrite = this._routerRewrites.lookup(hasQuery ? path.substring(0, path.indexOf('?')) : path)

		if (rewrite) {
			let destination = rewrite.destination
			this.log('info', `Rewrite found for path "${path}" -> "${destination}"`)

			// Add query params to redirect destination
			if (hasQuery) {
				destination += path.substring(path.indexOf('?'))
			}

			path = destination
		}

		// Look up the route data for this path
		let route = this._config.router?.find(path, { pilot: this })

		// If no route is found, load 404 page instead
		if (route) {
			this.log('debug', `Route found for path: ${path} ...`, route)
		} else if (path === '/404' || path === '/500') {
			// Assign a default 404 page if none is found for convenience and to avoid infinite loops
			this.log('warn', `Using default ${path} ...`)
			route = {
				Component: path === '/404' ? Default404 : Default500,
				path,
				params: {},
				query: {}
			}
		} else {
			this.log('warn', `No route found for path: ${path}`)
			return await this._load('/404')
		}

		// Call this page's internal server side or static props function
		// This will emulate a NextJS page load, but without the usual server parameters, so be aware
		let props: any
		try {
			props = await this._loadProps(path, route, options)
		} catch (e) {
			this.log('error', `Error loading props for path: ${path}`, e)
			this._notify(path, { error: e, type: 'error' })

			// If the 500 error page itself has errors, you've got a bigger problem... òwó
			if (path === '/500') {
				this._notify(path, { error: e, type: 'load-complete' })
				throw e
			} else {
				return await this._load('/500')
			}
		}

		if (props?.props) {
			this.log('info', `Loaded props for ${path}:`, Object.keys(props.props))
		} else if (props?.notFound) {
			this.log('info', `Route responded with "notFound": ${path}`)
			return await this._load('/404')
		} else if (props?.redirect?.destination) {
			this.log('info', `Route responded with "redirect": ${path} -> ${props.redirect.destination}`)
			return {
				redirect: props.redirect.destination
			}
		}

		return {
			page: {
				Component: route.Component,
				params: route.params || {},
				pageProps: props?.props,
				query: route.query || {}
			}
		}
	}

	/**
	 * Calls route's getProps() function to load props for the specified path.
	 * This basically emulates NextJS' getServerSideProps() or getStaticProps() function.
	 * If a "revalidate" value is returned, it will be stored in our LRU memory cache.
	 *
	 * On native, these props are called on the server-side if "host" is set, otherwise they are called on the app.
	 *
	 * @param path Path to load.
	 * @param route Route for the specified path.
	 * @returns Props for the specified path.
	 */
	private async _loadProps(path: string, route: PilotRouteResult, options?: PilotFlyOptions): Promise<any> {
		const { webProps = this._config.webProps?.[route.path] ?? 'auto' } = options ?? {}
		let props: any = null

		// Return early if there's nothing to load
		if (!route.getProps) {
			return props
		}

		const host = this.getHost()
		if (webProps === 'always' || (webProps === 'auto' && host)) {
			this.log('debug', `Loading props remotely for path:`, path)
			const response = await fetch(host + '/api/pilot/get-props', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					defaultLocale: this._config.i18n?.defaultLocale,
					locale: this._currentLocale,
					locales: this._config.i18n?.locales,
					path: path
				})
			})
			props = await response.json()
		} else {
			this.log('debug', `Loading props natively for path:`, path)

			// See if we can find a cached version of this page's props
			const cache = this._config.nativeCache
			let cacheKey: string
			if (cache) {
				cacheKey = (this._currentLocale || '') + path
				const cachedProps = cache.get(cacheKey)
				const isExpired = !cachedProps || cachedProps?.__pilot?.expires < Date.now()
				if (cachedProps && isExpired) {
					this.log('debug', `Cached props for ${path} have expired, removing from cache...`)
					cache.delete(cacheKey)
				} else if (cachedProps && !isExpired) {
					this.log('debug', `Found cached props for path: ${path}`)
					return cachedProps
				}
			}

			// Get props from route's getProps() function
			props = await route.getProps({
				defaultLocale: this._config.i18n?.defaultLocale,
				locale: this._currentLocale,
				locales: this._config.i18n?.locales,
				params: route.params ?? {},
				query: route.query ?? {},
				req: {} as any,
				res: {} as any,
				resolvedUrl: path
			})

			// If a "revalidate" value is returned, cache the props for that amount of time
			// This emulates ISR (Incremental Static Regeneration) from NextJS
			if (cache && props?.revalidate) {
				this.log('debug', `Caching props for path: ${path} (revalidate: ${props.revalidate})`)
				cache.set(cacheKey, {
					...props,
					__pilot: {
						expires: Date.now() + props.revalidate * 1000
					}
				})
			}
		}

		return props
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
		this.log('debug', `_notify(${path}, ${event.type})`)
		for (let hook of this._hooks) {
			if (hook.type === event.type || hook.type === '*') {
				const result = hook.callback(path, event)
				if (result) {
					path = result
				}
			}
		}

		return path
	}
}
