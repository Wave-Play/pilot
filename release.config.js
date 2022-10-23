module.exports = {
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		'@semantic-release/npm',
		'@semantic-release/git'
	],
	release: {
		branches: ['master', 'next', 'beta', 'alpha']
	},
	repositoryUrl: 'https://github.com/Wave-Play/pilot'
};
