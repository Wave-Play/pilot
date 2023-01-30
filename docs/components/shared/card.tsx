import { Text } from 'react-native'
import { Link } from '@waveplay/pilot/link'
import { css, sheet } from '@waveplay/snazzy'
import { useHover } from '@/utils/use-hover'

interface CardProps {
	description: string
	href: string
	title: string
}
const Card = (props: CardProps) => {
	const { description, href, title } = props
	const [ref, isHovered] = useHover()

	return (
		<Link {...styles.root} href={href} ref={ref}>
			<Text {...styles.title}>{title}</Text>
			<Text {...descriptionStyle(isHovered)}>{description}</Text>
		</Link>
	)
}
export default Card

const styles = sheet({
	root: {
		width: '100%',
		backgroundColor: '#000',
		borderColor: 'rgb(51, 51, 51)',
		borderRadius: 3,
		borderWidth: 1,
		padding: 24,
		marginTop: 12,
		marginBottom: 12
	},
	title: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '600',
		lineHeight: 24
	}
})

const descriptionStyle = (isHovered: boolean) => css({
	color: isHovered ? '#fff' : '#999',
	fontSize: 14,
	fontWeight: 400,
	lineHeight: 23.1,
	marginTop: 4,
	transition: 'color 0.2s ease'
})