/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { importResource } from '../_generated/locales'

export const serverSideTranslations = async (
	initialLocale: string,
	namespacesRequired: string[] | undefined = undefined
) => {
	// We need a locale at all times
	if (typeof initialLocale !== 'string') {
		throw new Error('Initial locale argument was not passed into serverSideTranslations')
	}

	// Import only the necessary resources
	const store = {}
	for (let ns of namespacesRequired || []) {
		store[ns] = await importResource(initialLocale, ns)
	}

	return {
		_nextI18Next: {
			initialI18nStore: {
				[initialLocale]: store
			},
			initialLocale,
			ns: namespacesRequired
		}
	}
}
