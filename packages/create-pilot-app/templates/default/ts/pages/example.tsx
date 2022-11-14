import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import Head from 'next/head'

const ExamplePage = () => {
	const pilot = usePilot()

	return (
		<View style={styles.container}>
			<Head>
				<title>Pilot - Example Page</title>
			</Head>
			<Text style={styles.title}>Example Page</Text>
			<TouchableOpacity style={styles.button} onPress={() => pilot.back()}>
				<Text style={styles.buttonText}>Go back</Text>
			</TouchableOpacity>
		</View>
	)
}
export default ExamplePage

export const getStaticProps = async () => {
	return {
		props: {}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 24,
		fontWeight: '600'
	},
	button: {
		height: 48,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: 'teal',
		borderRadius: 24,
		paddingLeft: 16,
		paddingRight: 16,
		marginTop: 16
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '400'
	}
})
