import * as React from 'react'
import { registerRootComponent } from 'expo'
import { PilotArea } from './dist/client/index'

function App() {
	return React.createElement(PilotArea)
}
export default registerRootComponent(App)
