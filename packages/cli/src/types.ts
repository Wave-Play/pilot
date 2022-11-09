/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { PilotConfig } from '@waveplay/pilot'

export interface BuildManifest {
	config?: PilotConfig
	locales?: {
		[key: string]: string[]
	}
	pages?: {
		[key: string]: {
			getPropsType: 'getServerSideProps' | 'getStaticProps' | null
		}
	}
}

export interface Config {
	host?: string
}