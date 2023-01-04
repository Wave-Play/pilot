import { Text } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import { Link } from '@waveplay/pilot/ui'
import { css } from '@/utils/css'
import { useHover } from '@/utils/use-hover'

interface NavigationLinkProps {
	href: string
	text: string
}
const NavigationLink = (props: NavigationLinkProps) => {
	const { href, text } = props
	const pilot = usePilot()
	const [ref, isHovered] = useHover()

	// Root path is a special case
	let path = pilot.getPath()
	if (path === '/') {
		path = '/docs'
	}

	return (
		<Link {...linkStyle} href={href}>
			<Text {...linkTextStyle(isHovered || path.startsWith(href))} accessibilityRole={'link'} ref={ref}>{text}</Text>
		</Link>
	)
}
export default NavigationLink

const linkStyle = css({
	marginLeft: 26
})

const linkTextStyle = (isActive: boolean) => css({
	color: isActive ? '#fff' : '#696969',
	fontSize: 14,
	fontWeight: 500,
	transition: 'color 0.2s ease'
})
