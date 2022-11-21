import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import Head from 'next/head'
import type { GetStaticProps, GetStaticPropsContext } from 'next'
import { serverSideTranslations } from '../pilot-i18next'
import { useTranslation } from 'react-i18next'

const LANGUAGES = ['en', 'es', 'ja']

const Home = () => {
	const pilot = usePilot()
	const { t } = useTranslation('common')

	return (
		<View style={styles.container}>
			<Head>
				<title>Pilot - Basic Demo</title>
			</Head>
			<Text style={styles.title}>{t('home')}</Text>
			<TouchableOpacity style={styles.button} onPress={() => pilot.fly('/example')}>
				<Text style={styles.buttonText}>{t('go-to-example')}</Text>
			</TouchableOpacity>
			<Text style={styles.changeLanguage}>{t('change-language')}</Text>
			<View style={styles.rowContainer}>
				{ LANGUAGES.map(language => (
					<TouchableOpacity key={language} style={styles.button} onPress={() => pilot.fly('/', undefined, { locale: language })}>
						<Text style={styles.buttonText}>{language}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}
export default Home

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
	return {
		props: await serverSideTranslations(context.locale, ['common'])
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
	},
	changeLanguage: {
		fontSize: 16,
		fontWeight: '400',
		marginTop: 32
	},
	rowContainer: {
		width: '50%',
		minWidth: 200,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16
	}
})
