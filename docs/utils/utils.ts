import { Platform } from 'react-native';
import { metadata } from './metadata';

export const getMetaFromPath = (path: string) => {
	let cleanPath = path.split('#')[0].split('?')[0]

	// Root page is a special case
	if (cleanPath === '/') {
		cleanPath = '/docs/getting-started'
	}
	if (cleanPath === '/docs') {
		cleanPath = '/docs/getting-started'
	}

	return metadata[cleanPath]
}

export const isNative = (): boolean => {
	return Platform.OS === 'android' || Platform.OS === 'ios'
}
