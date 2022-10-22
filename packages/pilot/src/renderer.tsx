/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import type { PilotEvent, PilotStateProps } from './types';
import { usePilot } from './use-pilot';

interface PilotRendererProps {
	name?: string
	persistPlaceholder?: boolean
	Placeholder?: (visible: boolean) => ReactElement<PilotStateProps>
	renderContent?: 'always' | 'first-load' | 'never'
	renderPlaceholder?: 'always' | 'first-load' | 'never'
}
export const PilotRenderer: FunctionComponent<PilotRendererProps> = (props: PilotRendererProps) => {
	const {
		name,
		persistPlaceholder,
		Placeholder,
		renderContent = 'always',
		renderPlaceholder = 'always'
	} = props;
	const pilot = usePilot(name);

	// Update content after navigating to a new page
	const [ content, setContent ] = useState<ReactElement | null>(renderContent === 'always' || renderContent === 'first-load' ? pilot.render() : null);

	// If enabled, show placeholder while we wait for a new load
	// Or you know, an error... if things... go bad
	const [ showPlaceholder, setShowPlaceholder ] = useState(false);
	useEffect(() => {
		const loadCompleteHookId = pilot.addHook('load-complete', (_, event: PilotEvent) => {
			pilot.log('debug', `PilotAreaRenderer: Received event "${event.type}"`);
			setShowPlaceholder(false);
			if (renderContent === 'always' || (renderContent === 'first-load' && !content)) {
				setContent(pilot.render());
			}
		});
		const loadStartHookId = pilot.addHook('load-start', (_, event: PilotEvent) => {
			pilot.log('debug', `PilotAreaRenderer: Received event "${event.type}"`);
			setShowPlaceholder(true);
		});
		return () => {
			pilot.removeHook(loadCompleteHookId);
			pilot.removeHook(loadStartHookId);
		};
	}, [ renderContent ]);;

	// Render placeholder if enabled
	let PlaceholderElement = null;
	if (Placeholder && (persistPlaceholder || showPlaceholder)) {
		PlaceholderElement = Placeholder(showPlaceholder);
	}

	return (
		<>
			{ content }
			{ (renderPlaceholder === 'always' || (renderPlaceholder === 'first-load' && !content)) ? PlaceholderElement : null }
		</>
	);
};
