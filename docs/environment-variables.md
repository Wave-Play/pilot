## Environment variables

Pilot.js comes with built-in support for environment variables. It follows the [same pattern as Next.js](https://nextjs.org/docs/basic-features/environment-variables), but with a few extra features. 

 In addition to being able to use `NEXT_PUBLIC_`, you're also able to use the `PILOT_PUBLIC_` prefix to expose environment variables to only the native apps.

### Loading environment variables

Environment variables are registered during the `pilot build` command. Just like Next.js, we follow [the same load order](https://nextjs.org/docs/basic-features/environment-variables#environment-variable-load-order).

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (Not checked when `NODE_ENV` is `test`.)
4. `.env.$(NODE_ENV)`
5. `.env`

They are then loaded into the `process.env` object by calling `loadEnv()`.

```ts
import { loadEnv } from '@waveplay/pilot/env'

// Call this in your app's entry point (e.g. AppEntry.js)
// This way, PILOT_PUBLIC variables are available only to the native apps
loadEnv()
```

> **Note:** This is automatically called for you when using the Pilot.js `AppEntry.js` file. [Learn more](/docs/managed-entry.md).

### Server-side environment variables

Environment variables not prefixed with `NEXT_PUBLIC_` or `PILOT_PUBLIC_` are only available on the server-side. This means you can safely use them in `getServerSideProps` and `getStaticProps` functions without exposing them to the client-side.

For native apps, make sure you're using [Web Props](/docs/web-props.md) to take advantage of this feature. Server-only environment variables are not available if you're using `getServerSideProps` or `getStaticProps` on the native runtime.
