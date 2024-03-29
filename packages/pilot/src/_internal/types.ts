/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { ComponentType } from 'react'
import type { PilotEvent, PilotPage } from '../client/types'

export interface ActionResult {
	page?: PilotPage
	redirect?: string
}

export interface BaseConfig {
	host?: string
	i18n?: {
		defaultLocale: string
		locales: string[]
	}
	logLevel?: 'debug' | 'info' | 'warn' | 'error'
	webProps?: {
		[key: string]: 'always' | 'auto' | 'never'
	}
}

export type DataMap = { [key: string]: string }

export interface FlightOptions {
	action: (path: string | undefined) => Promise<ActionResult | null>
	addToStack?: boolean
}

export interface PageModule {
	default: ComponentType
}

export interface PageRoute {
	getPropsType?: 'getStaticProps' | 'getServerSideProps'
	importPath?: string
	path: string
}

export type PilotHookCallback = (path: string, event: PilotEvent) => string | void

export interface Redirect {
	destination: string
	permanent?: boolean
	source: string
}

export interface Rewrite {
	destination: string
	permanent?: boolean
	source: string
}

export type Url =
	| string
	| {
			pathname: string
			query?: DataMap
	  }
