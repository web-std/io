import * as lib from "@web-std/file"
import { File } from "@web-std/file"
import { assert } from "./test.js"

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("test baisc", async () => {
    assert.isEqual(typeof lib.Blob, "function")
    assert.isEqual(typeof lib.File, "function")
  })

  if (globalThis.window === globalThis) {
    test("uses built-ins", async () => {
      assert.isEqual(lib.File, globalThis.File)
      assert.isEqual(lib.Blob, globalThis.Blob)
    })
  }

  test("new File", async () => {
    // @ts-expect-error
    assert.throws(() => new File(), TypeError)
    // @ts-expect-error
    assert.throws(() => new File([]), TypeError)

    const before = Date.now()
    await new Promise(resolve => setTimeout(resolve, 3))
    const file = new File(["test"], "name")
    await new Promise(resolve => setTimeout(resolve, 3))
    const after = Date.now()
    assert.equal(file.size, 4)
    assert.equal(file.name, "name")
    assert.equal(typeof file.lastModified, "number")
    assert.equal(file.lastModified > before, true)
    assert.equal(file.lastModified < after, true)
    assert.equal(file.type, "")

    const chunks = []
    const reader = file.stream().getReader()
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) {
        reader.releaseLock()
        break
      } else {
        chunks.push(chunk.value)
      }
    }

    assert.deepEqual(chunks, [new TextEncoder().encode("test")])
  })

  test("File with lastModified", async () => {
    const file = new File(["test"], "name", { lastModified: 1594672000418 })

    assert.equal(file.size, 4)
    assert.equal(file.name, "name")
    assert.equal(file.lastModified, 1594672000418)
    assert.equal(file.type, "")
  })

  test("File with type", async () => {
    const file = new File(["test"], "name", {
      lastModified: 1594672000418,
      type: "text/plain",
    })

    assert.equal(file.size, 4)
    assert.equal(file.name, "name")
    assert.equal(file.lastModified, 1594672000418)
    assert.equal(file.type, "text/plain")
  })

  test("File type is normalized", async () => {
    const file = new File(["test"], "name", {
      type: "Text/Plain",
    })

    assert.equal(file.size, 4)
    assert.equal(file.name, "name")
    assert.equal(file.type, "text/plain")
  })

  test("File name is (not) escaped", async () => {
    const file = new File(["test"], "dir/name")

    assert.equal(file.size, 4)
    // occording to spec it's former but in pratice it seems later 🤷‍♂️
    assert.equal(file.name === "dir:name" || file.name === "dir/name", true)
    assert.equal(file.type, "")
  })
}
