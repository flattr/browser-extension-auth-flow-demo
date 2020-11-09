'use strict'

import browser from 'webextension-polyfill'

import { addListener } from '../modules/messaging'
import * as api from '../modules/api'
import * as storage from '../modules/storage'
import {
  API_BASE_WEB,
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_SUBSCRIPTION,
  STORAGE_KEY_PAYLOAD,
  STORAGE_KEY_TTL,
  STORAGE_KEY_SEND_PAYLOAD
} from '../modules/constants'

async function onPopupTriggerAuth () {
  const accessToken = await storage.getSingle(STORAGE_KEY_ACCESS_TOKEN)
  if (!accessToken) {
    browser.tabs.create({
      url: `${API_BASE_WEB}/oauth/ext`,
      active: true
    })
  }
}

function onPopupOpenApps () {
  browser.tabs.create({
    url: `${API_BASE_WEB}/apps`,
    active: true
  })
}

function onSetSendPayload (data) {
  return storage.set({
    [STORAGE_KEY_SEND_PAYLOAD]: data
  })
}

async function onSetTokenAndSubscription ({ accessToken, subscription }) {
  const data = {
    [STORAGE_KEY_ACCESS_TOKEN]: accessToken,
    [STORAGE_KEY_SUBSCRIPTION]: subscription
  }
  let isAuthenticated = false
  try {
    await storage.set(data)
    isAuthenticated = true
    updatePayload(accessToken)
  } catch (e) {}
  return { isAuthenticated }
}

function onSetSubscription (subscription) {
  return storage.set({
    [STORAGE_KEY_SUBSCRIPTION]: subscription
  })
}

async function onPopupSetup () {
  const data = await storage.get([
    STORAGE_KEY_ACCESS_TOKEN,
    STORAGE_KEY_SEND_PAYLOAD
  ])

  const isAuthenticated = !!data[STORAGE_KEY_ACCESS_TOKEN]
  let sendPayload = data[STORAGE_KEY_SEND_PAYLOAD]

  const hasSendPayload = sendPayload != null
  if (!hasSendPayload) {
    await storage.set({
      [STORAGE_KEY_SEND_PAYLOAD]: true
    })
    sendPayload = true
  }

  return {
    isAuthenticated,
    sendPayload
  }
}

// TODO: Should we send something else if sendPayload is not true?
async function onRequestPayload () {
  const data = await storage.get([
    STORAGE_KEY_SEND_PAYLOAD,
    STORAGE_KEY_PAYLOAD
  ])
  if (
    data[STORAGE_KEY_SEND_PAYLOAD]
  ) {
    return data[STORAGE_KEY_PAYLOAD]
  }
  return null
}

function timeToLive (expiresAt) {
  return expiresAt - (Math.floor(Date.now() / 1000) + 3600)
}

async function updatePayload (accessToken) {
  const payload = await storage.getSingle(STORAGE_KEY_PAYLOAD)
  if (!payload) {
    const subscriptionStatus = await api.fetchSubscriptionStatus(accessToken)
    if (subscriptionStatus.hasOwnProperty(STORAGE_KEY_PAYLOAD)) {
      storage.set(subscriptionStatus)
    }
  } else {
    const ttl = await storage.getSingle(STORAGE_KEY_TTL)
    if (ttl) {
      const callback = () => updatePayload(accessToken)
      setTimeout(callback, timeToLive(ttl))
    }
  }
}

;(async () => {
  addListener('set-token-and-subscription', onSetTokenAndSubscription)
  addListener('set-subscription', onSetSubscription)
  addListener('popup-setup', onPopupSetup)
  addListener('popup-trigger-auth', onPopupTriggerAuth)
  addListener('popup-open-apps', onPopupOpenApps)
  addListener('request-payload', onRequestPayload)
  addListener('set-send-payload', onSetSendPayload)

  const accessToken = await storage.getSingle(STORAGE_KEY_ACCESS_TOKEN)
  if (accessToken) {
    updatePayload(accessToken)
  }
})()
