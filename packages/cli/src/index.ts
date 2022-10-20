#!/usr/bin/env node
/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import appRoot from 'app-root-path';
import { Command } from 'commander';
import fs from 'fs-extra';
import { Logger } from 'pino';
import build from './build';
import buildLocales from './build-locales';
import buildPages from './build-pages';
import koder from './koder';
import { version } from '../package.json';

// Indent using tabs because we're not uncultured savages
koder.config({
	indent: '\t'
});

// Manifest file to sync changes with
export const MANIFEST_FILE = appRoot + '/.pilot/build-manifest.json';
export interface BuildManifest {
	locales?: {
		[key: string]: string[]
	}
	pages?: {
		[key: string]: {
			getProps: string | null
		}
	}
}

export const syncManifest = async (action: (manifest: BuildManifest) => void, logger: Logger): Promise<void> => {
	let manifest: BuildManifest = {};

	// Read existing manifest if it exists
	if (await fs.pathExists(MANIFEST_FILE)) {
		const manifestContents = await fs.readFile(MANIFEST_FILE, 'utf8');
		manifest = JSON.parse(manifestContents);
	}

	// Apply newly read pages to the manifest
	action(manifest);

	// Sort the manifest object keys for cleanliness
	manifest = Object.keys(manifest)
		.sort()
		.reduce((acc, key) => ({
			...acc, [key]: manifest[key]
		}), {});

	// Write the manifest to .pilot/build-manifest.json
	logger.debug(`[PilotJS] Synchronized build manifest`);
	await fs.outputFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
};

// Let's goooooo! ^w^
new Command('pilot')
	.description('Official CLI for the PilotJS framework')
	.version(version)
	.addCommand(build)
	.addCommand(buildLocales)
	.addCommand(buildPages)
	.parse(process.argv);
