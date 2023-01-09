import { install } from '../helpers/install'
import cpy from 'cpy'
import os from 'os'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

import { GetTemplateFileArgs, InstallTemplateArgs } from './types'

/**
 * Get the file path for a given file in a template, e.g. "next.config.js".
 */
export const getTemplateFile = ({ template, mode, file }: GetTemplateFileArgs): string => {
	return path.join(__dirname, template, mode, file)
}

/**
 * Install a Next.js internal template to a given `root` directory.
 */
export const installTemplate = async ({
	appName,
	root,
	packageManager,
	isOnline,
	template,
	mode,
	eslint
}: InstallTemplateArgs) => {
	console.log(chalk.bold(`Using ${packageManager}.`))
	/**
	 * Create an app.json for the new project.
	 */
	const appJson = {
		expo: {
			name: appName,
			slug: appName,
			version: '0.1.0',
			orientation: 'portrait',
			icon: './assets/icon.png',
			userInterfaceStyle: 'light',
			entryPoint: 'node_modules/@waveplay/pilot/AppEntry.js',
			splash: {
				image: './assets/splash.png',
				resizeMode: 'contain',
				backgroundColor: '#ffffff'
			},
			updates: {
				fallbackToCacheTimeout: 0
			},
			assetBundlePatterns: ['**/*'],
			ios: {
				supportsTablet: true
			},
			android: {
				adaptiveIcon: {
					foregroundImage: './assets/adaptive-icon.png',
					backgroundColor: '#FFFFFF'
				}
			},
			web: {
				favicon: './assets/favicon.png'
			}
		}
	}

	/**
	 * Write it to disk.
	 */
	fs.writeFileSync(path.join(root, 'app.json'), JSON.stringify(appJson, null, 2) + os.EOL)

	/**
	 * Enable legacy peer dependencies via .npmrc
	 * This is due to Next.js 13 wanting React 18.2.0 whereas Expo only supports up to 18.1.0
	 */
	if (packageManager === 'npm') {
		fs.writeFileSync(path.join(root, '.npmrc'), 'legacy-peer-deps=true')
	}

	/**
	 * Create a package.json for the new project.
	 */
	const packageJson = {
		name: appName,
		version: '0.1.0',
		private: true,
		scripts: {
			build: 'next build && pilot build',
			'build:next': 'next build',
			'build:pilot': 'pilot build',
			dev: 'pilot dev',
			'dev:native': 'expo start',
			'dev:web': 'next dev',
			lint: 'next lint',
			'start:native': 'expo start',
			'start:web': 'next start'
		}
	}
	/**
	 * Write it to disk.
	 */
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL)
	/**
	 * These flags will be passed to `install()`, which calls the package manager
	 * install process.
	 */
	const installFlags = { packageManager, isOnline }
	/**
	 * Default dependencies.
	 */
	const dependencies = [
		'expo@47.0.6',
		'next@13.1.1',
		'react@18.1.0',
		'react-dom@18.1.0',
		'react-native@0.70.5',
		'react-native-web@0.18.9',
		'@waveplay/pilot@3.0.0'
	]
	const devDependencies = ['@babel/core@7.20.2', '@nissy-dev/swc-plugin-react-native-web@0.3.0', 'next-transpile-modules@10.0.0', 'webpack@5.75.0']
	/**
	 * TypeScript projects will have type definitions and other devDependencies.
	 */
	if (mode === 'ts') {
		devDependencies.push('@types/react@18.0.25', '@types/react-native@0.70.5', 'typescript@4.9.3')
	}

	/**
	 * Default eslint dependencies.
	 */
	if (eslint) {
		devDependencies.push('eslint', 'eslint-config-next')
	}
	/**
	 * Install package.json dependencies if they exist.
	 */
	if (dependencies.length) {
		console.log()
		console.log('Installing dependencies:')
		for (const dependency of dependencies) {
			console.log(`- ${chalk.cyan(dependency)}`)
		}
		console.log()

		await install(root, dependencies, installFlags)
	}
	/**
	 * Install package.json devDependencies if they exist.
	 */
	if (devDependencies.length) {
		console.log()
		console.log('Installing devDependencies:')
		for (const dependency of devDependencies) {
			console.log(`- ${chalk.cyan(dependency)}`)
		}
		console.log()

		await install(root, devDependencies, { ...installFlags, devDependencies: true })
	}
	/**
	 * Copy the template files to the target directory.
	 */
	console.log('\nInitializing project with template:', template, '\n')
	const templatePath = path.join(__dirname.replace('/dist/templates', ''), 'templates', template, mode)
	await cpy('**', root, {
		parents: true,
		cwd: templatePath,
		rename: (name) => {
			switch (name) {
				case 'gitignore':
				case 'eslintrc.json': {
					return '.'.concat(name)
				}
				// README.md is ignored by webpack-asset-relocator-loader used by ncc:
				// https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
				case 'README-template.md': {
					return 'README.md'
				}
				default: {
					return name
				}
			}
		}
	})

	if (!eslint) {
		// remove un-necessary template file if eslint is not desired
		await fs.promises.unlink(path.join(root, '.eslintrc.json'))
	}
}

export * from './types'
