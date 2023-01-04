import { Text, View } from 'react-native'
import { Link } from '@waveplay/pilot/ui'
import { css } from '@/utils/css'
import NavigationLink from '@/components/shared/header/navigation-link'
import { useHover } from '@/utils/use-hover'
import { useMediaQuery } from 'react-responsive'

const LINKS = [
	{
		href: 'https://waveplay.com',
		text: 'Showcase'
	},
	{
		href: '/docs',
		text: 'Docs'
	},
	{
		href: 'https://blog.waveplay.com',
		text: 'Blog'
	}
]

const Navigation = () => {
	const [ref, isHovered] = useHover()
	const isMobile = useMediaQuery({ query: '(max-width: 920px)' })

	return (
		<View {...rootStyle}>
			<View {...contentStyle}>
				<Link {...logoStyle} href={'/'}>
					<Text {...logoTextStyle} accessibilityRole={'link'}>PILOT<Text {...logoTextTinyStyle}>.JS</Text></Text>
				</Link>
				{ isMobile
					? null
					: <View {...linkContainerStyle}>
							{ LINKS.map((link) => (
								<NavigationLink href={link.href} key={link.text} text={link.text}/>
							))}
						</View>
				}
				<Link {...githubLinkStyle(isHovered)} href={'https://github.com/Wave-Play/pilot'}>
					<Text {...githubLinkTextStyle} accessibilityRole={'link'} ref={ref}>GitHub</Text>
				</Link>
			</View>
		</View>
	)
}
export default Navigation

const rootStyle = css({
	width: '100%',
	height: 80,
	display: 'flex',
	alignItems: 'center'
})

const contentStyle = css({
	width: '100%',
	maxWidth: 1440,
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	flexDirection: 'row',
	paddingLeft: 32,
	paddingRight: 32
})

const logoStyle = css({
	marginRight: 26
})

const logoTextStyle = css({
	color: '#fff',
	fontSize: 24,
	fontWeight: 700
})

const logoTextTinyStyle = css({
	fontSize: 10
})

const linkContainerStyle = css({
	flex: 1,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center'
})

const githubLinkStyle = (isHovered: boolean) => css({
	backgroundColor: isHovered ? '#333333' : undefined,
	borderColor: 'rgb(51, 51, 51)',
	borderRadius: 5,
	borderWidth: 1,
	transition: 'background 0.2s ease',
	transitionDuration: 1
})

const githubLinkTextStyle = css({
	color: '#ffffff',
	fontSize: 14,
	fontWeight: 500,
	paddingTop: 8,
	paddingLeft: 16,
	paddingRight: 16,
	paddingBottom: 8
})
