## Configuration

Pilot.js is meant to work out of the box with zero configuration. However, there are some options you can configure to customize Pilot.js to your needs or to enable some awesome features such as [web props](/docs/web-props.md).

### `pilot.config.js`

Export an object from `pilot.config.js` to configure Pilot.js. The following keys are available:

#### `api/path`

Type: `string`<br>
Default: `'/api/pilot/[...route]'`

The path to your [Next.js API Route](https://nextjs.org/docs/api-routes/introduction) that forwards requests to Pilot.js. This is used to enable [web props](/docs/web-props.md).

#### `commands/devNative`

Type: `string`<br>
Default: `expo start`

The command to run when starting the native app in development mode. This is used by the `pilot dev` command.

#### `commands/devWeb`

Type: `string`<br>
Default: `next dev`

The command to run when starting the web app in development mode. This is used by the `pilot dev` command.

#### `host`

Type: `string`<br>
Default: `undefined`

The URL of the server your app is running on. This is used to enable [web props](/docs/web-props.md) which requires a server runtime to offload work to.

#### `i18n`

Type: `object`<br>
Default: `undefined`

An object containing [i18n configuration](/docs/i18n.md).

#### `logLevel`

Type: `'debug' | 'info' | 'warn' | 'error'`<br>
Default: `undefined`

The log level to use. This is useful for debugging Pilot.js calls. When enabled, Pilot.js will automatically create a [pino](https://getpino.io/) logger and attach it to the default Pilot instance.

#### `pages/exclude`

Type: `string[]`<br>
Default: `undefined`

An array of [glob patterns](https://github.com/isaacs/node-glob#glob-primer) to exclude from the pages directory. This is useful for excluding pages that are not meant to be rendered by Pilot.js.

#### `pages/include`

Type: `string[]`<br>
Default: `undefined`

An array of [glob patterns](https://github.com/isaacs/node-glob#glob-primer) to include from the pages directory. This is useful for including only a small subset of pages to be rendered by Pilot.js.

#### `webProps`

Type: `object`<br>
Default: `undefined`

An optional object containing [web props](/docs/web-props.md) overrides for each page. The keys are the page routes and the values are the web props overrides. Acceptable values are `'always'`, `'auto'` (default), and `'never'`. This is useful for pages that need to be rendered on a specific runtime.

### Instance configuration

It's also possible to configure Pilot.js instances. This is useful for creating multiple instances of Pilot.js with different configurations.

```tsx
// A) Using a custom instance
import { Pilot } from '@waveplay/pilot'
const pilot = new Pilot({
  // ...
})

// B) Using the usePilot hook
import { usePilot } from '@waveplay/pilot'
const pilot = usePilot({
  // ...
})

// C) Using <PilotArea>
import { PilotArea } from '@waveplay/pilot/ui'
<PilotArea config={{
  // ...
}}/>
```

The following keys are only available when configuring this way:

#### `logger`

Type: `Logger`<br>
Default: `undefined`

A logger instance to use. This is useful for integrating Pilot.js with your existing logging system.

#### `nativeCache`

Type: `NativeCache`<br>
Default: `undefined`

A native cache instance to use. [Learn more about caching](/docs/caching.md).

#### `nextRouter`

Type: `NextRouter`<br>
Default: `undefined`

A Next.js router instance to use. `usePilot` will automatically use the router from [`next/router`](https://nextjs.org/docs/api-reference/next/router) if this is not provided (or from [`next/navigation`](https://beta.nextjs.org/docs/routing/linking-and-navigating#userouter-hook) if `appDir` is enabled).
