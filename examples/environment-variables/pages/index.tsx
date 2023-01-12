import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import Head from 'next/head'

const Home = () => {
	const [envValues, setEnvValues] = useState({})
	useEffect(() => {
		setEnvValues({
			ENV_VARIABLE: process.env.ENV_VARIABLE,
			NEXT_PUBLIC_ENV_VARIABLE: process.env.NEXT_PUBLIC_ENV_VARIABLE,
			PILOT_PUBLIC_ENV_VARIABLE: process.env.PILOT_PUBLIC_ENV_VARIABLE,
			DEVELOPMENT_ENV_VARIABLE: process.env.DEVELOPMENT_ENV_VARIABLE,
			NEXT_PUBLIC_DEVELOPMENT_ENV_VARIABLE: process.env.NEXT_PUBLIC_DEVELOPMENT_ENV_VARIABLE,
			PILOT_PUBLIC_DEVELOPMENT_ENV_VARIABLE: process.env.PILOT_PUBLIC_DEVELOPMENT_ENV_VARIABLE,
			PRODUCTION_ENV_VARIABLE: process.env.PRODUCTION_ENV_VARIABLE,
			NEXT_PUBLIC_PRODUCTION_ENV_VARIABLE: process.env.NEXT_PUBLIC_PRODUCTION_ENV_VARIABLE,
			ENV_LOCAL_VARIABLE: process.env.ENV_LOCAL_VARIABLE,
			NEXT_PUBLIC_ENV_LOCAL_VARIABLE: process.env.NEXT_PUBLIC_ENV_LOCAL_VARIABLE
		})
	}, [])

	return (
		<View style={styles.container}>
			<Head>
				<title>Environment Variables Demo | Pilot.js</title>
			</Head>
			<Text style={styles.title}>Environment Variables Demo</Text>
			<View style={styles.envContainer}>
				<TextInput
					style={styles.env}
					editable={false}
					scrollEnabled={true}
					multiline={true}
					value={JSON.stringify(envValues, undefined, 2)}/>
			</View>
		</View>
	)
}
export default Home

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fafafa',
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 24,
		fontWeight: '600'
	},
	envContainer: {
		width: '100%',
		maxWidth: 400,
		marginTop: 24,
		paddingLeft: 16,
		paddingRight: 16
	},
	env: {
		width: '100%',
		height: 224,
		backgroundColor: 'white',
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		paddingTop: 12,
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 12
	}
})
