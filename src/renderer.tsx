/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { usePilot } from './use-pilot';
import { PilotEvent, PilotStateProps } from './pilot';

interface PilotRendererProps {
	name?: string
	persistError?: boolean
	persistPlaceholder?: boolean
	placeholder?: (visible: boolean) => ReactElement<PilotStateProps>
}
export const PilotRenderer: FunctionComponent<PilotRendererProps> = (props: PilotRendererProps) => {
	const { name, persistPlaceholder, placeholder } = props;
	const pilot = usePilot(name);

	// Update content after navigating to a new page
	const [ content, setContent ] = useState<ReactElement | null>(pilot.render());

	// If enabled, show placeholder while we wait for a new load
	// or, you know, an error if things... go bad
	const [ showPlaceholder, setShowPlaceholder ] = useState(false);
	useEffect(() => {
		const hookId = pilot.addHook('*', (_path: string, event: PilotEvent) => {
			pilot.log('debug', `PilotAreaRenderer: Received event "${event.type}"`);
			if (event.type === 'load-complete') {
				setShowPlaceholder(false);
				setContent(pilot.render());
			} else if (event.type === 'load-start') {
				setShowPlaceholder(true);
			} else if (event.type === 'error') {
				setShowPlaceholder(false);
			}
		});
		return () => pilot.removeHook(hookId);
	}, []);

	return (
		<>
			{ content }
			{ (persistPlaceholder || showPlaceholder) && placeholder ? placeholder(showPlaceholder) : null }
		</>
	);
};