import { FormData } from "@web-std/form-data"
import * as lib from "@web-std/form-data"
import { File, Blob } from "@web-std/file"
import { assert } from "./test.js"

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("slow down", async () => {
    await new Promise(resolve => setTimeout(resolve))
    assert.ok(true, "run now")
  })

  test("test baisc", async () => {
    assert.equal(typeof FormData, "function")
    assert.isEqual(typeof lib.FormData, "function")
  })

  if (globalThis.window === globalThis) {
    test("exports built-ins", () => {
      assert.equal(lib.FormData, globalThis.FormData)
    })
  }

  // @see https://github.com/jsdom/jsdom/blob/5279cfda5fe4d52f04b2eb6a801c98d81f9b55da/test/web-platform-tests/to-upstream/XMLHttpRequest/formdata-set-blob.HTMLFormElement
  test("blob without type", () => {
    const formData = new FormData()
    formData.set("blob-1", new Blob())
    const blob1 = /** @type {File} */ (formData.get("blob-1"))
    assert.equal(blob1.constructor.name, "File")
    assert.equal(blob1.name, "blob")
    assert.equal(blob1.type, "")
    assert.isLessThan(
      Math.abs(blob1.lastModified - Date.now()),
      200,
      "lastModified should be now"
    )
  })

  test("blob with type", () => {
    const formData = new FormData()
    formData.set("blob-2", new Blob([], { type: "text/plain" }))
    const blob2 = /** @type {File} */ (formData.get("blob-2"))
    assert.equal(blob2.constructor.name, "File")
    assert.equal(blob2.name, "blob")
    assert.equal(blob2.type, "text/plain")
    assert.isLessThan(
      Math.abs(blob2.lastModified - Date.now()),
      200,
      "lastModified should be now"
    )
  })

  test("blob with custom name", () => {
    const formData = new FormData()
    formData.set("blob-3", new Blob(), "custom name")
    const blob3 = /** @type {File} */ (formData.get("blob-3"))
    assert.equal(blob3.constructor.name, "File")
    assert.equal(blob3.name, "custom name")
    assert.equal(blob3.type, "")
    assert.isLessThan(
      Math.abs(blob3.lastModified - Date.now()),
      200,
      "lastModified should be now"
    )
  })

  test("file without lastModified or custom name", () => {
    const formData = new FormData()
    formData.set("file-1", new File([], "name"))
    const file1 = /** @type {File} */ (formData.get("file-1"))
    assert.equal(file1.constructor.name, "File")
    assert.equal(file1.name, "name")
    assert.equal(file1.type, "")
    assert.isLessThan(
      Math.abs(file1.lastModified - Date.now()),
      200,
      "lastModified should be now"
    )
  })

  test("file with lastModified and custom name", () => {
    const formData = new FormData()
    formData.set(
      "file-2",
      new File([], "name", { lastModified: 123 }),
      "custom name"
    )
    const file2 = /** @type {File} */ (formData.get("file-2"))
    assert.equal(file2.constructor.name, "File")
    assert.equal(file2.name, "custom name")
    assert.equal(file2.type, "")
    assert.equal(file2.lastModified, 123, "lastModified should be 123")
  })

  test("throws on few args", () => {
    const data = new FormData()
    // @ts-expect-error
    assert.throws(() => data.append("key"))
    // @ts-expect-error
    assert.throws(() => data.set("key"))
    // @ts-expect-error
    assert.throws(() => data.get())
    // @ts-expect-error
    assert.throws(() => data.getAll())
    // @ts-expect-error
    assert.throws(() => data.delete())
  })

  test("only value", () => {
    const data = new FormData()
    data.set("key", "value1")
    assert.equal(data.get("key"), "value1")
  })

  test("second value", () => {
    const data = new FormData()
    data.set("key", "value1")
    data.append("key", "value2")
    assert.equal(data.get("key"), "value1")
  })

  test("null value", () => {
    const data = new FormData()
    // @ts-expect-error
    data.set("key", null)
    assert.equal(data.get("key"), "null")
  })

  test("has", () => {
    var data = new FormData()
    data.append("n1", "value")
    assert.equal(data.has("n1"), true)
    assert.equal(data.has("n2"), false)
    data.append("n2", "value")
    assert.equal(data.has("n1"), true)
    assert.equal(data.has("n2"), true)
    data.append("n3", new Blob(["content"]))
    assert.equal(data.has("n3"), true)
  })

  test("should return the keys/values/entres as they are appended", () => {
    const data = new FormData()
    data.append("keyA", "val1")
    data.append("keyA", "val2")
    data.append("keyB", "val3")
    data.append("keyA", "val4")

    assert.deepEqual([...data.keys()], ["keyA", "keyA", "keyB", "keyA"])
    assert.deepEqual([...data.values()], ["val1", "val2", "val3", "val4"])
    assert.deepEqual(
      [...data],
      [
        ["keyA", "val1"],
        ["keyA", "val2"],
        ["keyB", "val3"],
        ["keyA", "val4"],
      ]
    )
  })

  test("overwrite first matching key", () => {
    const data = new FormData()
    data.append("keyA", "val1")
    data.append("keyA", "val2")
    data.append("keyB", "val3")
    data.append("keyA", "val4")

    data.set("keyA", "val3")
    assert.deepEqual(
      [...data],
      [
        ["keyA", "val3"],
        ["keyB", "val3"],
      ]
    )
  })

  test("appends value when no matching", () => {
    const data = new FormData()
    data.append("keyB", "val3")
    data.set("keyA", "val3")

    assert.deepEqual(
      [...data],
      [
        ["keyB", "val3"],
        ["keyA", "val3"],
      ]
    )
  })

  test("FormData.delete()", () => {
    var data = new FormData()
    data.append("name", "value")
    assert.equal(data.has("name"), true)
    data.delete("name")
    assert.equal(data.has("name"), false)

    data.append("name", new Blob(["content"]))
    assert.equal(data.has("name"), true)
    data.delete("name")
    assert.equal(data.has("name"), false)

    data.append("n1", "v1")
    data.append("n2", "v2")
    data.append("n1", "v3")
    data.delete("n1")
    assert.equal(data.has("n1"), false)

    assert.deepEqual([...data], [["n2", "v2"]])
  })

  test("Shold return correct filename with File", () => {
    const data = new FormData()
    data.set("key", new File([], "doc.txt"))
    const file = /** @type {File} */ (data.get("key"))
    assert.equal("doc.txt", file.name)
  })

  test("Shold return correct filename with Blob filename", () => {
    const data = new FormData()
    data.append("key", new Blob(), "doc.txt")
    const file = /** @type {File} */ (data.get("key"))
    assert.equal("doc.txt", file.name)
  })

  test("Shold return correct filename with just Blob", () => {
    const data = new FormData()
    data.append("key", new Blob())
    const file = /** @type {File} */ (data.get("key"))
    assert.equal("blob", file.name)
  })

  test.skip("complicated form", () => {
    const data = new FormData()
    data.append("blobs", new Blob(["basic"]))
    data.append("blobs", new Blob(["with-type"], { type: "text/plain" }))
    data.append(
      "blobs",
      new Blob(["with-name"], { type: "text/markdown" }),
      "file.md"
    )
    data.append("files", new File(["basic"], "basic"))
    data.append(
      "files",
      new File(["with-type"], "file.txt", { type: "text/plain" })
    )
    data.append(
      "files",
      new File(["renamed"], "orig.txt", { type: "text/plain" }),
      "rename.md"
    )
  })
}
