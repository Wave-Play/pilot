<h1 align="center">PilotJS</h1>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/pilot?style=flat)](https://github.com/Wave-Play/pilot/blob/main/LICENSE) [![Tests](https://github.com/Wave-Play/pilot/workflows/CI/badge.svg)](https://github.com/Wave-Play/pilot/actions) ![npm](https://img.shields.io/npm/v/@waveplay/pilot) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/pilot)](https://bundlephobia.com/result?p=@waveplay/pilot)

**NextJS for Expo & React Native**

Customizable, fast, and lightweight drop-in support for **[NextJS](https://nextjs.org/)** on native platforms

</div>

## Features

- Supports most **NextJS** features on native (powered by **NextJS** on web)
- Hooks for loading events with ability to override routes
- Optional placeholders during load events
- Can be used to control individual areas rather than entire screen

## Install

Using NPM

```bash
npm install @waveplay/pilot
```

Using Yarn

```bash
yarn add @waveplay/pilot
```

## Quick start

Update your `App.js` entry component to render `PilotArea`.

> `App.js`
```jsx
import { PilotArea } from '@waveplay/pilot';

const App = () => {
  // ... your code

  return (
    <PilotArea/>
  );
};
export default App;
```

Use the official CLI to build your routes.

```bash
npx pilotjs-cli build
```

You're now ready to use **PilotJS**!

## Basic usage

You can use **PilotJS** the same way as Next Router, except it now works on React Native and Expo projects!

```ts
// const router = useRouter();
const pilot = usePilot();

// router.push('/dashboard');
pilot.fly('/dashboard'); // or pilot.push('/dashboard');

// router.back();
pilot.back();

// router.reload();
pilot.reload();

// router.asPath;
pilot.getPath();

// router.query;
pilot.getQuery();
```

## Supported NextJS features

| Feature              | Support             | Description |
|----------------------|---------------------|-------------|
| `/_app`               | <center>✅</center> | Optional app wrapper is applied on pages when the `_app` route is registered. |
| `/404`               | <center>✅</center> | Rendered when page route cannot be found or when `notFound` is returned as `true` while loading props. |
| `/500`               | <center>✅</center> | Rendered when an error is thrown while loading props. |
| `/pages`             | <center>✅</center> | Automatically finds routes from `/pages` or `/src/pages` directory via `pilotjs-cli build` command. |
| `getServerSideProps` | <center>✅</center> | Calls this function and delegates props if it exists when loading new route. |
| `getStaticProps`     | <center>✅</center> | Calls this function and delegates props if it exists when loading new route. May be skipped if props were cached. |
| `i18n`               | <center>✅</center> | Supports `defaultLocale` and `locales` from next.config.js `i18n` fields. `locale` is passed as a variable in your getProps functions. See pilot-i18next package for full locale support. |
| `revalidate`         | <center>✅</center> | Uses this field returned by your `getStaticProps` function to skip future loading for the time specified. |
| `context`            | <center>🕒</center> | `context` is passed to `getServerSideProps` and `getStaticProps` functions.<br/><br/>Fields not supported yet:<br/>`preview`, `previewData`, `req`, `res` |
| `<Link>`             | <center>🕒</center> | Supports most functionality that `next/link` provides.<br/><br/>Props not supported yet:<br/>`passHref`, `prefetch`, `replace`, `scroll`, `shallow` |
| `redirects`             | <center>🕒</center> | Redirects are supported by returning a `redirect` object.<br/><br/>Redirects defined in `next.config.js` are not supported yet. |
| `useRouter`          | <center>🕒</center> | Supports most functionality using the `usePilot()` hook.<br/><br/>Fields not supported yet:<br/>`basePath`, `domainLocales`, `isFallback`, `isReady`, `isPreview`.<br/><br/>Functions not supported yet:<br/>`beforePopState()`, `events()`, `prefetch()`, `replace()` |
| `/api`     | <center>❌</center> | Not supported yet. |
| `getStaticPaths`     | <center>❌</center> | Not supported yet. |
| `getInitialProps`    | <center>❌</center> | Not supported yet. |
| `middleware`           | <center>❌</center> | Not supported yet. |
| `rewrites`           | <center>❌</center> | Not supported yet. |
| `withRouter`         | <center>❌</center> | Not supported yet. |

If a feature is not in the table above, that likely means there are no plans to support it or we simply missed it. 

Native apps work much differently than a server which means some features may not be possible to support. Please open an issue if you'd like to see a feature added.

## Credits

This project was originally developed as an internal router for [WavePlay](https://waveplay.com).

## Documentation

- [Advanced setup for NextJS](https://github.com/Wave-Play/pilot/blob/main/docs/advanced-nextjs.md)

## License

The MIT License.
