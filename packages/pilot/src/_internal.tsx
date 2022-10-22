/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { ComponentType, FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PilotPage } from './types';

export interface ActionResult {
	page?: PilotPage
	redirect?: string
}

export type DataMap = { [key: string]: string }

export interface FlightOptions {
	action: (path: string) => Promise<ActionResult | null>
	addToStack?: boolean
}

export interface PageModule {
	default: ComponentType
}

export interface PageRoute {
	getProps?: string
	importPath?: string
	path: string
}

export type Url = string | {
	pathname: string
	query?: DataMap
}

let id = 0;
export const generateNumber = () => id++;

/**
 * Smol utility function meant to help us wait for a window event to fire.
 * This is super useful for waiting for window reload and back events!
 */
export const eventWaiter = async (event: string): Promise<any> => {
	return new Promise<any>((resolve) => {
		const callback = () => resolve(callback);
		window.addEventListener(event, callback);
	});
};

export const Default404: FunctionComponent = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.statusCode}>404</Text>
			<View style={styles.pipe}/>
			<Text style={styles.text}>This page could not be found.</Text>
		</View>
	);
};

export const Default500: FunctionComponent = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.statusCode}>500</Text>
			<View style={styles.pipe}/>
			<Text style={styles.text}>Internal Server Error.</Text>
		</View>
	);
};

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
		opacity: .4,
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
});
