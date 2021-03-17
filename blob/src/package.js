import { TextEncoder, TextDecoder } from "web-encoding"
import streams from "web-streams-polyfill"

const { ReadableStream: ReadableStreamPolyfill } = streams
/** @type {typeof globalThis.ReadableStream} */
// @ts-ignore
export const ReadableStream = ReadableStreamPolyfill

export { TextEncoder, TextDecoder }
