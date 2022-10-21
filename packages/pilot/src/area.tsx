/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { FunctionComponent, ReactElement, useEffect } from 'react';
import { PilotConfig, PilotStateProps } from './pilot';
import { PilotRoute, PilotRouteOptions } from './route';
import { PilotRenderer } from './renderer';
import { usePilot } from './use-pilot';
import { importPage, pageRoutes } from './_generated-pages';

interface PilotAreaProps {
	children?: any
	config?: PilotConfig
	defaultPath?: string | null
	name?: string
	persistPlaceholder?: boolean
	placeholder?: (visible: boolean) => ReactElement<PilotStateProps>
	render?: boolean
}
export const PilotArea: FunctionComponent<PilotAreaProps> = (props: PilotAreaProps) => {
	const {
		children,
		config,
		defaultPath = '/',
		name,
		persistPlaceholder,
		placeholder,
		render = true
	} = props;

	//
	const pilot = usePilot(name);
	if (config) {
		pilot.config(config);
	}

	useEffect(() => {
		(async () => {
			let paths: PilotRouteOptions[] = [];

			// Automatically import all pages generated by the `pilot build` command
			// Only do this for PilotArea instances without a name so named areas can be used independently
			if (!name) {
				for (const route of pageRoutes) {
					const page = await importPage(route.path);
					paths.push({
						Component: page.default,
						getProps: route.getProps ? page[route.getProps] : undefined,
						path: route.path
					});
				}
				pilot.log('debug', `Imported ${paths.length} automatically generated pages`);
			}

			// Add all routes defined by the user using <PilotRoute> components in this area
			let declaredRoutes: PilotRouteOptions[] = [];
			if (Array.isArray(children)) {
				declaredRoutes = children.filter(child => child.type === PilotRoute).map(child => child.props);
			} else if (children?.type === PilotRoute) {
				declaredRoutes = [children.props];
			}

			if (declaredRoutes.length) {
				paths = paths.concat(declaredRoutes);
				pilot.log('debug', `Imported ${declaredRoutes.length} manually declared pages`);
			}

			for (const path of paths) {
				pilot.addRoute(path);
			}

			// Automatically load the default path (unless set to null)
			pilot.log('debug', defaultPath ? `Flying to default path: ${defaultPath}` : 'No default route was found');
			if (defaultPath) {
				pilot.fly(defaultPath);
			}
		})();
	}, []);

	return (
		<>
			{ children }
			{ render && <PilotRenderer name={name} persistPlaceholder={persistPlaceholder} placeholder={placeholder}/> }
		</>
	)
};
export default PilotArea;
