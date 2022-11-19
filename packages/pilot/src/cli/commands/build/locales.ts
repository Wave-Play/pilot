/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command, OptionValues } from 'commander';
import fs from 'fs-extra';
import klaw from 'klaw';
import pino, { Logger } from 'pino';
import { syncManifest } from '../..';
import koder from '../../koder';
import type { BuildManifest } from '../../types';

// Name of the file that will be generated
const GENERATED_FILE = 'import-resource.js';

// Locale directories to read & write to/from
const LOCALES_ASSETS_DIR = process.cwd() + '/assets/locales';
const LOCALES_PUBLIC_DIR = process.cwd() + '/public/locales';

const command = new Command('build:locales')
	.description('syncs locale files and generates static imports')
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
	logger.debug(`[PilotJS] Starting build:locales...`);

	// Make sure the public locales directory exists and return early if it doesn't
	logger.debug(`[PilotJS] Using root directory "${process.cwd()}"`);
	if (!fs.existsSync(LOCALES_PUBLIC_DIR)) {
		logger.warn(`[PilotJS] "/public/locales" does not exist! Skipping build:locales...`);
		return;
	}

	// Copy all i18n files from /public into this library
	// This is because React Native apps load from /assets instead, yet importing dynamically is a pain
	await fs.copy(LOCALES_PUBLIC_DIR, LOCALES_ASSETS_DIR);

	// Register every file in a store first to prevent out-of-order imports
	const store = await readAllLocales(logger);

	// Generate the import file
	await writeGeneratedFile(store, logger);

	// Apply newly read pages to the manifest
	await syncManifest((manifest: BuildManifest) => {
		manifest.locales = {};
		for (const locale in store) {
			manifest.locales[locale] = store[locale];
		}
	}, logger);
	logger.info(`[PilotJS] Built ${Object.keys(store).length} locales in ${Date.now() - startTime}ms ✨`);
};

const readAllLocales = async (logger: Logger): Promise<any> => {
	const store: any = {};
	for await (const file of klaw(LOCALES_ASSETS_DIR)) {
		// Skip directories
		if (file.stats.isDirectory()) {
			continue;
		}
		logger.debug(`[PilotJS] Reading locale namespace "${file.path}"...`);

		// Filter just the pure locale/namespace.json keys
		const path = file.path.substring(file.path.lastIndexOf('/locales') + '/locales'.length + 1);
		const locale = path.substring(0, path.indexOf('/'));
		const ns = path.substring(path.indexOf('/') + 1, path.lastIndexOf('.'));

		// Include this file in the store
		if (!store[locale]) {
			store[locale] = [];
		}
		store[locale].push(ns);
	}

	return store;
};

const writeGeneratedFile = async (store: any, logger: Logger): Promise<void> => {
	const kode = koder({ comment: 'This file was automatically generated by PilotJS' })
		// Create an importResource function that will host all static import statements
		.function('importResource', { export: true, params: ['locale', 'ns'] })
		.block(koder()
			.switch('locale')
			.block(koder()

				// Create a nested switch statement for each locale
				.cases(Object.keys(store).map(locale => ({
					case: locale,
					body: koder().switch('ns')
						.block(koder()

							// Each namespace in the store's locales will get its own case
							.cases(store[locale].map(ns => ({
								case: ns,
								body: koder().import(`../../../../assets/locales/${locale}/${ns}.json`, { dynamic: true, return: true })
							})))
							.default(koder().throw(new Error(`Could not find namespace in "${locale}" locale: \${ns}`)))
						)
				})))
				.default(koder().throw(new Error(`Could not find locale: \${locale}`)))
			)
		);

	// Override existing stub file with the real deal!
	const file = process.cwd() + '/node_modules/@waveplay/pilot-i18next/dist/' + GENERATED_FILE;
	logger.debug(`[PilotJS] Writing ${Object.keys(store).length} locales to "${file}"`);
	await fs.outputFile(file, kode.toString());
};
