/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import appRoot from 'app-root-path';
import { Command, OptionValues } from 'commander';
import pino from 'pino';
import { buildConfig } from './config';
import { action as buildLocales } from './locales';
import { action as buildPages } from './pages';
import fs from 'fs-extra';

const command = new Command('build')
	.description('creates an optimized build of Pilot.js for your application')
	.option('-s --silent', 'do not print anything')
	.option('-v --verbose', 'print more information for debugging')
	.action(action);
export default command;

export async function action(options: OptionValues) {
	const startTime = Date.now();

	// Create a logger
	const logger = pino({
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

	// Clear existing cache
	logger.debug(`[PilotJS] Clearing cache...`);
	try {
		await fs.remove(appRoot + '/.pilot/cache');
	} catch (e) {
		logger.error('[PilotJS] Failed to clear cache');
	}

	// Prepare configuration first
	logger.debug(`[PilotJS] Starting build...`);
	try {
		await buildConfig(logger);
	} catch (e) {
		logger.debug('[PilotJS] Could not find a valid pilot.config.js file...');
	}

	// Execute all build commands
	await buildPages(options);
	await buildLocales(options);
	logger.info(`[PilotJS] Built in ${Date.now() - startTime}ms ✨`);
};
