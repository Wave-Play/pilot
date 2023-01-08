export const metadata = {
	_contentOrder: [
		'/docs/getting-started',
		'/docs/supported-features',
		{
			title: 'Building your application',
			children: [
				'/docs/cli',
				'/docs/managed-entry',
				'/docs/configuration',
				'/docs/advanced-nextjs',
				'/docs/caching',
				'/docs/environment-variables',
				'/docs/i18n',
				'/docs/web-props'
			]
		}
	],
	'/docs/advanced-nextjs': {
		path: '/docs/advanced-nextjs',
		title: 'Advanced Setup for Next.js',
		previous: {
			path: '/docs/configuration',
			title: 'Configuration'
		},
		next: {
			path: '/docs/caching',
			title: 'Caching'
		}
	},
	'/docs/caching': {
		path: '/docs/caching',
		title: 'Caching',
		tableOfContents: [
			{
				text: 'Native runtime cache',
				slug: 'native-runtime-cache',
				subheadings: []
			},
			{
				text: 'Web props cache',
				slug: 'web-props-cache',
				subheadings: []
			}
		],
		previous: {
			path: '/docs/advanced-nextjs',
			title: 'Advanced Setup for Next.js'
		},
		next: {
			path: '/docs/environment-variables',
			title: 'Environment Variables'
		}
	},
	'/docs/cli': {
		path: '/docs/cli',
		title: 'Command Line Interface',
		tableOfContents: [
			{
				text: 'Commands',
				slug: 'commands',
				subheadings: [
					{
						text: 'build',
						slug: 'build'
					},
					{
						text: 'dev',
						slug: 'dev'
					},
					{
						text: 'sync:locales',
						slug: 'sync:locales'
					}
				]
			}
		],
		previous: {
			path: '/docs/supported-features',
			title: 'Supported Features'
		},
		next: {
			path: '/docs/managed-entry',
			title: 'Managed Entry'
		}
	},
	'/docs/configuration': {
		path: '/docs/configuration',
		title: 'Configuration',
		tableOfContents: [
			{
				text: 'pilot.config.js',
				slug: 'pilot.config.js',
				subheadings: [
					{
						text: 'api/path',
						slug: 'apipath'
					},
					{
						text: 'commands/devNative',
						slug: 'commandsdevnative'
					},
					{
						text: 'commands/devWeb',
						slug: 'commandsdevweb'
					},
					{
						text: 'host',
						slug: 'host'
					},
					{
						text: 'i18n',
						slug: 'i18n'
					},
					{
						text: 'logLevel',
						slug: 'loglevel'
					},
					{
						text: 'pages/exclude',
						slug: 'pagesexclude'
					},
					{
						text: 'pages/include',
						slug: 'pagesinclude'
					},
					{
						text: 'webProps',
						slug: 'webprops'
					}
				]
			},
			{
				text: 'Instance configuration',
				slug: 'instance-configuration',
				subheadings: [
					{
						text: 'logger',
						slug: 'logger'
					},
					{
						text: 'nativeCache',
						slug: 'nativecache'
					},
					{
						text: 'nextRouter',
						slug: 'nextrouter'
					}
				]
			}
		],
		previous: {
			path: '/docs/managed-entry',
			title: 'Managed Entry'
		},
		next: {
			path: '/docs/advanced-nextjs',
			title: 'Advanced Setup for Next.js'
		}
	},
	'/docs/environment-variables': {
		path: '/docs/environment-variables',
		title: 'Environment Variables',
		tableOfContents: [
			{
				text: 'Loading environment variables',
				slug: 'loading-environment-variables',
				subheadings: []
			},
			{
				text: 'Server-side environment variables',
				slug: 'server-side-environment-variables',
				subheadings: []
			}
		],
		previous: {
			path: '/docs/caching',
			title: 'Caching'
		},
		next: {
			path: '/docs/i18n',
			title: 'Internationalized Routing'
		}
	},
	'/docs/getting-started': {
		path: '/docs/getting-started',
		title: 'Getting Started',
		tableOfContents: [
			{
				text: 'Quick start',
				slug: 'quick-start',
				subheadings: []
			},
			{
				text: 'Adding to an existing project',
				slug: 'adding-to-an-existing-project',
				subheadings: [
					{
						text: 'A) Managed AppEntry',
						slug: 'a)-managed-appentry'
					},
					{
						text: 'B) Custom AppEntry',
						slug: 'b)-custom-appentry'
					}
				]
			},
			{
				text: 'Usage',
				slug: 'usage',
				subheadings: [
					{
						text: 'Build',
						slug: 'build'
					},
					{
						text: 'Development',
						slug: 'development'
					}
				]
			},
			{
				text: 'Basic usage',
				slug: 'basic-usage',
				subheadings: []
			},
			{
				text: 'Credits',
				slug: 'credits',
				subheadings: []
			},
			{
				text: 'License',
				slug: 'license',
				subheadings: []
			}
		],
		next: {
			path: '/docs/supported-features',
			title: 'Supported Features'
		}
	},
	'/docs/i18n': {
		path: '/docs/i18n',
		title: 'Internationalized Routing',
		tableOfContents: [
			{
				text: 'Getting started',
				slug: 'getting-started',
				subheadings: []
			},
			{
				text: 'Usage',
				slug: 'usage',
				subheadings: []
			},
			{
				text: 'next-i18next',
				slug: 'next-i18next',
				subheadings: [
					{
						text: 'Using web props',
						slug: 'using-web-props'
					},
					{
						text: 'Using the native runtime',
						slug: 'using-the-native-runtime'
					}
				]
			},
			{
				text: 'Example project',
				slug: 'example-project',
				subheadings: []
			}
		],
		previous: {
			path: '/docs/environment-variables',
			title: 'Environment Variables'
		},
		next: {
			path: '/docs/web-props',
			title: 'Web Props'
		}
	},
	'/docs/managed-entry': {
		path: '/docs/managed-entry',
		title: 'Managed Entry',
		tableOfContents: [
			{
				text: 'Custom entry',
				slug: 'custom-entry',
				subheadings: []
			}
		],
		previous: {
			path: '/docs/cli',
			title: 'Command Line Interface'
		},
		next: {
			path: '/docs/configuration',
			title: 'Configuration'
		}
	},
	'/docs/supported-features': {
		path: '/docs/supported-features',
		title: 'Supported Features',
		tableOfContents: [
			{
				text: 'Supported Next.js features',
				slug: 'supported-next.js-features',
				subheadings: []
			}
		],
		previous: {
			path: '/docs/getting-started',
			title: 'Getting Started'
		},
		next: {
			path: '/docs/cli',
			title: 'Command Line Interface'
		}
	},
	'/docs/web-props': {
		path: '/docs/web-props',
		title: 'Web Props',
		tableOfContents: [
			{
				text: 'Setup',
				slug: 'setup',
				subheadings: []
			},
			{
				text: 'Usage',
				slug: 'usage',
				subheadings: []
			}
		],
		previous: {
			path: '/docs/i18n',
			title: 'Internationalized Routing'
		}
	}
}
