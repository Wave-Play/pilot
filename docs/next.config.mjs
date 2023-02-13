// @ts-check
import createWithMDX from '@next/mdx'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from '@mapbox/rehype-prism'
import remarkGfm from 'remark-gfm'

// MDX configuration
const withMDX = createWithMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [
			remarkGfm
		],
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
	transpilePackages: ['@waveplay/pilot', '@waveplay/snazzy', 'react-native-web'],
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
				}
			}
		}
	}
}

export default (phase, defaultConfig) => {
	const plugins = [withMDX]

	return plugins.reduce(
		(config, plugin) => {
			const update = plugin(config)
			// @ts-expect-error
			return typeof update === 'function' ? update(phase, defaultConfig) : update
		},
		{ ...nextConfig }
	)
}
