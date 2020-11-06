'use strict'

import browser from 'webextension-polyfill'

/**
 * Wrapper of browser.storage.local.set
 * @param {object} data An object containing one or more key/value pairs to be stored in storage. If an item already exists, its value will be updated.
 * @returns {Promise}
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/set
 */
export function set (data) {
  return browser.storage.local.set(data)
}

/**
 * Modified browser.storage.local.get that can only be used to get a single value (specified by "key").
 * @param {string} key The key we wish to retrieve the value for.
 * @returns {Promise} Resolves with the value stored in storage.
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/get
 */
export async function getSingle (key) {
  if (typeof key !== 'string') {
    throw Error('Parameter "key" has to be a string')
  }
  const results = await browser.storage.local.get(key)
  return results[key]
}

/**
 * Wrapper of browser.storage.local.get that returns an object representing everything specified in "keys"
 * @param {string|array|object} keys
 * @returns {Promise} Resolves with the an object with the values stored in storage.
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/get
 */
export function get (keys) {
  return browser.storage.local.get(keys)
}