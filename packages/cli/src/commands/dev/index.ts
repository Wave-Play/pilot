/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Command, OptionValues } from 'commander'
import { spawn } from 'child_process'
import { bin, install, tunnel } from 'cloudflared'
import fs from 'fs-extra'
import pino from 'pino'
import { createServer } from 'http'

const command = new Command('dev')
	.description('starts your application in developer mode and automatically creates a local tunnel')
	.option('-H --hostname <hostname>', 'Hostname on which to start the application', '0.0.0.0')
	.option('-nt --no-tunnel', 'do not create a local tunnel for this session')
	.option('-p --port <port>', 'port to run the application on')
	.option('-s --silent', 'do not print anything')
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

	// Start Next.js process
	logger.debug(`[PilotJS] Starting Next.js...`)
	const nextArgs = ['next', 'dev', '-p', port.toString()]
	if (options.hostname) {
		nextArgs.push('-H', options.hostname)
	}
	spawn('yarn', nextArgs, {
		stdio: 'inherit'
	})

	// Start cloudflared tunnel (unless disabled)
	if (useTunnel) {
		logger.debug(`[PilotJS] Starting cloudflared tunnel...`)
		const { url, connections } = tunnel({ '--url': 'http://localhost:' + port })
		const tunnelUrl = await url
		logger.info(`[PilotJS] Tunnel URL: ${tunnelUrl}`)
		const conns = await Promise.all(connections)
		logger.debug(`[PilotJS] Connections Ready! ${JSON.stringify(conns, undefined, 2)}`)

		// TODO: Build the application using tunnel URL as host
	}

	// Start Expo process
	logger.debug(`[PilotJS] Starting Expo...`)
	spawn('yarn', ['expo', 'start'], {
		stdio: 'inherit'
	})
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
