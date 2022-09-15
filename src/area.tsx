/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { NextRouter } from 'next/router';
import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import { PilotRouter, PilotStateProps } from './pilot';
import { PilotRoute, PilotRouteOptions } from './route';
import { PilotAreaRenderer } from './area-renderer';
import { usePilot } from './use-pilot';

interface PilotAreaProps {
	children?: any
	logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error'
	name?: string
	persistPlaceholder?: boolean
	placeholder?: (visible: boolean) => ReactElement<PilotStateProps>
	renderContent?: boolean
	nextRouter?: NextRouter | null
	router?: PilotRouter
}
export const PilotArea: FunctionComponent<PilotAreaProps> = (props: PilotAreaProps) => {
	const { children, logLevel, name, nextRouter, persistPlaceholder, placeholder, renderContent = true, router } = props;
	const pilot = usePilot(name);
	pilot.config({ logLevel, nextRouter, router });

	// Extract paths from children
	let paths: PilotRouteOptions[] = [];
	if (Array.isArray(children)) {
		paths = children.filter(child => child.type === PilotRoute).map(child => child.props);
	} else if (children?.type === PilotRoute) {
		paths = [children.props];
	}

	for (const path of paths) {
		pilot.addRoute(path);
	}

	// Immediately assign default path if one was found
	useEffect(() => {
		const defaultPath = paths?.find((path: PilotRouteOptions) => path.default);
		pilot.log('debug', defaultPath ? `Flying to default path: ${defaultPath.path}` : 'No default route was found');
		if (defaultPath) {
			pilot.fly(defaultPath.path);
		}
	}, []);

	return (
		<>
			{ children }
			{ renderContent && <PilotAreaRenderer persistPlaceholder={persistPlaceholder} placeholder={placeholder}/> }
		</>
	)
};
export default PilotArea;
