<h1 align="center">Pilot.js</h1>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/pilot?style=flat)](https://github.com/Wave-Play/pilot/blob/main/LICENSE) [![Tests](https://github.com/Wave-Play/pilot/workflows/CI/badge.svg)](https://github.com/Wave-Play/pilot/actions) ![npm](https://img.shields.io/npm/v/@waveplay/pilot) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/pilot)](https://bundlephobia.com/result?p=@waveplay/pilot)

**Next.js for Expo & React Native**

Customizable, fast, and lightweight drop-in support for **[Next.js](https://nextjs.org/)** on native platforms

</div>


## Documentation

- [Advanced setup for NextJS](https://github.com/Wave-Play/pilot/blob/main/docs/advanced-nextjs.md)
- [Configuration](/docs/configuration.md)
- [Environment variables](/docs/environment-variables.md)
- [i18n](/docs/i18n.md)
- [Managed entry](docs/managed-entry.md)
- [Web props](/docs/web-props.md)

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

You can either let Pilot.js manage your AppEntry *(A)* or use it as a component *(B)*. The latter is useful if you want more customization.

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

The `build` command will scan your project for pages. You **must** run this before you can use the `start` command or routing may not work.

```bash
pilot build
```

#### Development

The `dev` command will start a development server.

```bash
pilot dev
```

This will:
1. Start a Next.js development server
2. Build Pilot.js routes & link to your local server
3. Start an Expo development server

## Basic usage

You can use **Pilot.js** the same way as **Next.js**, except it now also works on React Native and Expo projects!

```ts
// const router = useRouter();
const pilot = usePilot();

// router.push('/dashboard');
pilot.fly('/dashboard'); // or pilot.push('/dashboard');
```

## Supported NextJS features

| Feature              | Support             | Description |
|----------------------|---------------------|-------------|
| `/_app`               | <center>✅</center> | Optional app wrapper is applied on pages when the `_app` route is registered. |
| `/404`               | <center>✅</center> | Rendered when page route cannot be found or when `notFound` is returned as `true` while loading props. |
| `/500`               | <center>✅</center> | Rendered when an error is thrown while loading props. |
| `/pages`             | <center>✅</center> | Automatically finds routes from `/pages` or `/src/pages` directory via `pilot build` command. |
| `getServerSideProps` | <center>✅</center> | Calls this function and delegates props if it exists when loading new route. |
| `getStaticProps`     | <center>✅</center> | Calls this function and delegates props if it exists when loading new route. May be skipped if props were cached. |
| `i18n`               | <center>✅</center> | Supports `defaultLocale` and `locales` from next.config.js `i18n` fields. `locale` is passed as a variable in your getProps functions. See pilot-i18next package for full locale support. |
| `revalidate`         | <center>✅</center> | Uses this field returned by your `getStaticProps` function to skip future loading for the time specified. |
| `.env`							 | <center>✅</center> | Environment variables are loaded during `pilot build`. This follows the [same pattern](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser) and [load order](https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order) as Next.js. |
| `context`            | <center>🕒</center> | `context` is passed to `getServerSideProps` and `getStaticProps` functions.<br/><br/>If not using web props, `req` and `res` will be empty objects.<br/><br/>Fields not supported yet:<br/>`preview`, `previewData` |
| `<Link>`             | <center>🕒</center> | Supports most functionality that `next/link` provides.<br/><br/>Props not supported yet:<br/>`passHref`, `prefetch`, `replace`, `scroll`, `shallow` |
| `redirects`             | <center>🕒</center> | Redirects are supported by returning a `redirect` object.<br/><br/>Redirects defined in `next.config.js` are not supported yet. |
| `useRouter`          | <center>🕒</center> | Supports most functionality using the `usePilot()` hook.<br/><br/>Fields not supported yet:<br/>`basePath`, `domainLocales`, `isFallback`, `isReady`, `isPreview`.<br/><br/>Functions not supported yet:<br/>`beforePopState()`, `events()`, `prefetch()`, `replace()` |
| `/api`     | <center>❌</center> | Not supported yet. |
| `getStaticPaths`     | <center>❌</center> | Not supported yet. |
| `getInitialProps`    | <center>❌</center> | Not supported yet. |
| `middleware`         | <center>❌</center> | Not supported yet. |
| `rewrites`           | <center>❌</center> | Not supported yet. |
| `withRouter`         | <center>❌</center> | Not supported yet. |
| `appDir`             | <center>❌</center> | Not supported yet. |
| `serverComponents`   | <center>❌</center> | Not supported yet. |

If a feature is not in the table above, that likely means there are no plans to support it or we may have missed it. 

Native apps work much differently than a server which means some features may not be possible to support. Please open an issue if you'd like to see a feature added.

## Credits

This project was originally developed as an internal router for [WavePlay](https://waveplay.com).

## License

The MIT License.
