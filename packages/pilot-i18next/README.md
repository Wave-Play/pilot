<h1 align="center">Pilot i18Next</h1>

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Wave-Play/pilot-i18next?style=flat)](https://github.com/Wave-Play/pilot-i18next/blob/main/LICENSE) [![Tests](https://github.com/Wave-Play/pilot-i18next/workflows/CI/badge.svg)](https://github.com/Wave-Play/pilot-i18next/actions) ![npm](https://img.shields.io/npm/v/@waveplay/pilot-i18next) [![minizipped size](https://badgen.net/bundlephobia/minzip/@waveplay/pilot-i18next)](https://bundlephobia.com/result?p=@waveplay/pilot-i18next)

**Support for i18next in Pilot router**

</div>

## Install

Using NPM

```bash
npm install @waveplay/pilot-i18next next-i18next
```

Using Yarn

```bash
yarn add @waveplay/pilot-i18next next-i18next
```

## Getting started

Register your translations with this module using the built-in CLI. We assume that your i18n translations are inside the `/public/locales` directory. 

```bash
pilot-i18next build
```

> All this command does is copy those translations into the module and generate a `import-resource.js` for internal use.

## Basic usage

Wrap your app export with the `appWithTranslation` function. This will automatically add the `i18n` instance + resources to your app's context.

> `App.tsx`
```tsx
const App = () => {
  // ... your code
};
export default appWithTranslation(App);
```

Include `serverSideTranslations` in your returned props from your `getServerSideProps` function. Be sure to specify the namespaces you want to load.

> `example-page.tsx`
```tsx
export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
};
```

You're now ready to use the `useTranslation` hook in your components!

> `example-page.tsx`
```tsx
const ExamplePage = () => {
  const { t } = useTranslation('common');

  return (
    <View>
      <Text>{t('title')}</Text>
    </View>
  );
};
```

It's recommended to import the `useTranslation` hook directly from `react-i18next`.

## Common issues

Your bundler may complain about the `fs` module not being found. That's because this module exports `next-i18next` for web builds, which are not meant to be used on native.

To fix this, create two files named the same way, but one with a `.native.ts` extension like this:

> `pilot-i18next.ts`
```ts
export * from '@waveplay/pilot-i18next/dist/index';
```

> `pilot-i18next.native.ts`
```ts
export * from '@waveplay/pilot-i18next/dist/index.native';
```

... and change your imports in your code to use this file instead.
> `App.tsx`
```ts
import { appWithTranslation, serverSideTranslations } from './pilot-i18next';
```

Your bundler should now happily import only the `.native` version on native builds, keeping the `fs` issue away.

## Credits

This project was originally developed for [WavePlay](https://waveplay.com).

## License

The MIT License.
