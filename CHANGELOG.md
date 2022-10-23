# [2.0.0-beta.3](https://github.com/Wave-Play/pilot/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2022-10-17)


### Bug Fixes

* **ci:** include devDependencies in release ([0c0d307](https://github.com/Wave-Play/pilot/commit/0c0d30714623b93d8d1e645543dc79f357ce65ab))



# [2.0.0-beta.2](https://github.com/Wave-Play/pilot/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2022-10-17)


### Bug Fixes

* **ci:** re-enabled semantic-release plugins ([9aba282](https://github.com/Wave-Play/pilot/commit/9aba2827ea325c08b39240c27eedc4b3102aca44))



# [2.0.0-beta.1](https://github.com/Wave-Play/pilot/compare/v1.1.1...v2.0.0-beta.1) (2022-10-17)


### Bug Fixes

* **ci:** build semantic-release in next, alpha, and beta branches ([a3cc669](https://github.com/Wave-Play/pilot/commit/a3cc669dd33fdb2a0d05e37d83e63c19ed6aece3))
* **ci:** defined all branches to run semantic-release on ([3c6d444](https://github.com/Wave-Play/pilot/commit/3c6d4446d4fc468b7e5772a5d674a81bf7e8f6d7))
* **ci:** drop "next" from release branches ([e336e7f](https://github.com/Wave-Play/pilot/commit/e336e7f7aa005c287c78a8fe28fbc4f5a00dcfae))
* **ci:** include beta and alpha branches in semantic-release ([70f2c30](https://github.com/Wave-Play/pilot/commit/70f2c3057b5375fd25cd927b11924e90cf42371e))
* **ci:** remove "release" from package.json ([0896aa7](https://github.com/Wave-Play/pilot/commit/0896aa73905c1d3abc4b7e86ba66b0fd8dffdfd7))
* **ci:** removed semantic-release/git options ([e0f3e26](https://github.com/Wave-Play/pilot/commit/e0f3e26126a805bbcf9e712c6482e951721ed2d5))
* **ci:** renamed main branch to master ([fb19542](https://github.com/Wave-Play/pilot/commit/fb195425ef8af88b030c8665f52bcf4dab3bdb5c))
* **ci:** temporarily removed semantic-release plugins ([23fbfd3](https://github.com/Wave-Play/pilot/commit/23fbfd3056ade6f8b5483f96f7dbbeead843620b))
* **ci:** use semantic-release/npm plugin ([37d55e0](https://github.com/Wave-Play/pilot/commit/37d55e0145865ffab5885bdd0a3cddc01d8450ca))


### Code Refactoring

* **api:** removed deprecated PilotArea props & refactored default ([3a4d0ac](https://github.com/Wave-Play/pilot/commit/3a4d0ac5ee723739d9530604a5f21edd1e2a5023))


### Features

* **api:** now possible to bring own logger ([66b12d2](https://github.com/Wave-Play/pilot/commit/66b12d2173dcf8a3f3d5b6f8e8ef55fd9e1766a2))
* **cli:** New CLI & build process ([f892fef](https://github.com/Wave-Play/pilot/commit/f892fef84617749707268d42e7c93a23ff519a7f))
* **link:** New Link component ([86c5939](https://github.com/Wave-Play/pilot/commit/86c593951959048c921367744ab1cf32c508c79b))
* push() alias ([4400422](https://github.com/Wave-Play/pilot/commit/4400422c8e69e43db40fa13a795048e6c1dbe6bd))


### BREAKING CHANGES

* **api:** `logLevel` config field was replaced by `logger`.
* **api:** Deprecated PilotArea props have been removed as well as `default` prop from PilotRoute. Use `defaultPath` prop in PilotArea instead.



## [1.1.1](https://github.com/Wave-Play/pilot/compare/v1.1.0...v1.1.1) (2022-10-14)


### Bug Fixes

* **api:** allow next/router to handle url object ([88bdf2d](https://github.com/Wave-Play/pilot/commit/88bdf2d6164807c23ad1f3f57b2507987c6a0ba6))
* **area:** use correct pilot instance for named areas ([f2ba1fa](https://github.com/Wave-Play/pilot/commit/f2ba1fa3f7dcad4eb0a0536c96581c8d2afd9a5d))



# [1.1.0](https://github.com/Wave-Play/pilot/compare/v1.0.2...v1.1.0) (2022-09-22)


### Features

* **pkg:** 1.1.0 release ([ca7dad9](https://github.com/Wave-Play/pilot/commit/ca7dad9ad69e49cb7de098dedd940c5d021566e7))



## [1.0.2](https://github.com/Wave-Play/pilot/compare/v1.0.1...v1.0.2) (2022-09-18)


### Bug Fixes

* **pkg:** Build before running semantic-release ([b818288](https://github.com/Wave-Play/pilot/commit/b8182886158b1d705485d00b333d6851b9f021fd))
* **pkg:** fixed published build issues ([f900fba](https://github.com/Wave-Play/pilot/commit/f900fba350d7e4a818b177e0feab147b3aec0f7b))



# [1.0.0](https://github.com/Wave-Play/pilot/compare/8eab9108081e2f2751a377e567e0033762d6d878...v1.0.0) (2022-09-15)


### Bug Fixes

* **pkg:** Semantic release ([179e1ab](https://github.com/Wave-Play/pilot/commit/179e1ab2c6641c629c67536182a4c25338991381))
* **pkg:** Semantic release ([8eab910](https://github.com/Wave-Play/pilot/commit/8eab9108081e2f2751a377e567e0033762d6d878))



