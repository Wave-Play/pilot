/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { StyleSheet, Text, View } from 'react-native'

export const Default404 = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.statusCode}>404</Text>
			<View style={styles.pipe} />
			<Text style={styles.text}>This page could not be found.</Text>
		</View>
	)
}

export const Default500 = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.statusCode}>500</Text>
			<View style={styles.pipe} />
			<Text style={styles.text}>Internal Server Error.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	pipe: {
		width: 1,
		height: 32,
		backgroundColor: 'black',
		opacity: 0.4,
		marginLeft: 16,
		marginRight: 16
	},
	statusCode: {
		color: 'black',
		fontSize: 24,
		fontWeight: '500'
	},
	text: {
		color: 'black',
		fontSize: 16,
		fontWeight: '400'
	}
})
