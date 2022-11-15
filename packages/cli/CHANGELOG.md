# Change Log

## 0.0.0-canary-20221115175258

### Minor Changes

- 0dd8519: feat: dev command now prepares Pilot.js instance "dev" fields
- 0dd8519: feat: new experimental "dev" command
- 1a0fdec: feat: "dev" command will now auto detect package manager & allow custom commands

### Patch Changes

- Updated dependencies [efc6818]
- Updated dependencies [0dd8519]
- Updated dependencies [1a0fdec]
  - @waveplay/pilot@0.0.0-canary-20221115175258

## 2.2.0

### Minor Changes

- 91ef4e7: feat: exclude and/or include pages using config

### Patch Changes

- 0098f10: refactor: new Config type for pilot.config.js typing
- d074472: fix: read from next.config.js even when pilot.config.js was not found
- Updated dependencies [f1295cb]
- Updated dependencies [0098f10]
- Updated dependencies [ed4416f]
- Updated dependencies [dc327fd]
- Updated dependencies [b5dc3b1]
- Updated dependencies [f32f118]
  - @waveplay/pilot@2.2.0

## 2.1.0

### Minor Changes

- 778ce99: feat: CLI now also reads next.config.js for i18n config

  feat: auto remove cache during builds

  chore: node engine version bump & cleaned up package.json

  feat: pilot.config.js can now be used to provide a default runtime config

  refactor: renamed internal "getProps" to "getPropsType" in generated files

  fix: exclude api routes from generated pages

### Patch Changes

- Updated dependencies [778ce99]
  - @waveplay/pilot@2.1.0

## 0.0.0-canary-20221111071730

### Patch Changes

- 3b647a2: fix: prevent missing config files from stopping build

## 0.0.0-canary-20221111070614

### Minor Changes

- d00ad75: feat: CLI now also reads next.config.js for i18n config

### Patch Changes

- Updated dependencies [8fc6ea6]
  - @waveplay/pilot@0.0.0-canary-20221111070614

## 0.0.0-canary-20221111063657

### Minor Changes

- feat: auto remove cache during builds

## 0.0.0-canary-20221109063910

### Patch Changes

- chore: node engine version bump & cleaned up package.json files
- Updated dependencies
  - @waveplay/pilot@0.0.0-canary-20221109063910

## 0.0.0-canary-20221109062830

### Patch Changes

- Updated dependencies
  - @waveplay/pilot@0.0.0-canary-20221109062830

## 0.0.0-canary-20221109054532

### Patch Changes

- canary version bump
- Updated dependencies
  - @waveplay/pilot@0.0.0-canary-20221109054532

## 0.0.0-canary-20221109053356

### Patch Changes

- Updated dependencies
  - @waveplay/pilot@0.0.0-canary-20221109053356

## 0.0.0-canary-20221108091630

### Minor Changes

- c7182c2: feat: pilot.config.js can now be used to provide a default runtime config

### Patch Changes

- 2bb228b: refactor: renamed internal "getProps" to "getPropsType" in generated files
- c7182c2: fix: exclude api routes from generated pages
- Updated dependencies [2bb228b]
  - @waveplay/pilot@0.0.0-canary-20221108091630

## 2.0.2

### Patch Changes

- version bump
- Updated dependencies
  - @waveplay/pilot@2.0.2

## 2.0.1

### Patch Changes

- version bump
- Updated dependencies
  - @waveplay/pilot@2.0.1

## 2.0.0

### Patch Changes

- version bump
- Updated dependencies
  - @waveplay/pilot@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0-canary.14 (2022-10-23)

# [2.0.0-next.5](https://github.com/Wave-Play/pilot/compare/pilotjs-cli@2.0.0-next.4...pilotjs-cli@2.0.0-next.5) (2022-10-23)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-next.4 (2022-10-23)

### Bug Fixes

- **ci:** removed explicit lerna version string ([5cec497](https://github.com/Wave-Play/pilot/commit/5cec4970782814295db8471ef7ca88df13404c85))

# 2.0.0-next.3 (2022-10-23)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-next.2 (2022-10-23)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-next.1 (2022-10-23)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-next.0 (2022-10-23)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.13 (2022-10-23)

### Features

- **pilot:** new autoLoad prop in PilotArea ([e60e04b](https://github.com/Wave-Play/pilot/commit/e60e04bd28ac37bfeafc64cd98d455fb03733bf4))

# 2.0.0-canary.12 (2022-10-22)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.11 (2022-10-22)

### Bug Fixes

- **i18n:** use proper NextApp type signature ([643ab84](https://github.com/Wave-Play/pilot/commit/643ab84dad297ade51e232d429ac7fb389df19db))

### BREAKING CHANGES

- **i18n:** appWithTranslation now uses `pageProps` rather than `props`, making it compatible only with \_app wrappers.

# 2.0.0-canary.10 (2022-10-21)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-next.0 (2022-10-21)

# 2.0.0-canary.9 (2022-10-21)

### Features

- **pilot:** now supports \_app wrapper ([34fe73c](https://github.com/Wave-Play/pilot/commit/34fe73cbc50f9bf158082a5a337837a112852eea))

# 2.0.0-canary.8 (2022-10-21)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.7 (2022-10-21)

### Bug Fixes

- **pkg:** transform jsx for mjs builds ([97be133](https://github.com/Wave-Play/pilot/commit/97be133f3524f8af9520bcf007042fba9623a028))

# 2.0.0-canary.6 (2022-10-21)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.5 (2022-10-21)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.4 (2022-10-20)

### Bug Fixes

- **cli:** warn instead of crashing when missing locales directory ([a135c0b](https://github.com/Wave-Play/pilot/commit/a135c0bffdd27a0f534678bdc4b82c3e19fc5273))

# 2.0.0-canary.3 (2022-10-20)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.2 (2022-10-20)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-canary.1 (2022-10-20)

**Note:** Version bump only for package pilotjs-cli

# [2.0.0-canary.0](https://github.com/Wave-Play/pilot/compare/pilotjs-cli@2.0.0-beta.6...pilotjs-cli@2.0.0-canary.0) (2022-10-20)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-beta.6 (2022-10-19)

**Note:** Version bump only for package pilotjs-cli

# 2.0.0-beta.5 (2022-10-19)

### Bug Fixes

- **ci:** removed from-git publish option ([2959e69](https://github.com/Wave-Play/pilot/commit/2959e69352fea68db31a7e03ec6168d4820700e3))

# 2.0.0-beta.4 (2022-10-19)

### Bug Fixes

- **koder:** throw now allows string interpolation ([5083554](https://github.com/Wave-Play/pilot/commit/5083554e88b474295ccf03e7745ab2ed98abfcf7))

### Features

- **cli:** new general build command ([ff694a4](https://github.com/Wave-Play/pilot/commit/ff694a4043f21c26a836aa68ee37f0661f3baf9e))
