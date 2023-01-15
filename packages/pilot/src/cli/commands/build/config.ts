/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import fs from 'fs-extra';
import path from 'path';
import pino from 'pino'
import { syncManifest } from '../..';
import koder, { Kode } from '../../koder';
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import type { NextConfig } from 'next';
import type { Logger } from 'pino';
import type { BuildManifest } from '../../types';
import type { Config, PilotConfig } from '../../../client/types';
import { pathToFileURL } from 'node:url'

const GENERATED_FILE = 'config.js';

export const readConfig = async <T = any>(logger: Logger, file: string): Promise<T> => {
	try {
		let fileName = file
		let filePath = path.join(process.cwd(), fileName);

		// Ensure file format is resolved absolutely by all platforms correctly
		filePath = pathToFileURL(filePath).toString();

		// Fallback to .mjs if .js does not exist
		if (fileName.endsWith('.js') && !(await fs.pathExists(filePath))) {
			fileName = fileName.replace('.js', '.mjs')
			filePath = filePath.replace('.js', '.mjs')
		}

		const config = await import(filePath);
		const data = typeof config?.default === 'function' ? config.default(PHASE_PRODUCTION_BUILD) : config?.default;
		if (data) {
			logger.debug(`[PilotJS] Found config file: ${fileName}`)
		}

		return data;
	} catch (e) {
		if (logger.level === 'debug') {
			logger.warn(e.message)
		}
		logger.debug(`[PilotJS] Could not read config file: ${file} (or .mjs)`);
		return {} as T;
	}
}

export const buildConfig = async (logger: Logger): Promise<Config> => {
	// Read the config file
	logger.debug(`[PilotJS] Reading config...`);
	const [ config, nextConfig ] = await Promise.all([
		readConfig<Config>(logger, `pilot.config.js`),
		readConfig<NextConfig>(logger, `next.config.js`)
	]);

	// Warn if both "include" and "exclude" are defined
	if (config.pages?.include?.length && config.pages?.exclude?.length) {
		logger.warn(`[PilotJS] Both "include" and "exclude" are defined in the config. "exclude" will filter out "include"`);
	}

	// Steal some Next.js config values
	if (!config.i18n && nextConfig.i18n) {
		config.i18n = nextConfig.i18n;
	}
	if (!config.redirects && nextConfig.redirects) {
		config.redirects = nextConfig.redirects;
	}
	if (!config.rewrites && nextConfig.rewrites) {
		config.rewrites = nextConfig.rewrites;
	}

	// Prepare to write generated config
	let kode = koder({ comment: 'This file was automatically generated by PilotJS' })

	if (config?.logLevel) {
		kode.import('pino', 'pino').newline()
	}
	kode.const('config', { export: true });

	// Skip this step if no config was found
	if (!Object.keys(config).length) {
		logger.debug(`[PilotJS] No config found`);
		await writeConfig(logger, kode, {}, {});
		return config;
	}
	logger.debug(`[PilotJS] Loaded config file`, config);

	// Read rewrites
	let rewrites = undefined;
	if (config.rewrites) {
		const data = await config.rewrites();
		if (Array.isArray(data)) {
			rewrites = data;
		} else {
			rewrites = [data.afterFiles, data.beforeFiles, data.fallback].flat();
		}
	}

	// Write usable config
	logger.debug(`[PilotJS] Writing generated config...`);
	const baseConfig = {
		host: config.host,
		i18n: config.i18n,
		webProps: config.webProps
	}
	await writeConfig(logger, kode, {
		...baseConfig,
		logger: config.logLevel ? pino({ level: config.logLevel }) : undefined,
		redirects: await config.redirects?.(),
		rewrites: rewrites
	}, {
		...baseConfig,
		logLevel: config.logLevel,
		pages: config.pages
	});

	return config;
};

const writeConfig = async (logger: Logger, kode: Kode, pilotConfig: PilotConfig, manifestConfig: Config) => {
	// Write the generated config file
	const file = process.cwd() + '/node_modules/@waveplay/pilot/dist/_generated/' + GENERATED_FILE;
	await fs.outputFile(file, kode.value({
		...pilotConfig,
		logger: pilotConfig.logger
			? koder().call('pino', [{
					level: manifestConfig.logLevel 
				}], {
					newline: false, semicolon: false
				})
			: undefined
	}).toString());

	// Apply newly read pages to the manifest
	await syncManifest((manifest: BuildManifest) => {
		manifest.config = manifestConfig;
		manifest.redirects = pilotConfig.redirects;
		manifest.rewrites = pilotConfig.rewrites;
	}, logger);
};
