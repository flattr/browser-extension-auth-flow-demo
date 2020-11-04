'use strict'

import { sendMessage, addListener } from '../modules/messaging'
import { API_BASE, STORAGE_KEY } from '../modules/constants'
import * as api from './modules/api.js'
import * as keys from './modules/keys.js'
import * as storage from './modules/storage.js'

function onPopupTriggerAuth () {
  chrome.storage.local.get([STORAGE_KEY], results => {
    if (!results[STORAGE_KEY]) {
      chrome.tabs.create({
        url: `${API_BASE}/oauth/ext`,
        active: true
      })
    }
  })
}

function onPopupOpenApps () {
  chrome.tabs.create({
    url: `${API_BASE}/apps`,
    active: true
  })
}

async function onToken (data) {
  const { accessToken, subscription } = data
  await chrome.storage.local.set({ accessToken, subscription })
  const isAuthenticated = !chrome.runtime.lastError
  sendMessage('popup-set-view', {
    isAuthenticated
  })

  return {
    isAuthenticated
  }
}

chrome.storage.local.get(
  [storageKey],
  result => {
    if (!result[storageKey]) {
      openAuthTab()
    }
  }
)

function timeToLive (expiresAt) {
  return expiresAt - (Math.floor(Date.now() / 1000) + 3600)
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

async function onSubscription (data) {
  const { subscription } = data
  chrome.storage.local.set(subscription)
}

async function onPopupCheckAuth () {
  await chrome.storage.local.get([STORAGE_KEY], results => {
    sendMessage('popup-set-view', {
      isAuthenticated: !!results[STORAGE_KEY]
    })
  })
}

addListener('token', onToken)
addListener('subscription', onSubscription)
addListener('popup-check-auth', onPopupCheckAuth)
addListener('popup-trigger-auth', onPopupTriggerAuth)
addListener('popup-open-apps', onPopupOpenApps)

init()
