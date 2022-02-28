import * as WebFetch from "./fetch.js"

export { ReadableStream, Blob, FormData  } from './package.js';
// Electron-renderer should get the browser implementation instead of node
// Browser configuration is not enough

// Marking export as a DOM File object instead of custom class.
export const fetch = /** @type {typeof globalThis.fetch} */
  (typeof globalThis.fetch === "function" ? globalThis.fetch : WebFetch.fetch)

export const Headers = globalThis.Headers || WebFetch.Headers
export const Request = globalThis.Request || WebFetch.Request
export const Response = global.Response || WebFetch.Response

export default fetch
