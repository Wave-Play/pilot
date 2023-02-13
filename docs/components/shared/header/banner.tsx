import { Text, TouchableOpacity, View } from 'react-native'
import { useMediaQuery } from 'react-responsive'
import { sheet } from '@waveplay/snazzy'

const Banner = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
	const onPressNext = () => window.open('https://nextjs.org/docs', '_blank')

	return (
		<View {...styles.root}>
			<View {...styles.content}>
				{ isMobile
					? <Text {...styles.text}><Text {...styles.textBold}>Pilot.js</Text> docs ↓</Text>
					: <Text {...styles.text}>You are viewing the docs for <Text {...styles.textBold}>Pilot.js</Text></Text>
				}
				<TouchableOpacity accessibilityRole={'link'} onPress={onPressNext}>
					<Text {...styles.text}><Text {...styles.textBold}>Next.js</Text> docs →</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
export default Banner

const styles = sheet({
	root: {
		width: '100%',
		height: 50,
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#000'
	},
	content: {
		width: '100%',
		maxWidth: 1440,
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingLeft: 32,
		paddingRight: 32
	},
	text: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '400'
	},
	textBold: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '700'
	}
})
