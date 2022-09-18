import React from 'react';
import { PilotArea, PilotRoute } from '@waveplay/pilot';
import * as HomePage from './pages';
import * as ExamplePage from './pages/example';

export default function App() {
  return (
		<PilotArea>
			<PilotRoute path={'/'} component={HomePage.default} default={true}/>
			<PilotRoute path={'/example'} component={ExamplePage.default} getProps={ExamplePage.getStaticProps}/>
		</PilotArea>
  );
}
