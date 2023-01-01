import type { AppProps } from 'next/app'
import { appWithTranslation } from '../pilot-i18next'

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}
export default appWithTranslation(App)
