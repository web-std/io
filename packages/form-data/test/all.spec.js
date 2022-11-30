import { JSDOM } from 'jsdom';
import { test as libTest } from "./form-data.spec.js"
import { test as fetchTest } from "./fetch.spec.js"
import { test } from "./test.js"



test.before(() => {
  const { window } = new JSDOM('');
  // @ts-ignore
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator;
  global.getComputedStyle = window.getComputedStyle;
})

libTest(test)
fetchTest(test)
test.run()
