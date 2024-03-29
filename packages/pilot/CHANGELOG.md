# Change Log

## 3.3.0

### Minor Changes

- 59977ea: feat(cli): new "up-dirs" option for better monorepo support

### Patch Changes

- 336380d: fix(cli): minor port typo in logs when running "dev" command
- 315db4c: fix(cli): commonjs config files not being recognized

## 3.2.0

### Minor Changes

- 67c574d: chore: updated to jotai v2

### Patch Changes

- 3ac0a3b: fix(cli): doctor command no longer causes hangups
- f08108e: feat: errors now logged by default

## 0.0.0-canary-20230124042950

### Patch Changes

- 57cc832: fix(cli): doctor command no longer causes hangups

## 0.0.0-canary-20230120164757

### Patch Changes

- 54eaba8: fix: redirect chain behavior with nested query params

## 3.1.2

### Patch Changes

- 04b109c: fix(cli): custom command options should be delegated when using npm or pnpm
- 942a256: fix: use correct slashes when building on windows
- 7755630: fix(api): use correct platform slashes in get-props
- b84af2d: fix(cli): exclude pnpm from .cmd suffix on windows
- 080ca85: fix: use correct absolute path protocol when importing config files on windows

## 3.1.1

### Patch Changes

- 2a0ad79: fix(cli): use correct spawn command on windows

## 3.1.0

### Minor Changes

- 5cc38da: feat: support for pre-defined redirects
- 5ee2b2c: feat: withRouter HOC
- 0db449d: feat(cli): new doctor command
- accf7a9: refactor(cli): removed internal compiler as part of build process
- 7b42f6c: feat: rewrites support

## 0.0.0-canary-20230109030829

### Patch Changes

- d9cb0c1: patch: built-in document export now uses CommonJS syntax

## 0.0.0-canary-20230109012509

### Minor Changes

- 101cebe: feat: can now pass custom component wrapper as prop to Link
- 5f42e23: feat: Link component now uses forwardRef
- a68b017: feat: support for .mjs config files
- ddad6a1: feat: direct pilot/link module

## 3.0.0

### Major Changes

- f0d7eb7: fixed version number
- f6ae9e4: chore: fixed version numbers

## 0.0.0

### Major Changes

- 4a286e5: feat: decoupled native runtime cache (**BREAKING**)
  feat: tunnel-less dev environment
  refactor: decoupled locales from build and removed build:pages command
  refactor: export only core modules from root. **BREAKING CHANGE:** You may need to update your code if you were importing <PilotArea> or another UI component from the root @waveplay/pilot module. Use @waveplay/pilot/ui instead.
  b30c295: refactor: removed regex router. This was never used after replacing with RadixRouter. Use RadixRouter instead or provide your own regex router.
- b796f72: feat: decoupled native runtime cache (**BREAKING**)
  feat: tunnel-less dev environment
  refactor: decoupled locales from build and removed build:pages command
  refactor: export only core modules from root. **BREAKING CHANGE:** You may need to update your code if you were importing <PilotArea> or another UI component from the root @waveplay/pilot module. Use @waveplay/pilot/ui instead.
  b30c295: refactor: removed regex router. This was never used after replacing with RadixRouter. Use RadixRouter instead or provide your own regex router.

### Minor Changes

- b796f72: feat: new AppEntry.js and document.js files for convenience
  feat: i18next support now part of main package
  feat: new "logLevel" field in pilot.config.js
  feat: new getHost() pilot function that returns dev-aware host
  feat: .next cache is now always cleared upon running pilot dev
  feat: environment variables support
  feat: support next configs that export functions
  feat: support glob patterns in pages config
- 4a286e5: feat: new AppEntry.js and document.js files for convenience
  feat: i18next support now part of main package
  feat: new "logLevel" field in pilot.config.js
  feat: new getHost() pilot function that returns dev-aware host
  feat: .next cache is now always cleared upon running pilot dev
  feat: environment variables support
  feat: support next configs that export functions
  feat: support glob patterns in pages config

### Patch Changes

- 4a286e5: patch: better support for PNPM projects
  fix: check defaultConfig for default locale upon Pilot creation
  fix: improved api handler error logic
  fix: malformed url object with query on web
  patch: support "use client" directive
  fix: back() on web with no prior stack
  patch: internal Next router reference is now always fresh
- b796f72: patch: better support for PNPM projects
  fix: check defaultConfig for default locale upon Pilot creation
  fix: improved api handler error logic
  fix: malformed url object with query on web
  patch: support "use client" directive
  fix: back() on web with no prior stack
  patch: internal Next router reference is now always fresh

## 0.0.0-canary-20221222173224

### Patch Changes

- 6eebabc: fix: pass style prop onto Link component

## 0.0.0-canary-20221220175921

### Minor Changes

- 508ebb8: feat: support glob patterns in pages config

## 0.0.0-canary-20221220052919

### Minor Changes

- ad11fac: feat: replaced cloudflared with localtunnel for --tunnel option

### Patch Changes

- afb2410: fix: use correct import in AppEntry

## 0.0.0-canary-20221219073629

### Major Changes

- 11dca06: refactor: export only core modules from root. BREAKING CHANGE: You may need to update your code if you were importing `<PilotArea>` or another UI component from the root `@waveplay/pilot` module. Use `@waveplay/pilot/ui` instead.
- b30c295: refactor: removed regex router. This was never used after replacing with RadixRouter. Use RadixRouter instead or provide your own regex router.

## 0.0.0-canary-20221219070445

### Major Changes

- b302014: refactor: decoupled locales from build and removed build:pages command

### Patch Changes

- b302014: feat: support next configs that export functions

## 0.0.0-canary-20221214053754

### Minor Changes

- b29f638: feat: environment variables support

## 0.0.0-canary-20221208180056

### Minor Changes

- 38c1960: feat: .next cache is now always cleared upon running pilot dev
- da44ef6: feat: new getHost() pilot function that returns dev-aware host

### Patch Changes

- 9e67011: patch: internal Next router reference is now always fresh

## 0.0.0-canary-20221128173918

### Patch Changes

- 84ad17f: patch: support "use client" directive
- 316cdef: fix: back() on web with no prior stack

## 0.0.0-canary-20221127013741

### Major Changes

- e368a39: feat: tunnel-less dev environment

### Minor Changes

- 64044fc: feat: new "logLevel" field in pilot.config.js

### Patch Changes

- ff6c150: fix: malformed url object with query on web

## 0.0.0-canary-20221121073657

### Patch Changes

- 90135d2: fix: template api route fixes & improved api handler error logic

## 0.0.0-canary-20221121023544

### Minor Changes

- 709c225: feat: i18next support now part of main package

### Patch Changes

- 0f43e88: patch: better support for PNPM projects
- 964e8dd: fix: check defaultConfig for default locale upon Pilot creation
- 258cd50: refactor: moved \_generated-pages.js into \_generated directory

## 0.0.0-canary-20221119225656

### Patch Changes

- 06d1255: fix: make sure to await renderPage in \_document

## 0.0.0-canary-20221119044259

### Major Changes

- 3e03873: BREAKING: decoupled native runtime cache

### Minor Changes

- 07ce324: feat: new AppEntry.js and document.js files for convenience

## 2.3.0

### Minor Changes

- 8c10b19: feat: integrated cli into main package

### Patch Changes

- f042fa3: patch: fixed working directory usage in monorepos

## 2.2.1

### Patch Changes

- efc6818: patch: only use local tunnel outside of production
- 0dd8519: feat: dev command now prepares Pilot.js instance "dev" fields
- 1a0fdec: feat: "dev" command will now auto detect package manager & allow custom commands

## 2.2.0

### Minor Changes

- f1295cb: feat: page-level webProps setting
- ed4416f: feat: pilot.config() can now be used as a getter function

### Patch Changes

- 0098f10: refactor: new Config type for pilot.config.js typing
- dc327fd: fix: use correct path when importing pages in getProps API
- b5dc3b1: patch: getProps functions now include "defaultLocales" and "locales" fields
- f32f118: patch: improved cache keys in server getStaticProps

## 2.1.0

### Minor Changes

- 778ce99: feat: props can now be loaded via Next.js API routes

  feat: new `createHandler` export from `@waveplay/pilot/api` to create a Next.js API route handler

  refactor: renamed internal "getProps" to "getPropsType" in generated files

  refactor: reorganized internal packages for better bundling (does not affect external usage)

  chore: node engine version bump & cleaned up package.json

  feat: new webProps option to control how prop loading works

## 0.0.0-canary-20221111070614

### Minor Changes

- 8fc6ea6: feat: cache SSG and ISG data in local file system

## 0.0.0-canary-20221110065829

### Patch Changes

- fix: use correct entry file

## 0.0.0-canary-20221109063910

### Patch Changes

- chore: node engine version bump & cleaned up package.json files

## 0.0.0-canary-20221109062830

### Patch Changes

- refactor: reorganized internal packages for better bundling (does not affect external usage)

## 0.0.0-canary-20221109054532

### Patch Changes

- canary version bump

## 0.0.0-canary-20221109053356

### Patch Changes

- refactor: separate /api "subpackage" to avoid causing bundler issues

## 0.0.0-canary-20221108091630

### Patch Changes

- 2bb228b: refactor: renamed internal "getProps" to "getPropsType" in generated files

## 2.0.2

### Patch Changes

- version bump

## 2.0.1

### Patch Changes

- version bump

## 2.0.0

### Patch Changes

- version bump

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0-canary.14 (2022-10-23)

# [2.0.0-next.5](https://github.com/Wave-Play/pilot/compare/@waveplay/pilot@2.0.0-next.4...@waveplay/pilot@2.0.0-next.5) (2022-10-23)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-next.4 (2022-10-23)

### Bug Fixes

- **ci:** removed explicit lerna version string ([5cec497](https://github.com/Wave-Play/pilot/commit/5cec4970782814295db8471ef7ca88df13404c85))

# 2.0.0-next.3 (2022-10-23)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-next.2 (2022-10-23)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-next.1 (2022-10-23)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-next.0 (2022-10-23)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.13 (2022-10-23)

### Features

- **pilot:** new autoLoad prop in PilotArea ([e60e04b](https://github.com/Wave-Play/pilot/commit/e60e04bd28ac37bfeafc64cd98d455fb03733bf4))

# 2.0.0-canary.12 (2022-10-22)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.11 (2022-10-22)

### Bug Fixes

- **i18n:** use proper NextApp type signature ([643ab84](https://github.com/Wave-Play/pilot/commit/643ab84dad297ade51e232d429ac7fb389df19db))

### BREAKING CHANGES

- **i18n:** appWithTranslation now uses `pageProps` rather than `props`, making it compatible only with \_app wrappers.

# 2.0.0-canary.10 (2022-10-21)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-next.0 (2022-10-21)

# 2.0.0-canary.9 (2022-10-21)

### Features

- **pilot:** now supports \_app wrapper ([34fe73c](https://github.com/Wave-Play/pilot/commit/34fe73cbc50f9bf158082a5a337837a112852eea))

# 2.0.0-canary.8 (2022-10-21)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.7 (2022-10-21)

### Bug Fixes

- **pkg:** transform jsx for mjs builds ([97be133](https://github.com/Wave-Play/pilot/commit/97be133f3524f8af9520bcf007042fba9623a028))

# 2.0.0-canary.6 (2022-10-21)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.5 (2022-10-21)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.4 (2022-10-20)

### Bug Fixes

- **cli:** warn instead of crashing when missing locales directory ([a135c0b](https://github.com/Wave-Play/pilot/commit/a135c0bffdd27a0f534678bdc4b82c3e19fc5273))

# 2.0.0-canary.3 (2022-10-20)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.2 (2022-10-20)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-canary.1 (2022-10-20)

**Note:** Version bump only for package @waveplay/pilot

# [2.0.0-canary.0](https://github.com/Wave-Play/pilot/compare/@waveplay/pilot@2.0.0-beta.7...@waveplay/pilot@2.0.0-canary.0) (2022-10-20)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-beta.7 (2022-10-19)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-beta.6 (2022-10-19)

**Note:** Version bump only for package @waveplay/pilot

# 2.0.0-beta.5 (2022-10-19)

### Bug Fixes

- **ci:** removed from-git publish option ([2959e69](https://github.com/Wave-Play/pilot/commit/2959e69352fea68db31a7e03ec6168d4820700e3))

# 2.0.0-beta.4 (2022-10-19)

**Note:** Version bump only for package @waveplay/pilot
