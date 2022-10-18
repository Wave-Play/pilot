#!/usr/bin/env node
/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command } from 'commander';
import koder from './koder';
import buildRoutes from './build-routes';

koder.config({
	indent: '\t'
});

const cli = new Command()
	.name('pilot')
	.description('Official CLI for the PilotJS framework')
	.version('1.0.0')
	.addCommand(buildRoutes)

cli.command('build:locales')
	.description('prebuild all routes from pages directory');

// Begin!
cli.parse(process.argv);
