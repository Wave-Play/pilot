// @ts-check
const withTM = require('next-transpile-modules')(['@waveplay/pilot', 'react-native-web'])

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	experimental: {
		forceSwcTransforms: true,
		swcPlugins: [['@nissy-dev/swc-plugin-react-native-web', { commonjs: false }]]
	},
	webpack: (config) => {
		return {
			...config,
			resolve: {
				...(config.resolve || {}),
				extensions: ['.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
				fallback: {
					...(config.resolve.fallback || {}),
					fs: false
				}
			}
		}
	}
}

module.exports = withTM(nextConfig)
