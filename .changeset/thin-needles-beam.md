---
'@waveplay/pilot': major
---

refactor: export only core modules from root. BREAKING CHANGE: You may need to update your code if you were importing `<PilotArea>` or another UI component from the root `@waveplay/pilot` module. Use `@waveplay/pilot/ui` instead.
