import type { AppProps } from 'next/app'
import { Image, Text, View } from 'react-native'
import { MDXProvider } from '@mdx-js/react'

const components = {
	h1: (props) => <Text {...props} style={{ fontSize: 24, fontWeight: '600' }} />,
	h2: (props) => <Text {...props} style={{ fontSize: 20, fontWeight: '600' }} />,
	h3: (props) => <Text {...props} style={{ fontSize: 16, fontWeight: '600' }} />,
	h4: (props) => <Text {...props} style={{ fontSize: 14, fontWeight: '600' }} />,
	h5: (props) => <Text {...props} style={{ fontSize: 12, fontWeight: '600' }} />,
	h6: (props) => <Text {...props} style={{ fontSize: 10, fontWeight: '600' }} />,
	blockquote: (props) => <Text {...props} style={{ fontStyle: 'italic' }} />,
	pre: (props) => <View {...props} />,
	code: (props) => <Text {...props} style={{ fontFamily: 'monospace' }} />,
	table: (props) => <View {...props} />,
	th: (props) => <Text {...props} style={{ fontWeight: '600' }} />,
	td: (props) => <Text {...props} />,
	tr: (props) => <View {...props} />,
	ul: (props) => <View {...props} />,
	ol: (props) => <View {...props} />,
	li: (props) => <View {...props} />,
	p: (props) => <Text {...props} />,
	img: (props) => <Image {...props} />
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<MDXProvider components={components}>
			<Component {...pageProps} />
		</MDXProvider>
	)
}
