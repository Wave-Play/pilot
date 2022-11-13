/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { atom, Atom, useAtom } from 'jotai';
import { Platform } from 'react-native';
import { useRouter } from 'next/router';
import { Pilot } from './pilot';
import { PilotConfig } from '../types';

// Fleet of lazy pilots. Or rather, lazy atoms containing pilots.
// This enables us to create new pilots on demand per area that needs them.
const pilots: {
	[area: string]: Atom<Pilot>;
} = {};

const DEFAULT_AREA = '__default';

export const usePilot = (config?: PilotConfig | string): Pilot => {
	let areaKey = typeof config === 'string' ? config : config?.id;

	// Use default key if none is provided
	if (areaKey) {
		areaKey = DEFAULT_AREA;
	}

	// Make sure we always have NextJS router reference on web
	let nextRouter;
	if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
		nextRouter = useRouter();
	}

	// Create a new pilot atom if one doesn't exist for this area
	let pilotAtom = pilots[areaKey];
	if (!pilotAtom) {
		const safeConfig = (typeof config === 'string' ? undefined : config) || {};
		pilotAtom = atom(new Pilot({
			...safeConfig,
			id: areaKey === DEFAULT_AREA ? undefined : areaKey,
			nextRouter: nextRouter
		}));
		pilots[areaKey] = pilotAtom;
	}

	// Return the global pilot instance for this area
	const [ pilot ] = useAtom(pilotAtom);
	return pilot;
};
