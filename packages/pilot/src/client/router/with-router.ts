/**
 * © 2023 WavePlay <dev@waveplay.com>
 */
import { createElement } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { usePilot } from '../core/use-pilot'
import type { ComponentType } from 'react'
import type { Pilot } from '../core/pilot'

interface InjectedProps {
	router: Pilot
}

export function withRouter<P extends InjectedProps>(WrappedComponent: ComponentType<P>, area?: string): ComponentType<P> {
	const ComponentWithRouter = (props: P) => {
		const router = usePilot(area)
		return createElement(WrappedComponent, { ...props as P, router })
	}

	return hoistNonReactStatics(ComponentWithRouter, WrappedComponent)
}
