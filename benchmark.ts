/**
 * © 2022 WavePlay <dev@waveplay.com>
 */
import { Pilot, PilotRouteOptions, RadixRouter, RegexRouter } from '@waveplay/pilot';
import Benchmark from 'benchmark';

const ROUTES: PilotRouteOptions[] = [
	{ path: '/', component: () => null },
	{ path: '/404', component: () => null },
	{ path: '/500', component: () => null },
	{ path: '/settings', component: () => null },
	{ path: '/account/change-password', component: () => null },
	{ path: '/dashboard', component: () => null },
	{ path: '/dashboard/tracks/:id', component: () => null },
	{ path: '/messages', component: () => null },
	{ path: '/messages/:id', component: () => null },
	{ path: '/u/:user/:track', component: () => null },
];
const PATH_TESTS: string[] = ROUTES.map(route => route.path.replaceAll(':', ''));

export const start = async () => {
	const pilot = new Pilot();
	const radixRouter = new RadixRouter();
	const regexRouter = new RegexRouter();

	for (const route of ROUTES) {
		radixRouter.addRoute(route);
		regexRouter.addRoute(route);
	}
	console.log(radixRouter.stats());
	console.log(regexRouter.stats());

	new Benchmark.Suite().add('RadixRouter', function() {
		for (const path of PATH_TESTS) {
			radixRouter.find(path, { pilot });
		}
	}).add('RegexRouter', function() {
		for (const path of PATH_TESTS) {
			regexRouter.find(path, { pilot });
		}
	}).on('cycle', function(event) {
		console.log(String(event.target));
	}).on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	}).run({ async: false });
};
export default start;
start();
