/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import appRoot from 'app-root-path';
import { Command, OptionValues } from 'commander';
import fs from 'fs-extra';
import klaw from 'klaw';
import pino, { Logger } from 'pino';
import { Options, transform } from '@swc/core';
import evil from 'eval';
import type { PageRoute } from '@waveplay/pilot/dist/_internal';
import { BuildManifest } from './';
import koder from './koder';

// This is the number of directories to go up to get to the root of the project where pages are
// Because we can't guarantee where the CLI is being run from, we assume 4 directories up is the root
// That's assuming @waveplay/pilot is installed in the root node_modules directory
const DIR_DELTA_DEPTH = 4;

// Name of the file that will be generated
const GENERATED_FILE = '_generated-pages.js';

// Default SWC options used for transforming the code in order to find getProps
// This is meant to be a simple best-effort transform and is not meant to be 100% accurate
const TRANSFORM_OPTIONS: Options = {
	jsc: {
		parser: {
			syntax: 'typescript',
			decorators: true,
			tsx: true
		},
		target: 'es2018'
	},
	module: {
		type: 'commonjs'
	}
};

const command = new Command('build:pages')
	.description('buils a manifest of all pages in the project and generates static imports')
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
	logger.debug(`[PilotJS] Starting build:pages...`);

	// Try scanning the default /pages directory first
	let pages: PageRoute[] = [];
	logger.debug(`[PilotJS] Using root directory "${appRoot}"`);
	try {
		pages = await readAllPages('/pages', logger);
	} catch (e) {
		logger.debug('[PilotJS] Could not find "/pages" directory');
	}

	// If none were found, try scanning the /src/pages directory instead
	// Both of these directions are supported by NextJS, so we should support them too
	if (!pages.length) {
		pages = await readAllPages('/src/pages', logger);
	}

	// Generate file containing info for all pages, including static imports
	await writeGeneratedFile(pages, logger);
	await syncManifest(pages, logger);
	logger.info(`[PilotJS] Built ${pages.length} pages in ${Date.now() - startTime}ms ✨`);
};

const findGetProps = async (filePath: string): Promise<string | null> => {
	// Read the file
	const fileContents = await fs.readFile(filePath, 'utf8');

	// Transforming and evaluating the code is the most "reliable" way to find the getProps function
	// However, this is also the most expensive way to do it and breaks easily
	try {
		const code = (await transform(fileContents, TRANSFORM_OPTIONS))?.code;
		const page = evil(code);

		if (page['getServerSideProps']) {
			return 'getServerSideProps';
		} else if (page['getStaticProps']) {
			return 'getStaticProps';
		}
	} catch {}

	// If the transform/eval method fails, try a simpler method
	// This method is much faster, but also much less accurate and can be thrown off by simple comments
	if (fileContents.includes('getServerSideProps')) {
		return 'getServerSideProps';
	} else if (fileContents.includes('getStaticProps')) {
		return 'getStaticProps';
	}

	return null;
};

const readAllPages = async (directory: string, logger: Logger): Promise<PageRoute[]> => {
	logger.debug(`[PilotJS] Reading pages from "${directory}" directory...`);
	const pages: PageRoute[] = [];
	const readDirectory = appRoot + directory;

	for await (const file of klaw(readDirectory)) {
		// Skip directories
		if (file.stats.isDirectory()) {
			continue;
		}

		// Store page info only as long as it exists (null === skip)
		const page = await readPage(file, readDirectory, logger);
		if (page) {
			pages.push(page);
		}
	}

	// Sort pages by alphabetical route order before returning them
	return pages.sort((a, b) => a.path.localeCompare(b.path));
};

const readPage = async (file: klaw.Item, readDirectory: string, logger: Logger): Promise<PageRoute | null> => {
	logger.debug(`[PilotJS] Reading page "${file.path}"...`);

	// We just want the file name, not the full path
	let path = file.path.replace(readDirectory, '');

	// Create duplicate with file extension removed for comparison purposes
	const cleanPath = path.substring(0, path.lastIndexOf('.'));

	// _document is very site-specific, so we don't want to include it
	if (cleanPath === '/_document') {
		logger.debug(`[PilotJS] Skipping unsupported page "${file.path}"...`);
		return null;
	}
	
	// Transform path into a route that can be used by the router including wildcards routes
	let route = cleanPath.replace(/\[\.\.\.([^\]]+)\]/g, '**').replace(/\[([^\]]+)\]/g, ':$1');

	// Remove the "index" part of this route
	if (route.endsWith('/index')) {
		route = route.substring(0, route.lastIndexOf('index'));
	}

	// Remove the trailing slash
	if (route !== '/' && route.endsWith('/')) {
		route = route.substring(0, route.length - 1);
	}

	// Relative path comes in useful for runtime imports
	const importPath = new Array(DIR_DELTA_DEPTH).fill(0).map(() => '..').join('/') + file.path.replace(appRoot + '', '');
	
	// Check to see if this page contains getServerSideProps or getStaticProps
	// If it does, we need to include it in the build
	const getProps = await findGetProps(file.path);

	// Add page stats to the list
	return {
		getProps: getProps,
		importPath: importPath.substring(0, importPath.lastIndexOf('.')),
		path: route
	};
};

const syncManifest = async (pages: PageRoute[], logger: Logger): Promise<void> => {
	let manifest: BuildManifest = {};
	const manifestFile = appRoot + '/.pilot/build-manifest.json';

	// Read existing manifest if it exists
	if (await fs.pathExists(manifestFile)) {
		const manifestContents = await fs.readFile(manifestFile, 'utf8');
		manifest = JSON.parse(manifestContents);
	}

	// Apply newly read pages to the manifest
	manifest.pages = {};
	for (const page of pages) {
		manifest.pages[page.path] = {
			getProps: page.getProps
		};
	}

	// Sort the manifest object keys for cleanliness
	manifest = Object.keys(manifest)
		.sort()
		.reduce((acc, key) => ({
			...acc, [key]: manifest[key]
		}), {});

	// Write the manifest to .pilot/build-manifest.json
	logger.debug(`[PilotJS] Synchronized build manifest`);
	await fs.outputFile(manifestFile, JSON.stringify(manifest, null, 2));
};

const writeGeneratedFile = async (pages: PageRoute[], logger: Logger): Promise<void> => {
	const kode = koder({ comment: 'This file was automatically generated by PilotJS' })
		// Export const containing all page info
		.const('pageRoutes', { export: true })
		.value(pages.map(page => ({
			getProps: page.getProps,
			path: page.path
		})))
		.newline()

		// Generate static imports because dynamic imports are not allowed in most (all?) bundlers
		.function('importPage', { export: true, params: ['routePath'] })
		.block(koder()
			.switch('routePath')
			.block(koder()
				.cases(pages.map(page => ({
					case: page.path,
					body: koder().import(page.importPath, { dynamic: true, return: true })
				})))
				.default(koder().throw(new Error('Invalid route')))
			)
		);

	// Override existing stub file with the real deal!
	const file = appRoot + '/node_modules/@waveplay/pilot/dist/' + GENERATED_FILE;
	logger.debug(`[PilotJS] Writing ${pages.length} pages to "${file}"`);
	await fs.outputFile(file, kode.toString());
};
