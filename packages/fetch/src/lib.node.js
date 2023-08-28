import { fetch as webFetch, Headers as WebHeaders, Request as WebRequest, Response as WebResponse } from "./fetch.js"

export { ReadableStream, Blob, FormData, File  } from './package.js';
// Electron-renderer should get the browser implementation instead of node
// Browser configuration is not enough

// Marking export as a DOM File object instead of custom class.
export const fetch = /** @type {typeof globalThis.fetch} */
  (typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : webFetch)

export const Headers = globalThis.Headers || WebHeaders
export const Request = globalThis.Request || WebRequest
export const Response = globalThis.Response || WebResponse

export default fetch
