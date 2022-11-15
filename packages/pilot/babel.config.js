module.exports = (api) => {
	if (api) {
		api.cache(true)
	}

	return {
		plugins: [
			[
				'@babel/plugin-transform-react-jsx',
				{
					runtime: 'automatic'
				}
			]
		]
	}
}
