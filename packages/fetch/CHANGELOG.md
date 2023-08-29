# Changelog

### [4.2.1](https://www.github.com/web-std/io/compare/fetch-v4.2.0...fetch-v4.2.1) (2023-08-29)


### Bug Fixes

* **fetch:** fix memory leak when passing `keepAlive` ([#83](https://www.github.com/web-std/io/issues/83)) ([5fde362](https://www.github.com/web-std/io/commit/5fde362a9648de474c52006cf94d9dedba12b480))
* **fetch:** import `Buffer` from `'buffer'` ([#90](https://www.github.com/web-std/io/issues/90)) ([29d8936](https://www.github.com/web-std/io/commit/29d8936fb489cee1fa132167da69bee8202bace8))

## [4.2.0](https://www.github.com/web-std/io/compare/fetch-v4.1.2...fetch-v4.2.0) (2023-08-28)


### Features

* **fetch:** backport `node-fetch`'s redirect bugfix ([#77](https://www.github.com/web-std/io/issues/77)) ([86262a6](https://www.github.com/web-std/io/commit/86262a627927aa0d480e0739db2dea83a6e551be))
* **fetch:** support custom `credentials` in `Request` ([#82](https://www.github.com/web-std/io/issues/82)) ([1da95bc](https://www.github.com/web-std/io/commit/1da95bce5d65332590b8959bdfadd0c53d30e399))


### Bug Fixes

* **fetch:** `signal` should not be nullable ([#81](https://www.github.com/web-std/io/issues/81)) ([dff75d9](https://www.github.com/web-std/io/commit/dff75d9d0ad3e9281cd41faeb415cf94e0d57a33))
* **fetch:** add HTTPS Agent types to `fetch` & `Request` ([#78](https://www.github.com/web-std/io/issues/78)) ([c4980f4](https://www.github.com/web-std/io/commit/c4980f4da0dcb8e42be80abd8f42d5fb9cf4d1f5))
* **fetch:** align `Request` with spec ([#85](https://www.github.com/web-std/io/issues/85)) ([ace4223](https://www.github.com/web-std/io/commit/ace42236598da26dbaa59bb593e7572c80c17289))
* **fetch:** allow clone of `Request` & `Response` with `null` body ([#79](https://www.github.com/web-std/io/issues/79)) ([f1d9272](https://www.github.com/web-std/io/commit/f1d9272f394f50942fb46162c0a4009eb0c2ddd4))
* **fetch:** empty filename should not be treated as string ([#87](https://www.github.com/web-std/io/issues/87)) ([389c2b8](https://www.github.com/web-std/io/commit/389c2b84ad4a5ba91c7a91b48508412a24113712))
* **fetch:** fix `headers.entries`/`values`/`forEach` iteration for `Set-Cookie` headers ([#89](https://www.github.com/web-std/io/issues/89)) ([3c20536](https://www.github.com/web-std/io/commit/3c20536d628e6c5e592d7d9760d7008ab6bbb7b0))
* **fetch:** fix ESM types ([#75](https://www.github.com/web-std/io/issues/75)) ([c97e2b8](https://www.github.com/web-std/io/commit/c97e2b8eb470d5180e4d66bd80c936a67a751429))
* **fetch:** fix issue with cloning bodies ([#72](https://www.github.com/web-std/io/issues/72)) ([e156a6e](https://www.github.com/web-std/io/commit/e156a6e428eafb400e2b0220864a0ec5d2ae7732))
* formdata util missing file ([#68](https://www.github.com/web-std/io/issues/68)) ([ce9cd2a](https://www.github.com/web-std/io/commit/ce9cd2a901366f59463e7be5cef9e56cd413e3e9))
* proper exports to allow TS to recognize class types and proper casting ([#71](https://www.github.com/web-std/io/issues/71)) ([9e95faf](https://www.github.com/web-std/io/commit/9e95faf2a7373434e733d54605ab1779f1eed0ab))
* typo in README ([#80](https://www.github.com/web-std/io/issues/80)) ([08b270f](https://www.github.com/web-std/io/commit/08b270f27df5470a88b279088b2b8079b120298e))


### Changes

* promote `types` conditional exports to the top of the list ([#88](https://www.github.com/web-std/io/issues/88)) ([c1339b9](https://www.github.com/web-std/io/commit/c1339b9bef4312e5efd4c5fe627b92e6c1d5c3d1))

### [4.1.2](https://www.github.com/web-std/io/compare/fetch-v4.1.1...fetch-v4.1.2) (2023-07-19)


### Bug Fixes

* bind globalThis in nodejs also ([#69](https://www.github.com/web-std/io/issues/69)) ([fd32fa2](https://www.github.com/web-std/io/commit/fd32fa22faffa7f3f16b603ca7d662e082f1eee6))

### [4.1.1](https://www.github.com/web-std/io/compare/fetch-v4.1.0...fetch-v4.1.1) (2023-07-19)


### Bug Fixes

* fetch called on non Window object ([#65](https://www.github.com/web-std/io/issues/65)) ([2af758f](https://www.github.com/web-std/io/commit/2af758fbae555494c6cf1ba40e053b164306ee16))

## [4.1.0](https://www.github.com/web-std/io/compare/fetch-v4.0.1...fetch-v4.1.0) (2022-04-20)


### Features

* add support for application/x-www-form-urlencoded in request.formData() ([#60](https://www.github.com/web-std/io/issues/60)) ([c719b0d](https://www.github.com/web-std/io/commit/c719b0de442811eb588309b777ab6ab3d966cdf1))

### [4.0.1](https://www.github.com/web-std/io/compare/fetch-v4.0.0...fetch-v4.0.1) (2022-04-13)


### Bug Fixes

* **packages/fetch:** only export what's needed so TS doesn't mess up the imports in the output files ([30ad037](https://www.github.com/web-std/io/commit/30ad0377a88ebffc3a998616e3b774ce5bcc584a))
* **packages/stream:** no initializers in ambient contexts ([30ad037](https://www.github.com/web-std/io/commit/30ad0377a88ebffc3a998616e3b774ce5bcc584a))
* typescript types ([#56](https://www.github.com/web-std/io/issues/56)) ([30ad037](https://www.github.com/web-std/io/commit/30ad0377a88ebffc3a998616e3b774ce5bcc584a))

## [4.0.0](https://www.github.com/web-std/io/compare/fetch-v3.0.3...fetch-v4.0.0) (2022-02-28)


### ⚠ BREAKING CHANGES

* export native fetch on the web (#53)

### Features

* export native fetch on the web ([#53](https://www.github.com/web-std/io/issues/53)) ([af03280](https://www.github.com/web-std/io/commit/af03280788286cd69185efb0572da162f16d48cc))
* implement file: protocol support for fetch ([#55](https://www.github.com/web-std/io/issues/55)) ([19d17c7](https://www.github.com/web-std/io/commit/19d17c76f995800c9e07d5d6a923f33b81ab1d22))

### [3.0.3](https://www.github.com/web-std/io/compare/fetch-v3.0.2...fetch-v3.0.3) (2022-01-28)


### Bug Fixes

* include dist/index.cjs in files ([#47](https://www.github.com/web-std/io/issues/47)) ([2a12474](https://www.github.com/web-std/io/commit/2a1247404650bf5b6662fa520248bf07ae457987))

### [3.0.2](https://www.github.com/web-std/io/compare/fetch-v3.0.1...fetch-v3.0.2) (2022-01-21)


### Changes

* bump fetch versions ([e8ae4e5](https://www.github.com/web-std/io/commit/e8ae4e5e61591f1bcbd45a0541c762468e134e4b))

### [3.0.1](https://www.github.com/web-std/io/compare/fetch-v3.0.0...fetch-v3.0.1) (2022-01-19)


### Bug Fixes

* ship less files to address TSC issues ([#35](https://www.github.com/web-std/io/issues/35)) ([0651e62](https://www.github.com/web-std/io/commit/0651e62ae42d17eae2db89858c9e44f3342c304c))

## 3.0.0 (2021-11-08)


### Features

* revamp the repo ([#19](https://www.github.com/web-std/io/issues/19)) ([90624cf](https://www.github.com/web-std/io/commit/90624cfd2d4253c2cbc316d092f26e77b5169f47))


### Changes

* align package versions ([09c8676](https://www.github.com/web-std/io/commit/09c8676348619313d9df24d9597cea0eb82704d2))
* bump versions ([#27](https://www.github.com/web-std/io/issues/27)) ([0fe5224](https://www.github.com/web-std/io/commit/0fe5224124e318f560dcfbd8a234d05367c9fbcb))
