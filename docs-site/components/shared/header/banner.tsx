import { Text, TouchableOpacity, View } from 'react-native'
import { css } from '@/utils/css'
import { useMediaQuery } from 'react-responsive'

const Banner = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
	const onPressNext = () => window.open('https://nextjs.org/docs', '_blank')

	return (
		<View {...rootStyle}>
			<View {...contentStyle}>
				{ isMobile
					? <Text {...textStyle}><Text {...textBoldStyle}>Pilot.js</Text> docs ↓</Text>
					: <Text {...textStyle}>You are viewing the docs for <Text {...textBoldStyle}>Pilot.js</Text></Text>
				}
				<TouchableOpacity accessibilityRole={'link'} onPress={onPressNext}>
					<Text {...textStyle}><Text {...textBoldStyle}>Next.js</Text> docs →</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
export default Banner

const rootStyle = css({
	width: '100%',
	height: 50,
	backgroundColor: '#000'
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

const textStyle = css({
	color: '#fff',
	fontSize: 16,
	fontWeight: 400
})

const textBoldStyle = css({
	color: '#fff',
	fontSize: 16,
	fontWeight: 700
})
