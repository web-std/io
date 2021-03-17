import { test as fileTest } from "./file.spec.js"
import { test } from "./test.js"

fileTest(test)
test.run()
