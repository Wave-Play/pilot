/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import appRoot from 'app-root-path';
import { Command } from 'commander';
import fs from 'fs-extra';
import klaw from 'klaw';
import pino, { Logger } from 'pino';

// Name of the file that will be generated
const GENERATED_FILE = 'import-resource.js';

const command = new Command('build:locales')
	.description('prebuild all routes from pages directory')
	.option('-s --silent', 'do not print anything')
	.option('-v --verbose', 'print more information for debugging')
	.action(action);
export default command;

async function action(options) {
	const startTime = Date.now();

	// Create a logger
	const logger = pino({
		enabled: !options.silent,
		level: options.verbose ? 'debug' : 'info',
		transport: {
			target: 'pino-pretty'
		}
	});

	// Copy all i18n files from /public into this library
	// This is because React Native apps load from /assets instead, yet importing dynamically is a pain
	await fs.copy(appRoot + '/public/locales', __dirname + '/locales');

	// Generate the import file
	const store = await writeGeneratedFile(logger);
	logger.info(`[PilotJS] Built ${Object.keys(store).length} locales in ${Date.now() - startTime}ms ✨`);
};

const writeGeneratedFile = async (logger: Logger): Promise<any> => {
	// Register every file in a store first to prevent out-of-order imports
	const store = {};
	for await (const file of klaw(__dirname + '/locales')) {
		// Skip directories
		if (file.stats.isDirectory()) {
			continue;
		}

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

	// Begin generating the import file
	let data = 
		`/* AUTO GENERATED */\n\n` +
		`export function importResource(locale, ns) {\n` +
		`\tswitch (locale) {\n`;

	// Each locale in the store will get its own case + nested switch
	for (const locale in store) {
		if (!locale.trim()) continue;
		data +=
			`\t\tcase '${locale}':\n` +
			`\t\t\tswitch (ns) {\n`;

		for (const ns of store[locale]) {
			if (!ns.trim()) continue;
			data +=
				`\t\t\t\tcase '${ns}':\n` +
				`\t\t\t\t\treturn import('./locales/${locale}/${ns}.json');\n`;
		}

		data +=
			`\t\t\t\tdefault:\n` +
			`\t\t\t\t\tthrow new Error('Could not find namespace in "${locale}" locale: ' + ns);\n` +
			`\t\t\t}\n`;
	};

	data +=
		`\t\tdefault:\n` +
		`\t\t\tthrow new Error('Could not find locale: ' + locale);\n` +
		`\t}\n`;

	data +=
		`}\n` +
		`export default importResource;\n`;

	// Override existing stub file with the real deal!
	await fs.outputFile(__dirname + '/' + GENERATED_FILE, data);
	return store;
};
