## Managed entry

Pilot.js comes with a managed entry point that you can use to get started quickly. This is the recommended way to get started with Pilot.js.

Edit your `app.json` to include the following:

```json
{
  "expo": {
    "entryPoint": "node_modules/@waveplay/pilot/AppEntry.js"
  }
}
```

This will automatically load your environment variables and render the `PilotArea` component on your behalf so you can focus on your pages as your would with Next.js.

## Custom entry

You're still free to use your own entry point if you prefer. This is useful if you want to customize the `<PilotArea>` component or if you want to use Pilot.js with a different framework.

Make sure you're calling `loadEnv()` and rendering the `<PilotArea>` component otherwise Pilot.js won't work as expected.

```tsx
import { loadEnv } from '@waveplay/pilot/env'
import { PilotArea } from '@waveplay/pilot/ui'

// Loads public environment variables
loadEnv()

const App = () => {
	// ... your code

	return (
		<PilotArea/>
	)
}
export default App
```

> **Note:** Remember that this file only runs on the native runtime. You can't use any Next.js features here.
