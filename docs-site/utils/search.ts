/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { useQuery } from 'react-query'

const HOST = process.env.NEXT_PUBLIC_SEARCH_HOST
const INDEX = 'pilotjs-docs'
const KEY = process.env.NEXT_PUBLIC_SEARCH_KEY

interface SearchResult<T> {
	_matchesInfo?: any
	data: T & {
		_matchesInfo?: any
	}
}

interface SearchOptions {
	attributesToCrop?: string[]
	attributesToHighlight?: string[]
	cropLength?: number
	cropMarker?: string
	highlightPreTag?: string
	highlightPostTag?: string
	limit?: number
	matches?: boolean
	offset?: number
}
export const search = async <T>(query: string, options?: SearchOptions): Promise<SearchResult<T>[]> => {
	const result = await fetch(`${HOST}/indexes/${INDEX}/search`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			...(options || {}),
			q: query
		})
	})
	const data = await result.json() as {
		hits: Array<T & {
			_matchesInfo?: any
		}>
		_matchesInfo?: any
	}

	return data.hits.map(hit => {
		const result: SearchResult<T> = { data: hit }
		if (hit._matchesInfo) {
			result._matchesInfo = hit._matchesInfo
			delete result.data._matchesInfo
		}
		return result
	})
}

export const useSearch = <T>(searchQuery?: string) => {
	const query = useQuery(['search', searchQuery], async () => {
		if (searchQuery?.length) {
			return await search<T>(searchQuery, {
				attributesToCrop: ['content', 'title'],
				matches: true
			})
		}
	}, {
		keepPreviousData: true
	})

	return {
		...query,
		searchItems: query.data
	}
}
