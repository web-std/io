import { test as formTest } from "./form-data.spec.js"
import { test as fetchTest } from "./fetch.spec.js"
import { test } from "./test.js"

formTest(test)
fetchTest(test)
test.run()
