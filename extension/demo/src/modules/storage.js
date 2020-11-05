'use strict'

import browser from 'webextension-polyfill'

export async function set (data) {
  console.table(data)
  const results = await browser.storage.local.set(data)
  console.table(results)

  return !browser.runtime.lastError
}

export function get (key) {
  return new Promise(async resolve => {
    const results = await browser.storage.local.get([key])
    console.log(key, ': ', results[key])
    resolve(results[key])
  })
}

export async function remove (key) {
  await browser.storage.local.remove(key)

  return !browser.runtime.lastError
}
