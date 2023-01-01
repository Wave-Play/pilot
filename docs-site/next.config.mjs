// @ts-check
import createWithMDX from '@next/mdx'
import createWithTM from 'next-transpile-modules'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from '@mapbox/rehype-prism'

const withTM = createWithTM(['@waveplay/pilot', 'react-native-web'])

// MDX configuration
const withMDX = createWithMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [],
		rehypePlugins: [
			rehypeCodeTitles,
			rehypePrism
		],
		providerImportSource: '@mdx-js/react'
	}
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	optimizeFonts: true,
	experimental: {
		fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
		forceSwcTransforms: true,
		swcTraceProfiling: true,
		swcPlugins: [['@nissy-dev/swc-plugin-react-native-web', { commonjs: false }]]
	},
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	rewrites: async () => [
		{
			source: '/',
			destination: '/docs/getting-started'
		},
		{
			source: '/docs',
			destination: '/docs/getting-started'
		}
	],
	webpack: (config) => {
		return {
			...config,
			resolve: {
				...(config.resolve || {}),
				alias: {
					...(config.resolve.alias || {}),
					'react-native': 'react-native-web'
				},
				extensions: ['.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
				fallback: {
					...(config.resolve.fallback || {}),
					fs: false
				}
			}
		}
	}
}

export default (phase, defaultConfig) => {
	const plugins = [withMDX, withTM]

	return plugins.reduce(
		(config, plugin) => {
			const update = plugin(config)
			// @ts-expect-error
			return typeof update === 'function' ? update(phase, defaultConfig) : update
		},
		{ ...nextConfig }
	)
}
