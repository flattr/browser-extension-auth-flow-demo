'use strict'

import { sendMessage, addListener } from '../modules/messaging'
import { API_BASE, STORAGE_KEY } from '../modules/constants'

/**
 * @todo Check if already authenticated first?
 */
function onPopupTriggerAuth () {
  chrome.tabs.create({
    url: `${API_BASE}/oauth/ext`,
    active: true
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
  let payload = {}
  payload[STORAGE_KEY] = {
    auth: {
      accessToken: accessToken,
      subscription: subscription
    }
  }
  await chrome.storage.local.set(payload)
  const isAuthenticated = !chrome.runtime.lastError
  sendMessage('popup-set-view', {
    isAuthenticated
  })
  return {
    isAuthenticated
  }
}

async function onSubscription (data) {
  const { subscription } = data
  let payload = {}
  payload[STORAGE_KEY]['auth']['subscription'] = subscription
  await chrome.storage.local.set(payload)
  chrome.storage.local.get([STORAGE_KEY], results => {
    console.log(results)
    return results
  })
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
