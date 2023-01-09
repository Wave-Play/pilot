/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
'use client'
import { forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { usePilot } from '../core/use-pilot'
import type { Url } from '../../_internal/types'

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
export const Link = forwardRef<any, LinkProps>((props: LinkProps, ref) => {
	const { area, as, children, href, locale, scroll, shallow, style } = props
	const pilot = usePilot(area)

	const onPress = () => {
		pilot.fly(href, as, {
			locale,
			scroll,
			shallow
		})
	}

	return <TouchableOpacity onPress={onPress} ref={ref} style={style}>{children}</TouchableOpacity>
})
export default Link
