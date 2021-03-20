# @web-std/node-fetch

[![ci][ci.icon]][ci.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]

Web API compatible [fetch API][] for nodejs.

## Comparison to Alternatives

#### [node-fetch][]

The reason this fork exists is because [node-fetch][] chooses to compromise
Web API compatibility and by useing nodejs native [Readable][] stream. They way
they put it is:

>
> - Make conscious trade-off when following [WHATWG fetch spec][whatwg-fetch] and [stream spec](https://streams.spec.whatwg.org/) implementation details, document known differences.
> - Use native Node streams for body, on both request and response.
>

We found these incompatibility to be really problematic when sharing code
across nodejs and browser rutimes. Insteadead of introducing such an
incompatibility this library exposes nodejs streams through `nodeStream`
property. This library introduces web compatibility by lazily wrapping
underlying node streams via [web-streams-polyfill][] on property access.


## License

[MIT](LICENSE.md)

[whatwg-fetch]: https://fetch.spec.whatwg.org/
[response-init]: https://fetch.spec.whatwg.org/#responseinit
[node-readable]: https://nodejs.org/api/stream.html#stream_readable_streams
[mdn-headers]: https://developer.mozilla.org/en-US/docs/Web/API/Headers
[error-handling.md]: https://github.com/node-fetch/node-fetch/blob/master/docs/ERROR-HANDLING.md

[ci.icon]: https://github.com/web-std/node-fetch/workflows/CI/badge.svg
[ci.url]: https://github.com/web-std/node-fetch/actions
[version.icon]: https://img.shields.io/npm/v/@web-std/node-fetch.svg
[downloads.icon]: https://img.shields.io/npm/dm/@web-std/node-fetch.svg
[package.url]: https://npmjs.org/package/@web-std/node-fetch
[downloads.image]: https://img.shields.io/npm/dm/@web-std/node-fetch.svg
[downloads.url]: https://npmjs.org/package/@web-std/node-fetch
[prettier.icon]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]: https://github.com/prettier/prettier
[blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
[fetch-blob]: https://github.com/node-fetch/fetch-blob
[readablestream]: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
[readable]: https://nodejs.org/api/stream.html#stream_readable_streams
[w3c blob.stream]: https://w3c.github.io/FileAPI/#dom-blob-stream
[web-streams-polyfill]:https://www.npmjs.com/package/web-streams-polyfill
[for await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
[buffer]: https://nodejs.org/api/buffer.html
[weakmap]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
[ts-jsdoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[Uint8Array]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[node-fetch]:https://github.com/node-fetch/
[fetch api]:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[readable]: https://nodejs.org/api/stream.html#stream_readable_streams
