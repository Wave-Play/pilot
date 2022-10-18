<h1 align="center">PilotJS</h1>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/pilot?style=flat)](https://github.com/Wave-Play/pilot/blob/master/LICENSE) [![Tests](https://github.com/Wave-Play/pilot/workflows/CI/badge.svg)](https://github.com/Wave-Play/pilot/actions) ![npm](https://img.shields.io/npm/v/@waveplay/pilot) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/pilot)](https://bundlephobia.com/result?p=@waveplay/pilot)

**NextJS routing for Expo & React Native**

</div>

## Features

- Drop-in replacement for Next Router
- Compatible with React Native, falls back to Next Router for web
- Support for `getServerSideProps` and `getStaticProps`
- Automatic caching based on `revalidate` prop
- Hooks for loading events with ability to override routes
- Optional placeholder component during loading
- Extremelly customizable and fast
- Can be used to control areas instead of whole screen

## Install

Using NPM

```bash
npm install @waveplay/pilot
```

Using Yarn

```bash
yarn add @waveplay/pilot
```

## Getting started for NextJS

No setup is necessary! Just switch your `useRouter` code over to `usePilot` and it'll just automatically work.

Check out the full documentation if you'd like to use more features such as **area navigation**, custom router, placeholders, configuration, controlled rendering, and more!


```ts
// Before
const router = useRouter();
router.push('/dashboard');

// After
const pilot = usePilot();
pilot.fly('/dashboard');

// Or
const router = usePilot();
router.push('/dashboard');
```

## Getting started for React Native

Import each page from your `/pages` directory like the example below.

Pass your `getServerSideProps` or `getStaticProps` as the `getProps` (optional) component for each route and they'll be executed once routed.

If your `getStaticProps` returns a `revalidate` value, Pilot will attempt to cache the result for faster loading later on using [Tiny LRU](https://github.com/avoidwork/tiny-lru).

```tsx
import * as DashboardPage from 'src/pages/dashboard';
import * as HomePage from 'src/pages';
import * as UserPage from 'src/pages/user/[handle]';

const App = () => {
	return (
		<PilotArea>
			<PilotRoute path={'/'} component={HomePage.default}/>
			<PilotRoute path={'/dashboard'} component={DashboardPage.default} getProps={DashboardPage.getServerSideProps}/>
			<PilotRoute path={'/user/:handle'} component={UserPage.default} getProps={UserPage.getStaticProps}/>
		</PilotArea>
  );
};
export default App;
```

## Basic usage

You can use Pilot the same way as Next Router, except it now works on React Native and Expo projects!

```ts
// const router = useRouter();
const pilot = usePilot();

// router.push('/dashboard');
pilot.fly('/dashboard');

// router.back();
pilot.back();

// router.reload();
pilot.reload();

// router.asPath;
pilot.getPath();

// router.query;
pilot.getQuery();
```

## Credits

This project was originally developed as an internal router for [WavePlay](https://waveplay.com).

## Documentation

- [Advanced setup for NextJS](https://github.com/Wave-Play/pilot/blob/master/docs/advanced-nextjs.md)

## License

The MIT License.
