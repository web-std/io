import { test as blobTest } from "./blob.spec.js"
import { test as sliceTest } from "./slice.spec.js"
import { test } from "./test.js"

blobTest(test)
sliceTest(test)

test.run()
