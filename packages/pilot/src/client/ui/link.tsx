/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
'use client'
import { forwardRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { usePilot } from '../core/use-pilot'
import type { ComponentType, Ref } from 'react'
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'
import type { Url } from '../../_internal/types'

type WrapperProps = {
	onPress?: (event: GestureResponderEvent) => void
	ref?: Ref<any>
	style?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[]
}

interface LinkProps {
	area?: string
	as?: string
	children?: any
	href?: Url
	locale?: string
	scroll?: boolean
	shallow?: boolean
	style?: any | any[]
	wrapper?: ComponentType<WrapperProps>
}
export const Link = forwardRef<any, LinkProps>((props: LinkProps, ref) => {
	const {
		area,
		as,
		children,
		href,
		locale,
		scroll,
		shallow,
		style,
		wrapper: Wrapper = TouchableOpacity
	} = props
	const pilot = usePilot(area)

	const onPress = () => {
		pilot.fly(href, as, {
			locale,
			scroll,
			shallow
		})
	}

	return <Wrapper onPress={onPress} ref={ref} style={style}>{children}</Wrapper>
})
export default Link
