import { usePilot } from '@waveplay/pilot'
import { Text, View } from 'react-native'
import { css, sheet } from '@waveplay/snazzy'
import { Link } from '@waveplay/pilot/link'
import { useHover } from '@/utils/use-hover'

interface ContentLinkProps {
	href: string
	text: string
}
const ContentLink = (props: ContentLinkProps) => {
	const { href, text } = props
	const pilot = usePilot()
	const [ref, isHovered] = useHover()

	// Root path is a special case
	let path = pilot.getPath()
	if (path === '/' || path === '/docs') {
		path = '/docs/getting-started'
	}

	return (
		<View {...styles.root}>
			<View {...styles.dot}/>
			<Link href={href} ref={ref}>
				<Text {...textStyle(path.startsWith(href), isHovered)}>{text}</Text>
			</Link>
		</View>
	)
}
export default ContentLink

const styles = sheet({
	root: {
		width: 'fit-content',
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 18
	},
	dot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#666',
		marginTop: 10,
		marginRight: 16
	}
})

const textStyle = (isActive: boolean, isHovered: boolean) => css({
	color: isActive || isHovered ? '#ffffff' : '#999',
	fontSize: 16,
	fontWeight: isActive ? 600 : 400,
	lineHeight: 24,
	transition: 'color 0.2s ease'
})
