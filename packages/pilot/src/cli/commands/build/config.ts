/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { Config, PilotConfig } from '../../../client/types';
import fs from 'fs-extra';
import type { NextConfig } from 'next';
import path from 'path';
import type { Logger } from 'pino';
import { syncManifest } from '../..';
import koder, { Kode } from '../../koder';
import type { BuildManifest } from '../../types';

const GENERATED_FILE = 'config.js';

export const readConfig = async <T = any>(logger: Logger, file: string): Promise<T> => {
	try {
		const config = await import(path.join(process.cwd(), file));
		return config?.default
	} catch (e) {
		logger.info(`[PilotJS] Could not read config file: ${file}`);
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

	// Prepare to write generated config
	let kode = koder({ comment: 'This file was automatically generated by PilotJS' })
		.const('config', { export: true });

	// Skip this step if no config was found
	if (!Object.keys(config).length) {
		logger.debug(`[PilotJS] No config found`);
		await writeConfig(logger, kode, {});
		return config;
	}
	logger.debug(`[PilotJS] Loaded config file`, config);

	// Write usable config
	logger.debug(`[PilotJS] Writing generated config...`);
	await writeConfig(logger, kode, {
		host: config.host,
		i18n: config.i18n,
		pages: config.pages,
		webProps: config.webProps
	});

	return config;
};

const writeConfig = async (logger: Logger, kode: Kode, value: Config & PilotConfig) => {
	// Write the generated config file
	const file = process.cwd() + '/node_modules/@waveplay/pilot/dist/_generated/' + GENERATED_FILE;
	await fs.outputFile(file, kode.value(value).toString());
	
	// Apply newly read pages to the manifest
	await syncManifest((manifest: BuildManifest) => {
		manifest.config = value;
	}, logger);
};
