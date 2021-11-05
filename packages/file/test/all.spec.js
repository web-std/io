import { test as fileTest } from "./file.spec.js"
import { test as fetchTest } from "./fetch.spec.js"

import { test } from "./test.js"

fileTest(test)
fetchTest(test)
test.run()
