/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command, OptionValues } from 'commander'
import { spawn } from 'child_process'
import { bin, install, tunnel } from 'cloudflared'
import fs from 'fs-extra'
import { networkInterfaces } from 'os'
import pino from 'pino'
import type { Logger } from 'pino'
import { createServer } from 'http'
import { syncManifest } from '../..'
import { action as build } from '../build'
import koder, { Kode } from '../../koder'
import type { BuildManifest } from '../../types'
import { readConfig } from '../build/config'
import type { Config } from '../../../client/types'

const GENERATED_FILE = 'dev.js'

const command = new Command('dev')
	.description('starts your application in developer mode and automatically creates a local tunnel')
	.option('-ne --no-env', 'do not load environment variables')
	.option('-H --hostname <hostname>', 'hostname on which to start the application')
	.option('-p --port <port>', 'port to run the application on')
	.option('-s --silent', 'do not print anything')
	.option('-t --tunnel', 'create a local tunnel for this session')
	.option('-v --verbose', 'print more information for debugging')
	.action(action)
export default command

export async function action(options: OptionValues) {
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
	})

	// Check if cloudflared is installed
	let useTunnel = options.tunnel
	logger.debug(`[PilotJS] ${useTunnel ? 'Using' : 'Skipping'} local tunnel...`)
	if (useTunnel && !fs.existsSync(bin)) {
		logger.debug(`[PilotJS] Cloudflared not found, installing...`)
		await install(bin)
	}

	// Keep incrementing port until it's available if not directly specified
	let port = parseInt(options.port || '3000')
	if (!options.port) {
		while (true) {
			if (!(await isPortTaken(port))) {
				break
			}

			if (port >= 65535) {
				logger.error(`[PilotJS] No available ports found`)
				process.exit(1)
			}

			logger.info(`[PilotJS] Port ${port - 1} is taken, trying ${++port}...`)
		}
	}

	// Find external IPv4 address
	const localIp = Object.values(networkInterfaces())
		.flat()
		.find((net) => net.family === 'IPv4' && !net.internal)?.address
	const localUrl = `http://${localIp}:${port}`
	logger.debug('External IPv4 address: %s', localIp)
	if (!localIp && !options.tunnel) {
		logger.warn('Could not find an external IPv4 address; router will default to "host" value. Use the --tunnel option as a workaround.')
	}

	// Remove .next cache
	await fs.remove(process.cwd() + '/.next')

	// Pre-build Pilot.js
	await build(options)

	// Read config file
	const config = await readConfig<Config>(logger, `pilot.config.js`)

	// Auto detect package manager
	const pkgManager = getPkgManager()
	logger.debug(`[PilotJS] Using package manager: ${pkgManager}`)

	// Start Next.js process
	const nextArgs = config.commands?.devWeb?.split(' ') ?? ['next', 'dev']
	if (pkgManager === 'npm' || pkgManager === 'pnpm') {
		nextArgs.splice(0, 0, 'exec')
	}
	if (!nextArgs.includes('-p') && !nextArgs.includes('--port')) {
		if (pkgManager === 'npm' || pkgManager === 'pnpm') {
			nextArgs.push('--')
		}
		nextArgs.push('-p', port.toString())
	}
	if (options.hostname) {
		nextArgs.push('-H', options.hostname)
	}

	logger.debug(`[PilotJS] Executing: ${pkgManager} ${nextArgs.join(' ')}`)
	spawn(pkgManager, nextArgs, {
		stdio: 'inherit'
	})

	// Start cloudflared tunnel (unless disabled)
	let tunnelUrl: string | null = null
	if (useTunnel) {
		logger.debug(`[PilotJS] Starting cloudflared tunnel...`)
		const { url, connections } = tunnel({ '--url': 'http://localhost:' + port })
		tunnelUrl = await url
		logger.info(`[PilotJS] Tunnel URL: ${tunnelUrl}`)
		const conns = await Promise.all(connections)
		logger.debug(`[PilotJS] Connections Ready! ${JSON.stringify(conns, undefined, 2)}`)
	}

	// Build the application using tunnel URL as host
	const kode = koder({ comment: 'This file was automatically generated by PilotJS' })
		.const('localUrl', { export: true })
		.value(localUrl)
		.const('tunnelUrl', { export: true })
		.value(tunnelUrl)
	await writeDev(logger, kode, localUrl, tunnelUrl)

	// Start native process
	const nativeArgs = config.commands?.devNative?.split(' ') ?? ['expo', 'start']
	if (pkgManager === 'npm' || pkgManager === 'pnpm') {
		nativeArgs.splice(0, 0, 'exec')
	}

	logger.debug(`[PilotJS] Executing: ${pkgManager} ${nativeArgs.join(' ')}`)
	spawn(pkgManager, nativeArgs, {
		stdio: 'inherit'
	})
}

type PackageManager = 'npm' | 'pnpm' | 'yarn'

export function getPkgManager(): PackageManager {
	const userAgent = process.env.npm_config_user_agent

	if (userAgent?.startsWith('yarn')) {
		return 'yarn'
	} else if (userAgent?.startsWith('pnpm')) {
		return 'pnpm'
	} else {
		return 'npm'
	}
}

async function isPortTaken(port: number): Promise<boolean> {
	const [IPv4, IPv6] = await Promise.all([testPort(port, '0.0.0.0'), testPort(port, '::')])
	return IPv4 || IPv6
}

/**
 * @returns {Promise<boolean>} true if port is taken, false if not
 */
function testPort(port: number, host: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const server = createServer()
			.once('error', function (err) {
				if (err['code'] != 'EADDRINUSE') return reject(err)
				resolve(true)
			})
			.once('listening', function () {
				server.once('close', () => resolve(false)).close()
			})
			.listen({ host, port })
	})
}

async function writeDev(logger: Logger, kode: Kode, localUrl?: string | null, tunnelUrl?: string | null) {
	// Write the generated dev file
	const file = process.cwd() + '/node_modules/@waveplay/pilot/dist/_generated/' + GENERATED_FILE
	await fs.outputFile(file, kode.toString())

	// Apply newly generated dev fields to the manifest
	await syncManifest((manifest: BuildManifest) => {
		manifest.dev = {
			localUrl, tunnelUrl
		}
	}, logger)
}
