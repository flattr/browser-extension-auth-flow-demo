'use strict'

import browser from 'webextension-polyfill'

export async function set (data) {
  return await browser.storage.local.set(data)
}

export async function get (key) {
  const results = await browser.storage.local.get([key])
  return results[key]
}
