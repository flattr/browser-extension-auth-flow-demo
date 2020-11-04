'use strict'

export async function set (data) {
  console.log(data)
  await chrome.storage.local.set(data, console.log)

  return !chrome.runtime.lastError
}

export async function get (key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key], results => {
      console.log(results[key])
      resolve(results[key])
    })
  })
}

export async function remove (key) {
  await chrome.storage.local.remove(key)

  return !chrome.runtime.lastError
}
