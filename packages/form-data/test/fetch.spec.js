import { FormData } from "@web-std/form-data"
import { Blob } from "@web-std/file"
import { Response } from "@web-std/fetch"
import { assert } from "./test.js"

/**
 * @param {import('./test').Test} test
 */
export const test = test => {
  test("node-fetch recognizes form-data", async () => {
    const data = new FormData()
    data.set("file", new Blob(["hello"]))
    // @ts-ignore
    const response = new Response(data)

    assert.equal(response.headers.has("content-type"), true)
    const type = response.headers.get("content-type") || ""
    assert.equal(
      /multipart\/form-data;\s*boundary=/.test(type),
      true,
      "multipart/form-data content type"
    )

    const text = await response.text()
    assert.equal(text.includes("hello"), true)
  })
}
