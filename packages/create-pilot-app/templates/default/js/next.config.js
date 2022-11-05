const withTM = require('next-transpile-modules')(['@expo/next-adapter', '@waveplay/pilot', 'react-native-web']);

const nextConfig = {
	experimental: {
		forceSwcTransforms: true,
		swcTraceProfiling: true,
		swcPlugins: [
			['@nissy-dev/swc-plugin-react-native-web', { 'commonjs': false }]
		]
	},
	webpack: (config) => {
		return {
			...config,
			resolve: {
				...config.resolve || {},
				alias: {
					...config.resolve.alias || {},
					'react-native': 'react-native-web'
				},
				extensions: [
					'.web.ts',
					'.web.tsx',
					'.js',
					'.jsx',
					'.ts',
					'.tsx'
				],
				fallback: {
					...config.resolve.fallback || {},
					fs: false
				}
			}
		};
	}
};

module.exports = withTM(nextConfig);