import { Blob, TextEncoder } from "@web-std/blob"
import { assert } from "./test.js"

/**
 *
 * @param {Blob} blob
 * @param {Object} expected
 * @param {number} expected.size
 * @param {string} [expected.type]
 * @param {Uint8Array[]} expected.content
 */
const assertBlob = async (blob, expected) => {
  assert.ok(blob instanceof Blob, "blob is instanceof Blob")
  assert.equal(String(blob), "[object Blob]", "String(blob) -> [object Blob]")
  assert.equal(
    blob.toString(),
    "[object Blob]",
    "blob.toString() -> [object Blob]"
  )
  assert.equal(blob.size, expected.size, `blob.size == ${expected.size}`)
  assert.equal(blob.type, expected.type || "", "blob.type")

  const chunks = []
  // @ts-ignore - https://github.com/microsoft/TypeScript/issues/29867
  const stream = blob.stream()
  const reader = stream.getReader()
  while (true) {
    const chunk = await reader.read()
    if (chunk.done) {
      reader.releaseLock()
      break
    } else {
      chunks.push(chunk.value)
    }
  }
  

  assert.deepEqual(
    concatUint8Array(chunks),
    concatUint8Array(expected.content),
    "blob.stream() matches expectation"
  )

  let text = ""
  const encoder = new TextDecoder()
  for (const chunk of expected.content) {
    text += encoder.decode(chunk)
  }

  assert.deepEqual(
    await blob.text(),
    text,
    "blob.text() produces expected text"
  )

  // Not all browsers implement this
  const bytes = concatUint8Array(expected.content)
  const buffer = await blob.arrayBuffer()
  assert.ok(buffer instanceof ArrayBuffer)
  assert.deepEqual(buffer, bytes.buffer)
  assert.deepEqual(
    new Uint8Array(buffer),
    bytes,
    "blob.arrayBuffer() produces expected buffer"
  )
}

/**
 * @param {Uint8Array[]} chunks
 */
const concatUint8Array = chunks => {
  const bytes = []
  for (const chunk of chunks) {
    bytes.push(...chunk)
  }
  return new Uint8Array(bytes)
}

/**
 * @param {*} input
 * @returns {Uint8Array}
 */
const toUint8Array = input => {
  if (typeof input === "string") {
    return new TextEncoder().encode(input)
  } else if (input instanceof ArrayBuffer) {
    return new Uint8Array(input)
  } else if (input instanceof Uint8Array) {
    return input
  } else if (ArrayBuffer.isView(input)) {
    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  } else {
    throw new TypeError(`Invalid input ${input}`)
  }
}

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("new Blob()", async () => {
    const blob = new Blob()

    await assertBlob(blob, {
      type: "",
      size: 0,
      content: [],
    })
  })

  test('new Blob("a=1")', async () => {
    const data = "a=1"
    const blob = new Blob([data])

    await assertBlob(blob, {
      size: 3,
      type: "",
      content: [toUint8Array(data)],
    })
  })

  test("Blob with mixed parts", async () => {
    const parts = [
      "a",
      new Uint8Array([98]),
      new Uint16Array([25699]),
      new Uint8Array([101]).buffer,
      new TextEncoder().encode("f"),
      new Blob(["g"]),
    ]

    await assertBlob(new Blob(parts), {
      size: 7,
      content: [...parts.slice(0, -1).map(toUint8Array), toUint8Array("g")],
    })
  })

  test("Blob slice", async () => {
    const parts = ["hello ", "world"]
    const blob = new Blob(parts)

    await assertBlob(blob, {
      size: 11,
      content: parts.map(toUint8Array),
    })

    assertBlob(blob.slice(), {
      size: 11,
      content: parts.map(toUint8Array),
    })

    assertBlob(blob.slice(2), {
      size: 9,
      content: [toUint8Array("llo "), toUint8Array("world")],
    })

    assertBlob(blob.slice(5), {
      size: 6,
      content: [toUint8Array(" "), toUint8Array("world")],
    })

    assertBlob(blob.slice(6), {
      size: 5,
      content: [toUint8Array("world")],
    })

    assertBlob(blob.slice(5, 100), {
      size: 6,
      content: [toUint8Array(" "), toUint8Array("world")],
    })

    assertBlob(blob.slice(-5), {
      size: 5,
      content: [toUint8Array("world")],
    })

    assertBlob(blob.slice(-5, -10), {
      size: 0,
      content: [],
    })

    assertBlob(blob.slice(-5, -2), {
      size: 3,
      content: [toUint8Array("wor")],
    })

    assertBlob(blob.slice(-5, 11), {
      size: 5,
      content: [toUint8Array("world")],
    })

    assertBlob(blob.slice(-5, 12), {
      size: 5,
      content: [toUint8Array("world")],
    })

    assertBlob(blob.slice(-5, 10), {
      size: 4,
      content: [toUint8Array("worl")],
    })
  })

  test("Blob type", async () => {
    const type = "text/plain"
    const blob = new Blob([], { type })
    await assertBlob(blob, { size: 0, type, content: [] })
  })

  test("Blob slice type", async () => {
    const type = "text/plain"
    const blob = new Blob().slice(0, 0, type)
    await assertBlob(blob, { size: 0, type, content: [] })
  })

  test("invalid Blob type", async () => {
    const blob = new Blob([], { type: "\u001Ftext/plain" })
    await assertBlob(blob, { size: 0, type: "", content: [] })
  })

  test("invalid Blob slice type", async () => {
    const blob = new Blob().slice(0, 0, "\u001Ftext/plain")
    await assertBlob(blob, { size: 0, type: "", content: [] })
  })

  test("normalized Blob type", async () => {
    const blob = new Blob().slice(0, 0, "text/Plain")
    await assertBlob(blob, { size: 0, type: "text/plain", content: [] })
  })

  test("Blob slice(0, 1)", async () => {
    const data = "abcdefgh"
    const blob = new Blob([data]).slice(0, 1)
    await assertBlob(blob, {
      size: 1,
      content: [toUint8Array("a")],
    })
  })

  test("Blob slice(-1)", async () => {
    const data = "abcdefgh"
    const blob = new Blob([data]).slice(-1)
    await assertBlob(blob, {
      size: 1,
      content: [toUint8Array("h")],
    })
  })

  test("Blob slice(0, -1)", async () => {
    const data = "abcdefgh"
    const blob = new Blob([data]).slice(0, -1)
    await assertBlob(blob, {
      size: 7,
      content: [toUint8Array("abcdefg")],
    })
  })

  test("blob.slice(1, 2)", async () => {
    const blob = new Blob(["a", "b", "c"]).slice(1, 2)
    await assertBlob(blob, {
      size: 1,
      content: [toUint8Array("b")],
    })
  })
}
