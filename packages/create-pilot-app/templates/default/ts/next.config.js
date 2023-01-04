// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	experimental: {
		forceSwcTransforms: true,
		swcTraceProfiling: true,
		swcPlugins: [['@nissy-dev/swc-plugin-react-native-web', { commonjs: false }]]
	},
	transpilePackages: ['@waveplay/pilot', 'react-native-web'],
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

module.exports = nextConfig
