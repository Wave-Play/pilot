// Based on https://github.com/expo/expo-cli/blob/master/packages/next-adapter
// and https://github.com/zeit/next.js/tree/canary/examples/with-react-native-web
// and https://github.com/expo/expo-cli/blob/main/packages/webpack-config/web-default/index.html
import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import * as React from 'react'
import { getInitialProps } from '@waveplay/pilot/document'

export class Document extends NextDocument {
	render() {
		return (
			<Html data-color-mode="dark">
				<Head>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

Document.getInitialProps = getInitialProps
export default Document
