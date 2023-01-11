/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { DataMap, Redirect } from '../_internal/types'
import type { Config } from '../client/types'

export interface BuildManifest {
	config?: Config
	dev?: {
		localUrl?: string | null
		tunnelUrl?: string | null
	}
	env?: DataMap
	locales?: {
		[key: string]: string[]
	}
	pages?: {
		[key: string]: {
			getPropsType: 'getServerSideProps' | 'getStaticProps' | null
		}
	}
	redirects?: Redirect[]
}
