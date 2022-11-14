/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { Config } from '@waveplay/pilot'

export interface BuildManifest {
	config?: Config
	locales?: {
		[key: string]: string[]
	}
	pages?: {
		[key: string]: {
			getPropsType: 'getServerSideProps' | 'getStaticProps' | null
		}
	}
}
