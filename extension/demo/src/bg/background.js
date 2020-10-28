'use strict'

const storageKey = 'auth'

function openAuthTab () {
  chrome.tabs.create({ url: 'https://flattr.com/oauth/ext', active: true })
}

function onToken (data, sender, sendResponse) {
  const { accessToken, subscription } = data
  if (accessToken && subscription) {
    let payload = {}
    payload[storageKey] = {
      auth: {
        accessToken: accessToken,
        subscription: subscription
      }
    }
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

function onSubscriptionChange (data, sender, sendResponse) {
  const { subscription } = data

}

function onMessage (request, sender, sendResponse) {
  if (!request) return

  const { type, data } = request
  if (type === 'token' && data) onToken(data, sender, sendResponse)
  if (type === 'subscription' && data) onSubscriptionChange(data, sender, sendResponse)
}

chrome.runtime.onMessage.addListener(onMessage)
