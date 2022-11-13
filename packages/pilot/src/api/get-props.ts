/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { GetStaticPropsResult, NextApiRequest, NextApiResponse } from 'next'
import { importPage, pageRoutes } from '../_generated-pages'
import type { Pilot } from '../client/core/pilot'
import { RadixRouter } from '../client/core/radix-router'
import fs from 'fs-extra'

// Namespace used for validating prop cache
const NS = '__pilot'

// Root level directory of the project
const ROOT_DIR = process.cwd() + '/.pilot'

// Create router using generated routes
const router = createRouter()

export async function handleGetProps (req: NextApiRequest, res: NextApiResponse, pilot: Pilot): Promise<void> {
	const { locale, path } = req.body

	// Validate path
	if (!path) {
		return res.status(400).json({
			error: 'Invalid path. Make sure you are sending a "path" property in the request body.'
		})
	}

	// Find route
	const route = router.find(path, { pilot })
	if (!route) {
		return res.status(404).json({
			error: 'Page not found: ' + path
		})
	}

	// This API shouldn't even be called for pages that don't have getProps
	const { getPropsType } = route
	if (!getPropsType) {
		return res.status(400).json({
			error: 'Page does not have getProps: ' + path
		})
	}

	// Lookup cached props if this is a static page and return as long as it's not stale
	const cache = await getCache(path, pilot)
	if (cache.status === 'HIT') {
		return res.status(200).json(cache.props)
	}

	// Load props for page
	const page = await importPage(path)
	const props = await page[getPropsType]({
		locale, req, res,
		params: route.params ?? {},
		query: route.query ?? {},
		resolvedUrl: path
	})
	pilot.log('debug', `API: Loaded props for ${path}:`, props)

	// Cache props if this is a static page
	if (getPropsType === 'getStaticProps' && props) {
		await fs.outputFile(cache.file, JSON.stringify({
			...props,
			[NS]: {
				updatedAt: Date.now()
			}
		}, undefined, 2))
	}

	res.status(200).json(props)
}

function createRouter() {
	const radixRouter = new RadixRouter()

	for (const route of pageRoutes) {
		radixRouter.addRoute({
			getPropsType: route.getPropsType,
			path: route.path,
			Component: null
		})
	}

	return radixRouter
}

interface Cache {
	props?: GetStaticPropsResult<unknown>
	file: string
	status?: 'HIT' | 'MISS' | 'STALE'
}

type CachedProps = GetStaticPropsResult<unknown> & {
	__pilot?: {
		updatedAt?: number
	}
}

async function getCache(path: string, pilot: Pilot): Promise<Cache> {
	const cache: Cache = {
		file: ROOT_DIR + `/cache/static${path}.json`,
		status: 'MISS'
	}

	try {
		// Return with "MISS" if cache file doesn't exist
		if (!fs.existsSync(cache.file)) {
			return cache
		}

		// Read cache file and return with "MISS" if it's invalid
		const props: CachedProps = await fs.readJSON(cache.file)
		if (!props) {
			return cache
		}

		// Check if cache is stale
		if (typeof props.revalidate === 'number') {
			cache.status = props[NS]?.updatedAt && props[NS].updatedAt < Date.now() - props.revalidate * 1000 ? 'STALE' : 'HIT'
		} else if (!props.revalidate) {
			cache.status = 'HIT'
		}

		// Remove namespace before adding props data to cache
		delete props[NS]
		cache.props = props
	} catch (e) {
		pilot.log('error', `API: Error loading cache file:`, cache.file, e)
	} finally {
		pilot.log('info', `API: Cache ${cache.status}:`, path)
		return cache
	}
}
