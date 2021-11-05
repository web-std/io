import { Blob, TextDecoder } from "@web-std/blob"
import * as lib from "@web-std/blob"
import { assert } from "./test.js"

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("test baisc", async () => {
    assert.isEqual(typeof lib.Blob, "function")
    assert.isEqual(typeof lib.TextDecoder, "function")
    assert.isEqual(typeof lib.TextEncoder, "function")
    assert.isEqual(typeof lib.ReadableStream, "function")
  })

  if (globalThis.window === globalThis) {
    test("exports built-ins", () => {
      assert.equal(lib.Blob, globalThis.Blob)
      assert.equal(lib.TextDecoder, globalThis.TextDecoder)
      assert.equal(lib.TextEncoder, globalThis.TextEncoder)
      assert.equal(lib.ReadableStream, globalThis.ReadableStream)
    })
  }

  test("test jsdom", async () => {
    const blob = new Blob(["TEST"])
    assert.isEqual(blob.size, 4, "Initial blob should have a size of 4")
  })

  test("should encode a blob with proper size when given two strings as arguments", async () => {
    const blob = new Blob(["hi", "hello"])
    assert.isEqual(blob.size, 7)
  })

  test("should encode arraybuffers with right content", async () => {
    const bytes = new Uint8Array(5)
    for (let i = 0; i < 5; i++) bytes[i] = i
    const blob = new Blob([bytes.buffer])
    const buffer = await blob.arrayBuffer()
    const result = new Uint8Array(buffer)
    for (let i = 0; i < 5; i++) {
      assert.isEqual(result[i], i)
    }
  })

  test("should encode typed arrays with right content", async () => {
    const bytes = new Uint8Array(5)
    for (let i = 0; i < 5; i++) bytes[i] = i
    const blob = new Blob([bytes])

    const buffer = await blob.arrayBuffer()
    const result = new Uint8Array(buffer)

    for (let i = 0; i < 5; i++) {
      assert.isEqual(result[i], i)
    }
  })

  test("should encode sliced typed arrays with right content", async () => {
    const bytes = new Uint8Array(5)
    for (let i = 0; i < 5; i++) bytes[i] = i
    const blob = new Blob([bytes.subarray(2)])

    const buffer = await blob.arrayBuffer()
    const result = new Uint8Array(buffer)
    for (let i = 0; i < 3; i++) {
      assert.isEqual(result[i], i + 2)
    }
  })

  test("should encode with blobs", async () => {
    const bytes = new Uint8Array(5)
    for (let i = 0; i < 5; i++) bytes[i] = i
    const blob = new Blob([new Blob([bytes.buffer])])
    const buffer = await blob.arrayBuffer()
    const result = new Uint8Array(buffer)
    for (let i = 0; i < 5; i++) {
      assert.isEqual(result[i], i)
    }
  })

  test("should enode mixed contents to right size", async () => {
    const bytes = new Uint8Array(5)
    for (let i = 0; i < 5; i++) {
      bytes[i] = i
    }
    const blob = new Blob([bytes.buffer, "hello"])
    assert.isEqual(blob.size, 10)
  })

  test("should accept mime type", async () => {
    const blob = new Blob(["hi", "hello"], { type: "text/html" })
    assert.isEqual(blob.type, "text/html")
  })

  test("should be an instance of constructor", async () => {
    const blob = new Blob(["hi"])
    assert.equal(blob instanceof Blob, true)
  })

  test("from text", async () => {
    const blob = new Blob(["hello"])
    assert.isEqual(blob.size, 5, "is right size")
    assert.isEqual(blob.type, "", "type is empty")
    assert.isEqual(await blob.text(), "hello", "reads as text")
    assert.isEquivalent(
      new Uint8Array(await blob.arrayBuffer()),
      new Uint8Array("hello".split("").map(char => char.charCodeAt(0)))
    )
  })

  test("from text with type", async () => {
    const blob = new Blob(["hello"], { type: "text/markdown" })
    assert.isEqual(blob.size, 5, "is right size")
    assert.isEqual(blob.type, "text/markdown", "type is set")
    assert.isEqual(await blob.text(), "hello", "reads as text")

    assert.isEquivalent(
      new Uint8Array(await blob.arrayBuffer()),
      new Uint8Array("hello".split("").map(char => char.charCodeAt(0)))
    )
  })

  test("empty blob", async () => {
    const blob = new Blob([])
    assert.isEqual(blob.size, 0, "size is 0")
    assert.isEqual(blob.type, "", "type is empty")
    assert.isEqual(await blob.text(), "", "reads as text")
    assert.isEquivalent(
      await blob.arrayBuffer(),
      new ArrayBuffer(0),
      "returns empty buffer"
    )
  })

  test("no args", async () => {
    const blob = new Blob()
    assert.isEqual(blob.size, 0, "size is 0")
    assert.isEqual(blob.type, "", "type is empty")
    assert.isEqual(await blob.text(), "", "reads as text")
    assert.isEquivalent(
      await blob.arrayBuffer(),
      new ArrayBuffer(0),
      "returns empty buffer"
    )
  })

  test("all emtpy args", async () => {
    const blob = new Blob([
      "",
      new Blob(),
      "",
      new Uint8Array(0),
      new ArrayBuffer(0),
    ])
    assert.isEqual(blob.size, 0, "size is 0")
    assert.isEqual(blob.type, "", "type is empty")
    assert.isEqual(await blob.text(), "", "reads as text")
    assert.isEquivalent(
      await blob.arrayBuffer(),
      new ArrayBuffer(0),
      "returns empty buffer"
    )
  })

  test("combined blob", async () => {
    const uint8 = new Uint8Array([1, 2, 3])
    const uint16 = new Uint16Array([8, 190])
    const float32 = new Float32Array([5.4, 9, 1.5])
    const string = "hello world"
    const blob = new Blob([uint8, uint16, float32, string])

    const b8 = blob.slice(0, uint8.byteLength)
    const r8 = new Uint8Array(await b8.arrayBuffer())
    assert.isEquivalent(uint8, r8)

    const b16 = blob.slice(
      uint8.byteLength,
      uint8.byteLength + uint16.byteLength
    )
    const r16 = new Uint16Array(await b16.arrayBuffer())
    assert.isEquivalent(uint16, r16)

    const b32 = blob.slice(
      uint8.byteLength + uint16.byteLength,
      uint8.byteLength + uint16.byteLength + float32.byteLength
    )
    const r32 = new Float32Array(await b32.arrayBuffer())
    assert.isEquivalent(float32, r32)

    const bs = blob.slice(
      uint8.byteLength + uint16.byteLength + float32.byteLength
    )
    assert.isEqual(string, await bs.text())

    assert.isEqual("wo", await bs.slice(6, 8).text())
    assert.isEqual("world", await bs.slice(6).text())
    assert.isEqual("world", await blob.slice(-5).text())
  })

  test("emoji", async () => {
    const emojis = `👍🤷🎉😤`
    const blob = new Blob([emojis])
    const nestle = new Blob([new Blob([blob, blob])])
    assert.isEqual(emojis + emojis, await nestle.text())
  })

  test("streams", async () => {
    const blob = new Blob(["hello", " ", "world"], { type: "text/plain" })
    const stream = blob.stream()

    const reader = stream.getReader()
    const chunks = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      if (value != null) {
        chunks.push(new TextDecoder().decode(value))
      }
    }

    assert.deepEqual("hello world", chunks.join(""))
  })
}
