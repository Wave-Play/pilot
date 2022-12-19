// @ts-check
const withTM = require('next-transpile-modules')(['@waveplay/pilot', 'react-native-web'])
const { i18n } = require('./next-i18next.config');

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	experimental: {
		forceSwcTransforms: true,
		swcTraceProfiling: true,
		swcPlugins: [['@nissy-dev/swc-plugin-react-native-web', { commonjs: false }]]
	},
	i18n: i18n,
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
	const plugins = [
		withTM
	]

	return plugins.reduce((config, plugin) => {
		const update = plugin(config)
		// @ts-expect-error
		return typeof update === 'function' ? update(phase, defaultConfig) : update
	}, { ...nextConfig })
}
