/**
 * © 2022 WavePlay <dev@waveplay.com>
 */

const native = () => ({
	// presets: ['babel-preset-expo', ['module:metro-react-native-babel-preset', { useTransformReactJSXExperimental: true }]],
	plugins: [
		["@babel/plugin-transform-react-jsx", {
			"runtime": "automatic"
		}]
	]
});

module.exports = (api) => {
	if (api) {
		api.cache(true);
	}

	return native();
};
