'use strict'

import { sendMessage, addListener } from '../modules/messaging'
import { ACCESS_TOKEN, PAYLOAD, TTL, API_BASE_WEB } from '../modules/constants'
import * as api from '../modules/api'
import * as storage from '../modules/storage'

async function onPopupTriggerAuth () {
  const accessToken = await storage.get(ACCESS_TOKEN)
  if (!accessToken) {
    chrome.tabs.create({
      url: `${API_BASE_WEB}/oauth/ext`,
      active: true
    })
  }
}

function onPopupOpenApps () {
  chrome.tabs.create({
    url: `${API_BASE_WEB}/apps`,
    active: true
  })
}

async function onToken (data) {
  const { accessToken } = data
  const isAuthenticated = await storage.set(data)
  sendMessage('popup-set-view', { isAuthenticated })
  updatePayload(accessToken)

  return { isAuthenticated }
}

function timeToLive (expiresAt) {
  return expiresAt - (Math.floor(Date.now() / 1000) + 3600)
}

async function updatePayload (accessToken) {
  const payload = await storage.get(PAYLOAD)
  if (!payload) {
    const subscriptionStatus = await api.fetchSubscriptionStatus(accessToken)
    if (subscriptionStatus.hasOwnProperty(PAYLOAD)) {
      storage.set(subscriptionStatus)
    }
  } else {
    const ttl = await storage.get(TTL)
    if (ttl) {
      setTimeout(updatePayload.bind(null, accessToken), timeToLive(ttl))
    }
  }
}

async function onSubscription (data) {
  await storage.set(data)
}

async function onPopupCheckAuth () {
  const accessToken = await storage.get(ACCESS_TOKEN)
  sendMessage('popup-set-view', {
    isAuthenticated: !!accessToken
  })
}

;(async () => {
  addListener('token', onToken)
  addListener('subscription', onSubscription)
  addListener('popup-check-auth', onPopupCheckAuth)
  addListener('popup-trigger-auth', onPopupTriggerAuth)
  addListener('popup-open-apps', onPopupOpenApps)

  const accessToken = await storage.get(ACCESS_TOKEN)
  if (accessToken) {
    updatePayload(accessToken)
  }
})()
