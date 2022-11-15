# Change Log

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
