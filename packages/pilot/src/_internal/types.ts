/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { ComponentType } from 'react';
import type { PilotPage } from '../types';

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
	getProps?: 'getStaticProps' | 'getServerSideProps'
	importPath?: string
	path: string
}

export type Url = string | {
	pathname: string
	query?: DataMap
}
