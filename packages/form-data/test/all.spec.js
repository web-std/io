import { test as libTest } from "./form-data.spec.js"
import { test as fetchTest } from "./fetch.spec.js"
import { test } from "./test.js"

libTest(test)
fetchTest(test)
test.run()
