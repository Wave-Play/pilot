import { Text } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import { Link } from '@waveplay/pilot/link'
import { css, sheet } from '@waveplay/snazzy'
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
		<Link {...styles.root} href={href} ref={ref}>
			<Text {...textStyle(isHovered || path.startsWith(href))} accessibilityRole={'link'}>{text}</Text>
		</Link>
	)
}
export default NavigationLink

const styles = sheet({
	root: {
		marginLeft: 26
	}
})

const textStyle = (isActive: boolean) => css({
	color: isActive ? '#fff' : '#696969',
	fontSize: 14,
	fontWeight: 500,
	transition: 'color 0.2s ease'
})
