import { Text } from 'react-native'
import { css } from '@/utils/css'
import { Link } from '@waveplay/pilot/link'
import { useHover } from '@/utils/use-hover'

interface HeadingLinkProps {
	active: boolean
	slug: string
	subheading?: boolean
	text: string
}
const HeadingLink = (props: HeadingLinkProps) => {
	const { active, slug, subheading, text } = props
	const [ref, isHovered] = useHover()

	return (
		<Link href={'#' + slug} ref={ref}>
			<Text {...contentLinkStyle(active, isHovered, subheading)} accessibilityRole={'link'}>{text}</Text>
		</Link>
	)
}
export default HeadingLink

const contentLinkStyle = (isActive: boolean, isHovered: boolean, isSubheading?: boolean) => css({
	color: isActive || isHovered ? '#ffffff' : '#999999',
	fontSize: 14,
	fontWeight: isActive ? 500 : 400,
	lineHeight: 26.4,
	paddingLeft: isSubheading ? 20 : 0,
	marginBottom: 5,
	transition: 'color 0.2s ease'
})
