/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import hoistNonReactStatics from 'hoist-non-react-statics'
// @ts-ignore (peer dependency)
import i18next from 'i18next'
import { useMemo } from 'react'
// @ts-ignore (peer dependency)
import { I18nextProvider, initReactI18next } from 'react-i18next'
import type { AppProps as NextJsAppProps } from 'next/app'

type AppProps = NextJsAppProps & {
	pageProps: any
}

export const appWithTranslation = <Props extends AppProps = AppProps>(WrappedComponent: React.ComponentType<Props>) => {
	const AppWithTranslation = (props: any) => {
		const { pageProps } = (props as any) || {}
		const { _nextI18Next } = pageProps || {}
		const { initialI18nStore, initialLocale = props?.router?.locale ?? 'en' } = _nextI18Next || {}

		// Initialize + memoize i18n instance
		const i18n = useMemo(() => {
			i18next.use(initReactI18next).init({
				resources: initialI18nStore,
				lng: initialLocale,
				fallbackLng: initialLocale,
				interpolation: {
					escapeValue: false
				}
			})
			return i18next
		}, [initialLocale, JSON.stringify(initialI18nStore)])

		return (
			<I18nextProvider i18n={i18n}>
				<WrappedComponent key={initialLocale} {...props} />
			</I18nextProvider>
		)
	}

	return hoistNonReactStatics(AppWithTranslation, WrappedComponent)
}
