/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
'use client'
import { FunctionComponent, ReactElement, useEffect } from 'react'
import { PilotRoute } from '../core/pilot'
import { PilotRenderer } from './renderer'
import type { PilotConfig, PilotRouteOptions, PilotStateProps } from '../types'
import { usePilot } from '../core/use-pilot'
import { importPage, pageRoutes } from '../../_generated/pages'

interface PilotAreaProps {
	autoLoad?: boolean
	children?: any
	config?: PilotConfig
	defaultPath?: string | null
	name?: string
	persistPlaceholder?: boolean
	Placeholder?: (visible: boolean) => ReactElement<PilotStateProps>
	renderContent?: 'always' | 'first-load' | 'never'
	renderPlaceholder?: 'always' | 'first-load' | 'never'
	tag?: string
}
export const PilotArea: FunctionComponent<PilotAreaProps> = (props: PilotAreaProps) => {
	const {
		autoLoad = true,
		children,
		config,
		defaultPath = '/',
		name,
		persistPlaceholder,
		Placeholder,
		renderContent = 'always',
		renderPlaceholder = 'always',
		tag
	} = props
	const logTag = tag ? `#${tag}` : ''

	// Get pilot instance
	const pilot = usePilot({
		...(config || {}),
		id: name || config?.id
	})

	useEffect(() => {
		// Skip if autoLoad is disabled
		if (!autoLoad) {
			return pilot.log('debug', `PilotArea${logTag}: Skipped loading...`)
		}

		// Register routes and load the default page
		;(async () => {
			let paths: PilotRouteOptions[] = []

			// Automatically import all pages generated by the `pilot build` command
			// Only do this for PilotArea instances without a name so named areas can be used independently
			if (!name) {
				for (const route of pageRoutes) {
					const page = await importPage(route.path)
					paths.push({
						Component: page.default,
						getProps: route.getPropsType ? page[route.getPropsType] : undefined,
						path: route.path
					})
				}
				pilot.log('debug', `PilotArea${logTag}: Imported ${paths.length} automatically generated pages`)
			}

			// Add all routes defined by the user using <PilotRoute> components in this area
			let declaredRoutes: PilotRouteOptions[] = []
			if (Array.isArray(children)) {
				declaredRoutes = children.filter((child) => child.type === PilotRoute).map((child) => child.props)
			} else if (children?.type === PilotRoute) {
				declaredRoutes = [children.props]
			}

			if (declaredRoutes.length) {
				paths = paths.concat(declaredRoutes)
				pilot.log('debug', `PilotArea${logTag}: Imported ${declaredRoutes.length} manually declared pages`)
			}

			for (const path of paths) {
				pilot.addRoute(path)
			}

			// Automatically load the default path (unless set to null)
			pilot.log(
				'debug',
				`PilotArea${logTag}: ` + defaultPath ? `Flying to default path: "${defaultPath}"` : 'No default route was found'
			)
			if (defaultPath) {
				pilot.fly(defaultPath)
			}
		})()
	}, [autoLoad])

	return (
		<>
			{children}
			{
				<PilotRenderer
					name={name}
					persistPlaceholder={persistPlaceholder}
					Placeholder={Placeholder}
					renderContent={renderContent}
					renderPlaceholder={renderPlaceholder}
					tag={tag}
				/>
			}
		</>
	)
}
