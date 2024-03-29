/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command, OptionValues } from 'commander';
import fs from 'fs-extra';
import pino from 'pino';
import { buildConfig } from './config';
import { buildEnv } from './env';
import { buildPages } from './pages';
import { getGenDir, syncManifest } from '../..'
import koder from '../../koder'
import type { Logger } from 'pino'
import type { BuildManifest } from '../../types'

// Development values to reset on each build
const DEV_FILE = 'dev.js'

const command = new Command('build')
	.description('creates an optimized build of Pilot.js for your application')
	.option('-ne --no-env', 'do not load environment variables')
	.option('-s --silent', 'do not print anything')
	.option('-ud --up-dirs <upDirs>', 'number of directories to go up from current directory for generated files')
	.option('-v --verbose', 'print more information for debugging')
	.action(action);
export default command;

export async function action(options: OptionValues, logger?: Logger) {
	const startTime = Date.now();

	// Create a logger
	if (!(logger instanceof pino)) {
		logger = pino({
			enabled: !options.silent,
			level: options.verbose ? 'debug' : 'info',
			timestamp: false,
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true
				}
			}
		});
	}
	logger.debug(`[PilotJS] Using root directory "${process.cwd()}"`);

	// Clear existing cache
	logger.debug(`[PilotJS] Clearing cache...`);
	try {
		await fs.remove(process.cwd() + '/.pilot/cache');
	} catch (e) {
		logger.warn('[PilotJS] Failed to clear cache');
	}

	// Reset development values
	logger.debug(`[PilotJS] Resetting development values...`);
	try {
		const kode = koder({ comment: 'This file was automatically generated by PilotJS' })
			.const('tunnelUrl', { export: true })
			.value(null)
		await fs.outputFile(getGenDir({ upDirs: options.upDirs }) + DEV_FILE, kode.toString())

		// Apply newly read pages to the manifest
		await syncManifest((manifest: BuildManifest) => {
			delete manifest.dev
		}, logger)
	} catch (e) {
		logger.warn('[PilotJS] Failed to reset development values');
	}

	// Prepare configuration first
	logger.debug(`[PilotJS] Starting build...`);
	const config = await buildConfig(logger, options.upDirs);

	// Execute all build commands
	await buildEnv(options, logger);
	await buildPages(logger, config, options.upDirs);
	logger.info(`[PilotJS] Built in ${Date.now() - startTime}ms ✨`);
};
