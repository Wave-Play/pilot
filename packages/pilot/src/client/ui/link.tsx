/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
'use client'
import { FunctionComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import type { Url } from '../../_internal/types'
import { usePilot } from '../core/use-pilot'

interface LinkProps {
	area?: string
	as?: string
	children?: any
	href?: Url
	locale?: string
	scroll?: boolean
	shallow?: boolean
	style?: any | any[]
}
export const Link: FunctionComponent<LinkProps> = (props: LinkProps) => {
	const { area, as, children, href, locale, scroll, shallow, style } = props
	const pilot = usePilot(area)

	const onPress = () => {
		pilot.fly(href, as, {
			locale,
			scroll,
			shallow
		})
	}

	return <TouchableOpacity onPress={onPress} style={style}>{children}</TouchableOpacity>
}
