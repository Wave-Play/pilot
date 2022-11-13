---
"@waveplay/pilot": minor
---

feat: props can now be loaded via Next.js API routes

feat: new `createHandler` export from `@waveplay/pilot/api` to create a Next.js API route handler

refactor: renamed internal "getProps" to "getPropsType" in generated files

refactor: reorganized internal packages for better bundling (does not affect external usage)

chore: node engine version bump & cleaned up package.json

feat: new webProps option to control how prop loading works
