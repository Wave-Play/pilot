<p align="center">
  <a href="https://pilot.waveplay.dev">
    <picture>
			<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Wave-Play/pilot/canary/docs/public/logo-round.png">
      <img src="https://raw.githubusercontent.com/Wave-Play/pilot/canary/docs/public/logo-round.png" height="128">
    </picture>
    <h1 align="center">Pilot.js</h1>
  </a>
</p>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/pilot?style=flat)](https://github.com/Wave-Play/pilot/blob/main/LICENSE) [![Tests](https://github.com/Wave-Play/pilot/workflows/CI/badge.svg)](https://github.com/Wave-Play/pilot/actions) ![npm](https://img.shields.io/npm/v/@waveplay/pilot) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/pilot)](https://bundlephobia.com/result?p=@waveplay/pilot)

**Next.js for Expo & React Native**

Customizable, fast, and lightweight drop-in support for **[Next.js](https://nextjs.org/)** on native platforms

</div>


## Documentation

Visit [https://pilot.waveplay.dev/docs](https://pilot.waveplay.dev/docs) to view the full documentation.

## Quick start

Create a new Pilot.js app via our interactive CLI:

```bash
npx create-pilot-app
```

This will guide you through a short customization process and create a fully working template.

## Adding to an existing project

Install the package:

```bash
npm install @waveplay/pilot
```

We assume you already have a working project with Expo and Next.js. If not, follow their respective guides:

- [Expo - Get started](https://docs.expo.dev/get-started/create-a-new-app/)
- [Next.js - Getting Started](https://nextjs.org/docs/getting-started)
- [Next.js - examples/with-expo](https://github.com/vercel/next.js/tree/canary/examples/with-expo)

You can either let Pilot.js [manage your app's entry](https://pilot.waveplay.dev/docs/managed-entry.md) or you can use the `<PilotArea>` component directly. The latter is useful if you need additional customization.

#### A) Managed AppEntry

Edit your `app.json` to include the following:

```json
{
  "expo": {
    "entryPoint": "node_modules/@waveplay/pilot/AppEntry.js"
  }
}
```

#### B) Custom AppEntry
Update your `App.js` entry component to render `PilotArea`.

```jsx
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

You're now ready to use **Pilot.js**! Use it like you would use Next.js.

## Usage

Pilot.js relies on the built-in CLI to detect pages and routes.

#### Build

The `build` command will prepare your project. You **must** run this before you can use the `start` command or routing may not work.

```bash
pilot build
```

#### Development

The `dev` command will start a development server on native + web.

```bash
pilot dev
```

This will:
1. Start a Next.js development server
2. Build Pilot.js & link to your local Next.js server
3. Start an Expo development server

## Basic usage

You can use **Pilot.js** the same way as **Next.js**, except it now also works on React Native and Expo projects!

```ts
// const router = useRouter();
const pilot = usePilot();

// router.push('/dashboard');
pilot.fly('/dashboard'); // or pilot.push('/dashboard');
```

## Credits

This project was originally developed as an internal router for [WavePlay](https://waveplay.com).

## License

The MIT License.
