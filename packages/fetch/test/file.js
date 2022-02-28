import fetch from '@web-std/fetch'
import { assert } from "chai"
describe("can fetch local files", () => {
  it("can fetch local file", async () => {
    const response = await fetch(import.meta.url)
    assert.equal(response.headers.get('content-type'), "application/javascript")
    const code = await response.text()

    assert.ok(code.includes('it("can fetch local file"'))
  })
})


