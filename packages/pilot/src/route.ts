/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import type { GetServerSideProps, GetStaticProps } from 'next';
import { ComponentType, FunctionComponent } from 'react';

/** 
 * PilotPath is an empty component whose sole purpose is to make it easy to define paths.
 * The PilotProvider extracts these props and stores them for navigation.
 */
export interface PilotRouteOptions {
	component: ComponentType
	getProps?: GetServerSideProps | GetStaticProps
	path: string
}
export const PilotRoute: FunctionComponent<PilotRouteOptions> = () => null;
