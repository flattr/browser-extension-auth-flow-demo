'use strict'

export async function set (data) {
  await chrome.storage.local.set(data)

  return !chrome.runtime.lastError
}

export async function get (key) {
  chrome.storage.local.get([key], results => {
    return results[key]
  })
}

export async function remove (key) {
  await chrome.storage.local.remove(key)

  return chrome.runtime.lastError
}
