'use strict'

import browser from 'webextension-polyfill'

export function set (data) {
  return browser.storage.local.set(data)
}

export async function get (key) {
  const results = await browser.storage.local.get([key])
  return results[key]
}
