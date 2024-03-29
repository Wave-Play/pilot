/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import fs from 'fs-extra'
import koder, { Kode } from '../../koder'
import { getGenDir, syncManifest } from '../..'
import type { OptionValues } from 'commander'
import type { Logger } from 'pino'
import type { DataMap } from '../../../_internal/types'
import type { BuildManifest } from '../../types'

const GENERATED_FILE = 'env.js'

/**
 * Load environment variables prefixed with `NEXT_PUBLIC_` or `PILOT_PUBLIC_` into a file.
 * 
 * This follows the same rules as Next.js:
 * https://nextjs.org/docs/basic-features/environment-variables
 */
export const buildEnv = async (options: OptionValues, logger: Logger) => {
	if (!options.env) {
		logger.debug(`[PilotJS] Skipping environment variables...`)
		return;
	}

	// Start by loading variables already defined in this process' environment
	const publicEnv = Object.keys(process.env)
		.sort()
		.filter(key => key.startsWith('NEXT_PUBLIC_') || key.startsWith('PILOT_PUBLIC_'))
		.reduce((obj, key) => {
			obj[key] = process.env[key];
			return obj;
		}, {} as DataMap)

	if (Object.keys(publicEnv).length) {
		logger.debug(`[PilotJS] Loaded ${Object.keys(publicEnv).length} env variables from process.env`)
	}

	// Allow only `production`, `development`, and `test` environments
	let NODE_ENV: 'production' | 'development' | 'test';
	if (['production', 'development', 'test'].includes(process.env.NODE_ENV)) {
		NODE_ENV = process.env.NODE_ENV as 'production' | 'development' | 'test';
	}

	// Load variables from .env files following the same rules as Next.js
	await loadFile(`.env.${NODE_ENV}.local`, publicEnv, logger)
	if (NODE_ENV !== 'test') {
		await loadFile('.env.local', publicEnv, logger)
	}
	await loadFile(`.env.${NODE_ENV}`, publicEnv, logger)
	await loadFile('.env', publicEnv, logger)

	// Sort publicEnv keys alphabetically
	const env = Object.keys(publicEnv)
		.sort()
		.reduce((obj, key) => {
			obj[key] = publicEnv[key];
			return obj;
		}, {} as DataMap)

	// Write env variables to file
	const kode = koder({ comment: 'This file was automatically generated by PilotJS' })
		.newline()
		.const('env', { export: true })

	await writeEnv(logger, kode, env, options.upDirs)
}

/**
 * Load environment variables from a specified file.
 */
const loadFile = async (file: string, publicEnv: DataMap, logger: Logger) => {
	const envFile = process.cwd() + '/' + file

	if (await fs.pathExists(envFile)) {
		const env = await fs.readFile(envFile, 'utf8')
		const lines = env.split(/\r?\n/g)
		let counter = 0

		for (const line of lines) {
			const [key, value] = line.split('=')
			const isPublic = key.startsWith('NEXT_PUBLIC_') || key.startsWith('PILOT_PUBLIC_')
			if (publicEnv[key] === undefined && isPublic) {
				publicEnv[key] = value.replace(/^"(.*)"$/, '$1')
				counter++
			}
		}

		if (counter) {
			logger.debug(`[PilotJS] Loaded ${counter} env variables from ${file} file`)
		}
	}
}

const writeEnv = async (logger: Logger, kode: Kode, env: DataMap, upDirs: number) => {
	// Write the generated config file
	const file = getGenDir({ upDirs }) + GENERATED_FILE
	await fs.outputFile(file, kode.value(env).toString())
	
	// Apply newly read pages to the manifest
	await syncManifest((manifest: BuildManifest) => {
		manifest.env = env;
	}, logger);
};
