/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { GetServerSideProps, GetStaticProps } from 'next'
import type { NextRouter } from 'next/router'
import type { ComponentProps, ComponentType } from 'react'
import type { Pilot } from './core/pilot'
import type { BaseConfig, DataMap, PilotHookCallback } from '../_internal/types'

/**
 * pilot.config.js
 */
export interface Config extends BaseConfig {
	commands?: {
		devNative?: string
		devWeb?: string
	}
	pages?: {
		exclude?: string[]
		include?: string[]
	}
}

export interface Logger {
	debug: (...args: any[]) => void
	error: (...args: any[]) => void
	info: (...args: any[]) => void
	warn: (...args: any[]) => void
	trace: (...args: any[]) => void
}

/**
 * Runtime Pilot.js config
 */
export interface PilotConfig extends BaseConfig {
	id?: string
	logger?: Logger
	nextRouter?: NextRouter | null
	router?: PilotRouter
}

export interface PilotFlyOptions {
	locale?: string | false
	scroll?: boolean
	shallow?: boolean

	/**
	 * Decides when to load props using the web version of this app.
	 *
	 * `'always'` - Always load props using the web version of this app. Will fail if not available or set up.
	 *
	 * `'auto'` - Will load props using the web version of this app only as long as it's set up. (`host` in config)
	 *
	 * `'never'` - Will instead load props using the native app's runtime. Be careful when using Node APIs or environment secrets with this option.
	 */
	webProps?: 'always' | 'auto' | 'never'
}

export interface PilotEvent {
	error?: any
	page?: PilotPage
	type: PilotEventType
}

export type PilotEventType = '*' | 'error' | 'load-complete' | 'load-start' | 'redirect'

export interface PilotHook {
	callback: PilotHookCallback
	id: number
	type: PilotEventType
}

export interface PilotPage {
	Component: ComponentType
	pageProps: ComponentProps<any>
	params: DataMap
	query: DataMap
}

/**
 * PilotPath is an empty component whose sole purpose is to make it easy to define paths.
 * The PilotProvider extracts these props and stores them for navigation.
 */
export interface PilotRouteOptions {
	Component: ComponentType
	getProps?: GetServerSideProps | GetStaticProps
	getPropsType?: 'getStaticProps' | 'getServerSideProps'
	path: string
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
