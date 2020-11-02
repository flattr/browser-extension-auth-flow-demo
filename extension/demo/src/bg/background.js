'use strict'

import * as api from './modules/api.js'
import * as keys from './modules/keys.js'

function openAuthTab () {
  chrome.tabs.create({ url: 'https://flattr.com/oauth/ext', active: true })
}

function onToken (data, sendResponse) {
  const { accessToken, subscription } = data
  chrome.storage.local.set({ accessToken, subscription }, () => {
    sendResponse({ authenticated: !chrome.runtime.lastError })
    updatePayload()
  })

  // keeps message port open until set storage triggers sendResponse()
  return true
}

function timeToLive (expiresAt) {
  return expiresAt - (Date.now() + 3600)
}

function updatePayload () {
  return // this code does not work yet

  chrome.storage.local.get(keys.payload, result => {
    if (!result[keys.payload]) {
      api.fetchPayload().then(payload => {
        if (payload) { // fetch return might need to go through .json()?
          // todo: create storage module
          // storage.add(keys.payload, payload)
          let data = {}
          data[keys.payload] = payload
          chrome.storage.local.set(data)
        }
      })
    }  else {
      setTimeout(updatePayload, timeToLive(result[keys.payload].expiresAt))
    }
  })

}

function init () {
  chrome.storage.local.get(
    [keys.accessToken],
    result => {
      console.log(result)
      if (!result[keys.accessToken]) {
        openAuthTab()
      } else {
        updatePayload()
      }
    }
  )
}

function onSubscriptionChange (data) {
  const { subscription } = data
  chrome.storage.local.set(subscription)
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
