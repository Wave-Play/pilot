module.exports = {
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'dist/**/*.{js}', 'package.json'],
      message: `chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}`
    }]
	],
	release: {
		branches: ['main', 'next', 'beta', 'alpha']
	},
	repositoryUrl: 'https://github.com/Wave-Play/pilot'
};
