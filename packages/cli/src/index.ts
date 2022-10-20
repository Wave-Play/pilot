#!/usr/bin/env node
/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command } from 'commander';
import koder from './koder';
import build from './build';
import buildLocales from './build-locales';
import buildPages from './build-pages';
import { version } from '../package.json';

koder.config({
	indent: '\t'
});

new Command('pilot')
	.description('Official CLI for the PilotJS framework')
	.version(version)
	.addCommand(build)
	.addCommand(buildLocales)
	.addCommand(buildPages)
	.parse(process.argv);

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
