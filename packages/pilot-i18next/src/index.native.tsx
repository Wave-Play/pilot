/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
// @ts-ignore (peer dependency)
import { I18nextProvider, initReactI18next } from 'react-i18next';
// @ts-ignore (peer dependency)
import i18next from 'i18next';
import type { AppProps as NextJsAppProps } from 'next/app';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useMemo } from 'react';
import importResource from './import-resource';

type AppProps = NextJsAppProps & {
  pageProps: any
}

export const serverSideTranslations = async (
	initialLocale: string,
	namespacesRequired: string[] | undefined = undefined,
) => {
	// We need a locale at all times
	if (typeof initialLocale !== 'string') {
		throw new Error('Initial locale argument was not passed into serverSideTranslations');
	}

	// Import only the necessary resources
	const store = {};
	for (let ns of namespacesRequired || []) {
		store[ns] = await importResource(initialLocale, ns);
	}

	return {
		_nextI18Next: {
			initialI18nStore: {
				[initialLocale]: store
			},
			initialLocale,
			ns: namespacesRequired
		}
	};
}

export const appWithTranslation = <Props extends AppProps = AppProps>(
  WrappedComponent: React.ComponentType<Props>
) => {
	const AppWithTranslation = (props: Props) => {
		const { _nextI18Next } = props as any || {};
		const {
			initialI18nStore,
			initialLocale = props?.router?.locale ?? 'en'
		} = _nextI18Next || {};

		// Initialize + memoize i18n instance
		const i18n = useMemo(() => {
			i18next
				.use(initReactI18next)
				.init({
					resources: initialI18nStore,
					lng: initialLocale,
					fallbackLng: initialLocale,
					interpolation: {
						escapeValue: false
					}
				});
				return i18next;
		}, [initialLocale, JSON.stringify(initialI18nStore)]);

		return (
			<I18nextProvider i18n={i18n}>
				<WrappedComponent key={initialLocale} {...props}/>
			</I18nextProvider>
		);
	};

	return hoistNonReactStatics(AppWithTranslation, WrappedComponent);
}
