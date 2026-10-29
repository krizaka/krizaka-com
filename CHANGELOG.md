# Changelog

## [0.10.0](https://github.com/krizaka/krizaka-com/compare/v0.9.0...v0.10.0) (2026-10-29)


### Features

* **home:** the hero plays « La famille Krizaka »; « le relais » leaves every slot; @krizaka/{tokens,tailwind} 3.74 and charts 0.8 (no departed palettes) ([#473](https://github.com/krizaka/krizaka-com/issues/473)) ([85763df](https://github.com/krizaka/krizaka-com/commit/85763dfeed6d65ac3ea0a73ae5ffd15bc85d930c))
* **story:** « The Krizaka family » film and the Orazaka take replace the old media ([#472](https://github.com/krizaka/krizaka-com/issues/472)) ([b924bce](https://github.com/krizaka/krizaka-com/commit/b924bce0bff1ddccff64ced1a7e9391be1cb126f))

## [0.9.0](https://github.com/krizaka/krizaka-com/compare/v0.8.0...v0.9.0) (2026-10-29)


### Features

* **a11y:** axe-core WCAG 2.1 AA guard on every sitemap page, ratcheted ([#431](https://github.com/krizaka/krizaka-com/issues/431)) ([941f1eb](https://github.com/krizaka/krizaka-com/commit/941f1ebd6019afe9aaeedfc111102eaa08d0a418))
* **bunny:** ADR-014 target layout — audit, migrate, bunny-tree ([#452](https://github.com/krizaka/krizaka-com/issues/452)) ([68b8373](https://github.com/krizaka/krizaka-com/commit/68b83733e89d8eaab5de0c4c1b18522a66352f13))
* **bunny:** layout v2 — org, then sites, then apps; new writes outside v2 fail; unused objects purged ([#453](https://github.com/krizaka/krizaka-com/issues/453)) ([12f46fc](https://github.com/krizaka/krizaka-com/commit/12f46fc09a32aa2facb32c816b26ea4551ff719e))
* **cdn:** defaults/ prefix in the Bunny layout, and the default-media rule (krizaka-ts[#134](https://github.com/krizaka/krizaka-com/issues/134)) ([#423](https://github.com/krizaka/krizaka-com/issues/423)) ([f044deb](https://github.com/krizaka/krizaka-com/commit/f044debcf4710c4a64a7d9acb695437f04a8f30a))
* **cdn:** purge by URL right after publishing a file that changes in place (README.txt), MEDIA_ACCOUNT_API_KEY ([#429](https://github.com/krizaka/krizaka-com/issues/429)) ([dcfa8e9](https://github.com/krizaka/krizaka-com/commit/dcfa8e9cfa971ec08184e6da2caabbe137597d85))
* **contact:** verify the address first, a 6-digit code, 15 min, single use ([#464](https://github.com/krizaka/krizaka-com/issues/464)) ([#466](https://github.com/krizaka/krizaka-com/issues/466)) ([c44bc9b](https://github.com/krizaka/krizaka-com/commit/c44bc9bd988654346d211754b21b2ebf39442ac5))
* **home:** what we know how to do and where we are going ([#459](https://github.com/krizaka/krizaka-com/issues/459)) ([2513258](https://github.com/krizaka/krizaka-com/commit/25132588579b3c1ee3cdaf8b62325b1c78ee49ad))
* **open-source:** the CI and deploy standard's intro, and a card per org standard, read from krizaka/.github at build ([#445](https://github.com/krizaka/krizaka-com/issues/445)) ([c857bd2](https://github.com/krizaka/krizaka-com/commit/c857bd20f4325841291c4230af062d77fa3733bd))


### Bug Fixes

* **contact:** production refuses (503) while the Turnstile check is not configured ([#464](https://github.com/krizaka/krizaka-com/issues/464)) ([#465](https://github.com/krizaka/krizaka-com/issues/465)) ([d5fc858](https://github.com/krizaka/krizaka-com/commit/d5fc85845298bab150fb22238cb7137a22ac21a4))
* **home:** product cards link www, « See the site » — dev is exposed as www ([#427](https://github.com/krizaka/krizaka-com/issues/427)) ([b18c1ed](https://github.com/krizaka/krizaka-com/commit/b18c1edbc78d35d10ca71edf8a93c010af5c9582))

## [0.8.0](https://github.com/krizaka/krizaka-com/compare/v0.7.0...v0.8.0) (2026-10-27)


### Features

* **home:** products refreshed — real-app visuals, dev site and build-read version, pinned tags; libraries move to /open-source, which lists only open source ([#425](https://github.com/krizaka/krizaka-com/issues/425)) ([0194187](https://github.com/krizaka/krizaka-com/commit/019418771aeb9a14b1342f845111950642436bbb))

## [0.7.0](https://github.com/krizaka/krizaka-com/compare/v0.6.1...v0.7.0) (2026-10-26)


### Features

* **story:** chapters alternate sides, text rewritten from the blog, paused products out ([#418](https://github.com/krizaka/krizaka-com/issues/418)) ([9bce999](https://github.com/krizaka/krizaka-com/commit/9bce99930d9090691053b14a7ddb7817514f0006))

## [0.6.1](https://github.com/krizaka/krizaka-com/compare/v0.6.0...v0.6.1) (2026-10-26)


### Bug Fixes

* **security:** Next.js 16.4.3 — patches the critical RCE (GHSA-2464-fhr4-w9xw) in the production image ([#415](https://github.com/krizaka/krizaka-com/issues/415)) ([d6335a7](https://github.com/krizaka/krizaka-com/commit/d6335a74373d5114a36373a63df6e578c193c56a)), closes [#414](https://github.com/krizaka/krizaka-com/issues/414)

## [0.6.0](https://github.com/krizaka/krizaka-com/compare/v0.5.0...v0.6.0) (2026-10-26)


### Features

* **redirects:** /docs/yomizaka/* lands on Yomizaka's own /docs (yomizaka[#387](https://github.com/krizaka/krizaka-com/issues/387)) ([#411](https://github.com/krizaka/krizaka-com/issues/411)) ([7623ff6](https://github.com/krizaka/krizaka-com/commit/7623ff6c251509d6bdb30ccc8ad44279f10d532b))

## [0.5.0](https://github.com/krizaka/krizaka-com/compare/v0.4.2...v0.5.0) (2026-10-26)


### Features

* **home:** the stack as one row per publication, Motion calm at motion.krizaka.com ([#410](https://github.com/krizaka/krizaka-com/issues/410)) ([a62e27b](https://github.com/krizaka/krizaka-com/commit/a62e27bc6ed67ecdb89deb689de5094e2a00fc3c))


### Bug Fixes

* **security:** Sonar vulnerabilities (workflows, taint, PATH) ([#408](https://github.com/krizaka/krizaka-com/issues/408)) ([d7cf065](https://github.com/krizaka/krizaka-com/commit/d7cf06580791f04054f7c2c978b206e8c7bf2f3a))

## [0.4.2](https://github.com/krizaka/krizaka-com/compare/v0.4.1...v0.4.2) (2026-10-26)


### Bug Fixes

* **cdn:** alex-back, the last clip the published @krizaka/ui examples reach ([#406](https://github.com/krizaka/krizaka-com/issues/406)) ([ff274da](https://github.com/krizaka/krizaka-com/commit/ff274da3b4f7e9d40aa2c5f36042e997e9a73f44))

## [0.4.1](https://github.com/krizaka/krizaka-com/compare/v0.4.0...v0.4.1) (2026-10-26)


### Bug Fixes

* **cdn:** keep every clip the published @krizaka/ui examples reach through /assets/orochia/tour (404 since [#399](https://github.com/krizaka/krizaka-com/issues/399)) ([#402](https://github.com/krizaka/krizaka-com/issues/402)) ([364407e](https://github.com/krizaka/krizaka-com/commit/364407e98fa7980b64de00349b94e6aced586193))

## [0.4.0](https://github.com/krizaka/krizaka-com/compare/v0.3.0...v0.4.0) (2026-10-26)


### Features

* **products:** krizaka.com presents Orazaka, Yomizaka and Akinaza; Orochia, Kachizaka, Yasakia and Yororis are paused ([#399](https://github.com/krizaka/krizaka-com/issues/399)) ([f619ed9](https://github.com/krizaka/krizaka-com/commit/f619ed994fd70e4c64df6e59c907d6cab9f5e341))

## [0.3.0](https://github.com/krizaka/krizaka-com/compare/v0.2.0...v0.3.0) (2026-10-25)


### Features

* **open-source:** add "La nomenclature", a generated reference map of the Krizaka system ([#378](https://github.com/krizaka/krizaka-com/issues/378)) ([e6cae8b](https://github.com/krizaka/krizaka-com/commit/e6cae8b681f63ccd77e3600c4fff4affc571bd45))


### Bug Fixes

* **seo:** claim no Law 25 / GDPR / PIPEDA conformity in llms-full.txt and the Organization ([#397](https://github.com/krizaka/krizaka-com/issues/397)) ([f7010c7](https://github.com/krizaka/krizaka-com/commit/f7010c7ac6290b89547f0677206b79b992318f9f))

## [0.2.0](https://github.com/krizaka/krizaka-com/compare/v0.1.0...v0.2.0) (2026-10-25)


### Features

* **release:** the release train — release-please, production deploys on release, the footer shows krizaka.com's version only ([#390](https://github.com/krizaka/krizaka-com/issues/390)) ([6684603](https://github.com/krizaka/krizaka-com/commit/66846036e822ef705266f574680e80ca24aa3b3d))
