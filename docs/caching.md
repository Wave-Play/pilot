## Caching

Props returned from `getStaticProps` can be cached by Pilot.js to improve performance and reduce network requests.

This feature is enabled by default when using [Web Props](/docs/web-props.md) and not enabled by default when using the native runtime.

### Native runtime cache

To enable caching for the native runtime, pass a `nativeCache` key to your [Pilot instance config](/docs/configuration.md). This key should be an object that matches the following interface:

```ts
interface NativeCache {
  clear(): boolean
  delete(key: string): boolean
  evict(): boolean
  get(key: string): any | undefined
  keys(): string[]
  set(key: string, value: any): boolean
}
```

> **Note:** One such implementation is [tiny-lru](https://github.com/avoidwork/tiny-lru) which persists cache in memory for the duration of the app's runtime. You can leverage other libraries such as [@waveplay/stashy](https://github.com/Wave-Play/stashy) to persist cache to disk instead.

### Web props cache

When using [Web Props](/docs/web-props.md), caching is enabled by default. You can disable it by setting the `cache` key in your `pilot.config.js` file to `false`.

```js
module.exports = {
  cache: false
}
```

> **Note:** Cache is persisted to disk using Node's `fs` module to the `.pilot/cache` directory. This directory is automatically cleared when running `pilot build` or `pilot dev`.