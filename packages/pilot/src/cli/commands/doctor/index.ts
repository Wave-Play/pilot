/**
 * © 2023 WavePlay <dev@waveplay.com>
 */
import { Command, OptionValues } from 'commander'
import pino from 'pino'
import fs from 'fs-extra'
import readline from 'readline'
import type { Logger } from 'pino'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const API_ROUTE = 'pilot/[...route]'

const API_ROUTE_CONTENTS = `import { createHandler } from '@waveplay/pilot/api'\nexport default createHandler()\n`

const command = new Command('doctor')
	.description('checks your application for common errors')
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

	// Check if the API path exists in either .js or .ts
	const API_PATH = process.cwd() + `/pages/api/${API_ROUTE}`
	if (!fs.existsSync(`${API_PATH}.js`) && !fs.existsSync(`${API_PATH}.ts`)) {
		const answer = await prompt(logger, 'API route does not exist! This is necessary for many features to work. Would you like to create it? (y/n)')
		if (answer === 'y') {
			await fs.outputFile(`${API_PATH}.js`, API_ROUTE_CONTENTS)
			logger.info('[PilotJS] API route created!')
		}
	}

	rl.close()
}

async function prompt(logger: Logger, question: string) {
	return new Promise<string>(resolve => {
		rl.question(question, answer => {
			if (answer === 'y' || answer === 'n') {
				resolve(answer)
			} else {
				logger.warn('[PilotJS] Please enter "y" or "n"')
				prompt(logger, question).then(resolve)
			}
		})
	})
}
