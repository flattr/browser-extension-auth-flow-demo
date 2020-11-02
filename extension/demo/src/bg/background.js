'use strict'

import * as api from './modules/api.js'
import * as keys from './modules/keys.js'

function openAuthTab () {
  chrome.tabs.create({ url: 'https://flattr.com/oauth/ext', active: true })
}

function onToken (data, sendResponse) {
  const { accessToken, subscription } = data
  let payload = {}
  payload[keys.auth] = {
    accessToken: accessToken,
    subscription: subscription
  }
  chrome.storage.local.set(payload, () => {
    sendResponse({ authenticated: !chrome.runtime.lastError })
  })

  // keeps message port open until set storage triggers sendResponse()
  return true
}

function timeToLive (expiresAt) {
  return expiresAt - (Date.now() + 3600)
}

async function updatePayload () {
  const payload = await api.fetchPayload()
  if (payload) { // fetch return might need to go through .json()?
    storage.store(keys.payload, payload)
  }
}

function init () {
  chrome.storage.local.get(
    [keys.auth],
    result => {
      if (!result[keys.auth]) {
        openAuthTab()
      } else if (result[keys.payload]) {
        setTimeout(updatePayload, timeToLive(result.payload.expiresAt))
      }
    }
  )
}

function onSubscriptionChange (data) {
  const { subscription } = data
  let payload = {}
  payload[keys.auth]['subscription'] = subscription
  chrome.storage.local.set(payload, () => {
    chrome.storage.local.get([storageKey], result => {
      console.log(result)
    })
  })

  return true
}

function onMessage (request, sender, sendResponse) {
  if (!request) return

  const { type, data } = request
  if (type === 'token' && data) onToken(data, sendResponse)
  if (type === 'subscription' && data) onSubscriptionChange(data)

  return true
}

chrome.runtime.onMessage.addListener(onMessage)

init()
