import { Text, View } from 'react-native'
import { Link } from '@waveplay/pilot/ui'
import { css } from '@/utils/css'
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
		<View {...rootStyle}>
			{ previous
				? <Link {...linkStyle(isPreviousHovered)} href={previous.path}>
						<Icon color={'#ffffff'} path={mdiChevronLeft} size={'24px'}/>
						<Text {...textStyle} ref={previousRef}>{previous.title}</Text>
					</Link>
				: <View/>
			}
			{ next
				? <Link {...linkStyle(isNextHovered)} href={next.path}>
						<Text {...textStyle} ref={nextRef}>{next.title}</Text>
						<Icon color={'#ffffff'} path={mdiChevronRight} size={'24px'}/>
					</Link>
				: <View/>
			}
		</View>
	)
}
export default PageNavigation

const rootStyle = css({
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	marginTop: 48,
	paddingLeft: 8,
	paddingRight: 8
})

const linkStyle = (isHovered: boolean) => css({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	backgroundColor: isHovered ? '#333' : undefined,
	borderRadius: 7,
	transition: 'background-color 0.2s ease'
})

const textStyle = css({
	color: '#ffffff',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 26.4,
	paddingTop: 4,
	paddingBottom: 4,
	paddingLeft: 8,
	paddingRight: 8
})
