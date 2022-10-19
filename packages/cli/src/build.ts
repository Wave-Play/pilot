/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command, OptionValues } from 'commander';
import pino from 'pino';
import { action as buildLocales } from './build-locales';
import { action as buildPages } from './build-pages';

const command = new Command('build')
	.description('creates an optimized build of PilotJS for your application')
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
	logger.debug(`[PilotJS] Starting build...`);

	// Execute all build commands
	await buildPages(options);
	await buildLocales(options);
	logger.info(`[PilotJS] Built in ${Date.now() - startTime}ms ✨`);
};
