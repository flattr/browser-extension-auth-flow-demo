'use strict'

import browser from 'webextension-polyfill'

export async function set (data) {
  await browser.storage.local.set(data)

  return !browser.runtime.lastError
}

export function get (key) {
  return new Promise(async resolve => {
    const results = await browser.storage.local.get([key])
    resolve(results[key])
  })
}
