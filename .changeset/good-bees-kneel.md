---
'@waveplay/pilot': major
---

feat: decoupled native runtime cache (**BREAKING**)
feat: tunnel-less dev environment
refactor: decoupled locales from build and removed build:pages command
refactor: export only core modules from root. **BREAKING CHANGE:** You may need to update your code if you were importing <PilotArea> or another UI component from the root @waveplay/pilot module. Use @waveplay/pilot/ui instead.
b30c295: refactor: removed regex router. This was never used after replacing with RadixRouter. Use RadixRouter instead or provide your own regex router.
