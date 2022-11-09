/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { GetServerSideProps, GetStaticProps } from 'next';
import type { NextRouter } from 'next/router';
import type { ComponentProps, ComponentType } from 'react';
import { Pilot } from './core/pilot';
import { DataMap } from '../_internal/types';

export interface Logger {
	debug: (...args: any[]) => void
	error: (...args: any[]) => void
	info: (...args: any[]) => void
	warn: (...args: any[]) => void
	trace: (...args: any[]) => void
}

export interface PilotConfig {
	id?: string
	cacheSize?: number
	host?: string
	i18n?: {
		defaultLocale: string
		locales: string[]
	}
	logger?: Logger
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
