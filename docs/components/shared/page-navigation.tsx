import { Text, View } from 'react-native'
import { Link } from '@waveplay/pilot/link'
import { css, sheet } from '@waveplay/snazzy'
import { useHover } from '@/utils/use-hover'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

interface PageNavigationProps {
	previous?: {
		path: string
		title: string
	}
	next?: {
		path: string
		title: string
	}
}
const PageNavigation = (props: PageNavigationProps) => {
	const { previous, next } = props
	const [previousRef, isPreviousHovered] = useHover()
	const [nextRef, isNextHovered] = useHover()

	return (
		<View {...styles.root}>
			{ previous
				? <Link {...linkStyle(isPreviousHovered, 'flex-start')} href={previous.path} ref={previousRef}>
						<Icon color={'#ffffff'} path={mdiChevronLeft} size={'24px'}/>
						<Text {...styles.text}>{previous.title}</Text>
					</Link>
				: <View/>
			}
			{ next
				? <Link {...linkStyle(isNextHovered, 'flex-end')} href={next.path} ref={nextRef}>
						<Text {...styles.text}>{next.title}</Text>
						<Icon color={'#ffffff'} path={mdiChevronRight} size={'24px'}/>
					</Link>
				: <View/>
			}
		</View>
	)
}
export default PageNavigation

const styles = sheet({
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 48,
		paddingLeft: 8,
		paddingRight: 8
	},
	text: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 400,
		lineHeight: 26.4,
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 8,
		paddingRight: 8
	}
})

const linkStyle = (isHovered: boolean, justifyContent: string) => css({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: justifyContent,
	flex: 1,
	backgroundColor: isHovered ? '#333' : undefined,
	borderRadius: 7,
	transition: 'background-color 0.2s ease'
})
