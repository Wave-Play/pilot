import React from 'react'
import { getInitialProps } from '@expo/next-adapter/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
	static async getInitialProps(context) {
		const initialProps = await Document.getInitialProps(context)
		return initialProps
	}

	render() {
		return (
			<Html lang="en">
				<Head></Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
CustomDocument.getInitialProps = getInitialProps
