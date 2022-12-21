// @ts-check
const createWithMDX = require('@next/mdx')
const withTM = require('next-transpile-modules')(['@waveplay/pilot', 'react-native-web'])

// MDX configuration
const withMDX = createWithMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
		providerImportSource: '@mdx-js/react'
	}
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	experimental: {
		forceSwcTransforms: true,
		swcTraceProfiling: true,
		swcPlugins: [['@nissy-dev/swc-plugin-react-native-web', { commonjs: false }]]
	},
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
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

module.exports = (phase, defaultConfig) => {
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
