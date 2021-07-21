// @ts-check
"use strict"

import { Blob } from "./package.js"
import { WebFile } from "./file.js"

// Electron-renderer has `XMLHttpRequest` and should get the browser implementation
// instead of node.

// Marking export as a DOM File object instead of custom class.
/** @type {typeof globalThis.File} */
const File = typeof XMLHttpRequest === 'function' ? globalThis.File : WebFile

export { File, Blob }
