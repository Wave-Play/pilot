import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import Head from 'next/head'
import { GetStaticProps } from 'next'

interface ExamplePageProps {
	title?: string
}
const ExamplePage = (props: ExamplePageProps) => {
	const { title } = props
	const pilot = usePilot()

	return (
		<View style={styles.container}>
			<Head>
				<title>Pilot - {title}</title>
			</Head>
			<Text style={styles.title}>{title}</Text>
			<TouchableOpacity style={styles.button} onPress={() => pilot.back()}>
				<Text style={styles.buttonText}>Go back</Text>
			</TouchableOpacity>
		</View>
	)
}
export default ExamplePage

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {
			title: 'Example Page'
		},
		revalidate: 60 // Cached for 60 seconds
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
