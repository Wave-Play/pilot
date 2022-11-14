/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { ComponentType } from 'react'
import type { PilotEvent, PilotPage } from '../client/types'

export interface ActionResult {
	page?: PilotPage
	redirect?: string
}

export type DataMap = { [key: string]: string }

export interface FlightOptions {
	action: (path: string) => Promise<ActionResult | null>
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

export type Url =
	| string
	| {
			pathname: string
			query?: DataMap
	  }
