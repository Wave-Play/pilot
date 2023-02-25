/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import fs from 'fs-extra';
import klaw from 'klaw';
import { getGenDir, syncManifest } from '../..';
import koder from '../../koder';
import { getPkgManager } from '../dev';
import type { PageRoute } from '../../../_internal/types';
import type { BuildManifest } from '../../types';
import type { Config } from '../../../client/types';
import type { Logger } from 'pino';

// This is the number of directories to go up to get to the root of the project where pages are
// Because we can't guarantee where the CLI is being run from, we assume 5 directories up is the root
// That's assuming @waveplay/pilot is installed in the root node_modules directory
// PNPM and Yarn 2 have different directory structures, so we need to account for that
const packageManager = getPkgManager();
const DIR_DELTA_DEPTH = 5;

// Name of the file that will be generated
const GENERATED_FILE = 'pages.js';

// Make sure to use the correct slash for the platform
const IS_WINDOWS = /^win/.test(process.platform);
const SLASH = IS_WINDOWS ? '\\' : '/';

export async function buildPages(logger: Logger, config: Config, upDirs: number) {
	// Try scanning the default /pages directory first
	let pages: PageRoute[] = [];
	try {
		pages = await readAllPages(SLASH + 'pages', logger, config, upDirs);
	} catch {}

	// If none were found, try scanning the /src/pages directory instead
	// Both of these directions are supported by NextJS, so we should support them too
	if (!pages.length) {
		logger.debug('[PilotJS] Could not find "/pages" directory, trying "/src/pages"');
		pages = await readAllPages(`${SLASH}src${SLASH}pages`, logger, config, upDirs);
	}

	// Generate file containing info for all pages, including static imports
	await writeGeneratedFile(pages, logger, upDirs);

	// Apply newly read pages to the manifest
	await syncManifest((manifest: BuildManifest) => {
		manifest.pages = {};
		for (const page of pages) {
			manifest.pages[page.path] = {
				getPropsType: page.getPropsType
			};
		}
	}, logger);
};

const findGetPropsType = async (filePath: string): Promise<'getServerSideProps' | 'getStaticProps' | null> => {
	// Read the file
	const fileContents = await fs.readFile(filePath, 'utf8');

	// Simple string lookup is much faster, but also much less accurate and can be thrown off by simple comments
	// TODO: Piggyback off of NextJS's own logic for this
	if (fileContents.includes('getServerSideProps')) {
		return 'getServerSideProps';
	} else if (fileContents.includes('getStaticProps')) {
		return 'getStaticProps';
	}

	return null;
};

const readAllPages = async (directory: string, logger: Logger, config: Config, upDirs: number): Promise<PageRoute[]> => {
	logger.debug(`[PilotJS] Reading pages from "${directory}" directory...`);
	const pages: PageRoute[] = [];
	const readDirectory = process.cwd() + directory;

	for await (const file of klaw(readDirectory)) {
		// Skip directories
		if (file.stats.isDirectory()) {
			continue;
		}

		// Store page info only as long as it exists (null === skip)
		const page = await readPage(file, readDirectory, logger, upDirs);
		if (!page) {
			continue;
		}

		// Include if no "includes" is defined or if the page path matches a glob pattern in the "includes" list
		if (!config?.pages?.include?.length || config.pages.include?.some(pattern => page.path.match(pattern))) {
			pages.push(page);
		}
	}

	// Sort pages by alphabetical route order before returning them
	pages.sort((a, b) => a.path.localeCompare(b.path));

	// Filter out pages that match a glob pattern in the "exclude" list
	if (config?.pages?.exclude?.length) {
		return pages.filter(page => !config.pages.exclude?.some(pattern => page.path.match(pattern)));
	}

	// Sort pages by alphabetical route order before returning them
	return pages;
};

const readPage = async (file: klaw.Item, readDirectory: string, logger: Logger, upDirs: number): Promise<PageRoute | null> => {
	logger.debug(`[PilotJS] Reading page "${file.path}"...`);

	// We just want the file name, not the full path
	let path = file.path.replace(readDirectory, '');

	// Create duplicate with file extension removed for comparison purposes
	let cleanPath = path.substring(0, path.lastIndexOf('.'));

	// From here on out, we only need forwardslashes (Windows uses backslashes)
	cleanPath = cleanPath.replace(/\\/g, '/');

	// _document is very web-specific, so we don't want to include it
	if (cleanPath === '/_document') {
		logger.debug(`[PilotJS] Skipping unsupported page "${file.path}"...`);
		return null;
	}

	// API routes don't count as pages
	if (cleanPath.startsWith('/api')) {
		logger.debug(`[PilotJS] Skipping API route "${file.path}"...`);
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

	// Adjust import path based on how many directories up we need to go
	// PNPM's directory structure is different, so we need to account for that
	// If upDirs is greater than 0, we need to go up that many more directories instead (monorepo likely)
	let cwdUpDirs = ''
	let dirDeltaDepth = DIR_DELTA_DEPTH
	if (upDirs > 0) {
		const cwdDirs = process.cwd().split('/').slice(-upDirs);
		cwdUpDirs = '/' + cwdDirs.join('/')
	} else if (packageManager === 'pnpm') {
		dirDeltaDepth = DIR_DELTA_DEPTH + 3
	}

	// Relative path comes in useful for runtime imports
	const importPath = new Array(dirDeltaDepth).fill(0).map(() => '..').join('/') + cwdUpDirs + file.path.replace(process.cwd(), '');
	
	// Check to see if this page contains getServerSideProps or getStaticProps
	// If it does, we need to include it in the build
	const getPropsType = await findGetPropsType(file.path);

	// Add page stats to the list
	return {
		getPropsType: getPropsType,
		importPath: importPath.substring(0, importPath.lastIndexOf('.')).replace(/\\/g, '/'),
		path: route
	};
};

const writeGeneratedFile = async (pages: PageRoute[], logger: Logger, upDirs: number): Promise<void> => {
	const kode = koder({ comment: 'This file was automatically generated by PilotJS' })
		// Export const containing all page info
		.const('pageRoutes', { export: true })
		.value(pages.map(page => ({
			getPropsType: page.getPropsType,
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
					body: koder().import(null, page.importPath, { dynamic: true, return: true })
				})))
				.default(koder().throw(new Error('Invalid route')))
			)
		);

	// Override existing stub file with the real deal!
	const file = getGenDir({ upDirs }) + GENERATED_FILE;
	logger.debug(`[PilotJS] Writing ${pages.length} pages to "${file}"`);
	await fs.outputFile(file, kode.toString());
};
