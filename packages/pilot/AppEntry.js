import * as React from 'react'
import { registerRootComponent } from 'expo'
import { loadEnv } from './dist/env'
import { PilotArea } from './dist/client/index'

loadEnv()

function App() {
	return React.createElement(PilotArea)
}
export default registerRootComponent(App)
