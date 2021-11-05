import * as uvu from "uvu"
import * as uvuassert from "uvu/assert"

const deepEqual = uvuassert.equal
const isEqual = uvuassert.equal
const isEquivalent = uvuassert.equal

/**
 * @param {number} value
 * @param {number} number
 * @param {string} [description]
 */
const isLessThan = (value, number, description) =>
  uvuassert.ok(value < number, description)
export const assert = {
  ...uvuassert,
  deepEqual,
  isEqual,
  isEquivalent,
  isLessThan,
}
export const test = uvu.test

/**
 * @typedef {uvu.Test} Test
 */
