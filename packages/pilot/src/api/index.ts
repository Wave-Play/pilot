/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { handleGetProps } from './get-props'
import { Pilot } from '../client/core/pilot'

interface HandlerOptions {
	pilot?: Pilot
}

export const createHandler = (options?: HandlerOptions) => {
	const { pilot = new Pilot({ id: '__server' }) } = options || {}

	return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
		const { route } = req.query

		// Validate route
		if (!route || !Array.isArray(route) || route[0] === 'pilot') {
			return res.status(400).json({
				error: 'Invalid route. Make sure this API is named correctly as: "/api/pilot/[...route]"'
			})
		}

		// Delegate to correct handler
		switch (route[0]) {
			case 'get-props':
				return await handleGetProps(req, res, pilot)
			default:
				return res.status(404).json({ error: 'Not found' })
		}
	}
}
