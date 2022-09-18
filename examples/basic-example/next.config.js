const withTM = require('next-transpile-modules')(['@expo/next-adapter', '@waveplay/pilot', 'react-native-web']);
const nextBuildId = require('next-build-id');

const nextConfig = {
	experimental: {
		forceSwcTransforms: true,
		swcTraceProfiling: true,
		swcPlugins: [
			['@nissy-dev/swc-plugin-react-native-web', { 'commonjs': false }]
		]
	},
	generateBuildId: () => nextBuildId({ dir: __dirname, describe: true }),
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
