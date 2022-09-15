/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Pilot } from './pilot';
import { atom, Atom, useAtom } from 'jotai';
import { Platform } from 'react-native';
import { useRouter } from 'next/router';

// Fleet of lazy pilots. Or rather, lazy atoms containing pilots.
// This enables us to create new pilots on demand per area that needs them.
const pilots: {
	[area: string]: Atom<Pilot>;
} = {};

const DEFAULT_AREA = '__default';

export const usePilot = (area?: string): Pilot => {
	// Use default key if none is provided
	if (!area) {
		area = DEFAULT_AREA;
	}

	// Make sure we always have NextJS router reference on web
	let nextRouter;
	if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
		nextRouter = useRouter();
	}

	// Create a new pilot atom if one doesn't exist for this area
	let pilotAtom = pilots[area];
	if (!pilotAtom) {
		pilotAtom = atom(new Pilot({
			id: area === DEFAULT_AREA ? undefined : area,
			nextRouter: nextRouter
		}));
		pilots[area] = pilotAtom;
	}

	// Return the global pilot instance for this area
	const [ pilot ] = useAtom(pilotAtom);
	return pilot;
};
