import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { usePilot } from '@waveplay/pilot'
import Head from 'next/head'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { serverSideTranslations } from '../pilot-i18next'
import { useTranslation } from 'react-i18next'

const ExamplePage = () => {
	const pilot = usePilot()
	const { t } = useTranslation('common')

	return (
		<View style={styles.container}>
			<Head>
				<title>Pilot - {t('example-page')}</title>
			</Head>
			<Text style={styles.title}>{t('example-page')}</Text>
			<TouchableOpacity style={styles.button} onPress={() => pilot.back()}>
				<Text style={styles.buttonText}>{t('go-back')}</Text>
			</TouchableOpacity>
		</View>
	)
}
export default ExamplePage

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
	return {
		props: {
			...(await serverSideTranslations(context.locale, ['common']))
		}
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
