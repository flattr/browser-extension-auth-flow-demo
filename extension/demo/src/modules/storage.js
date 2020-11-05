'use strict'

import browser from 'webextension-polyfill'

export async function set (data) {
  await browser.storage.local.set(data)

  return !browser.runtime.lastError
}

export async function get (key) {
  const results = await browser.storage.local.get([key])
  return results[key]
}
