'use strict'

const storageKey = 'auth'

function openAuthTab () {
  chrome.tabs.create({ url: 'https://flattr.com/oauth/ext', active: true })
}

function onToken (request, sender, sendResponse) {
  if (!request) return

  const { accessToken, subscription } = request
  if (accessToken && subscription) {
    let payload = {}
    payload[storageKey] = {
      auth: {
        accessToken: accessToken,
        subscription: subscription
      }
    }
    console.log(payload)
    chrome.storage.local.set(payload, () => {
      sendResponse({ authenticated: !chrome.runtime.lastError })
    })
  }

  // keeps message port open until set storage triggers sendResponse()
  return true
}

chrome.storage.local.get(
  [storageKey],
  result => {
    if (!result[storageKey]) {
    openAuthTab()
    }
  }
)
chrome.runtime.onMessage.addListener(onToken)
