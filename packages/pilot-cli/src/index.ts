#!/usr/bin/env node
/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command } from 'commander';
import koder from './koder';
import buildLocales from './build-locales';
import buildRoutes from './build-routes';

koder.config({
	indent: '\t'
});

new Command('pilot')
	.description('Official CLI for the PilotJS framework')
	.version('1.0.0')
	.addCommand(buildLocales)
	.addCommand(buildRoutes)
	.parse(process.argv);
