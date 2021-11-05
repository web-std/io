import { test as blobTest } from "./blob.spec.js"
import { test as sliceTest } from "./slice.spec.js"
import { test as fetchTest } from "./fetch.spec.js"
import { test } from "./test.js"

blobTest(test)
sliceTest(test)
fetchTest(test)
test.run()
