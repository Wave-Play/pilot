/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { env } from '../_generated/env'

export const loadEnv = () => {
	Object.keys(env).forEach(key => {
		process.env[key] = env[key]
	})
}
