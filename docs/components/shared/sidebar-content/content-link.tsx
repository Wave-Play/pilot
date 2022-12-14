import { usePilot } from '@waveplay/pilot'
import { Text, View } from 'react-native'
import { css } from '@/utils/css'
import { Link } from '@waveplay/pilot/ui'
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
		<Link {...rootStyle} href={href}>
			<View {...dotStyle}/>
			<Text {...textStyle(path.startsWith(href), isHovered)} ref={ref}>{text}</Text>
		</Link>
	)
}
export default ContentLink

const rootStyle = css({
	width: 'fit-content',
	display: 'flex',
	flexDirection: 'row',
	marginBottom: 18
})

const dotStyle = css({
	width: 4,
	height: 4,
	borderRadius: 2,
	backgroundColor: '#666',
	marginTop: 10,
	marginRight: 16
})

const textStyle = (isActive: boolean, isHovered: boolean) => css({
	color: isActive || isHovered ? '#ffffff' : '#999',
	fontSize: 16,
	fontWeight: isActive ? 600 : 400,
	lineHeight: 24,
	transition: 'color 0.2s ease'
})
