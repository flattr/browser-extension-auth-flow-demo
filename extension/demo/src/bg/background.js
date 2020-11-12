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
  STORAGE_KEY_EXPIRES_AT,
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
  await storage.set(data)
  return updatePayload(accessToken)
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
    STORAGE_KEY_ACCESS_TOKEN,
    STORAGE_KEY_PAYLOAD,
    STORAGE_KEY_EXPIRES_AT
  ])
  const isExpired = hasExpired(data[STORAGE_KEY_EXPIRES_AT])
  if (isExpired) {
    await updatePayload(data[STORAGE_KEY_ACCESS_TOKEN])
  }
  // TODO: Throw an exception instead?
  if (!data[STORAGE_KEY_SEND_PAYLOAD]) return null
  return data[STORAGE_KEY_PAYLOAD]
}

function hasExpired (time) {
  const expiresAt = time || 0
  const now = Math.floor(Date.now() / 1000)
  const oneHour = 3600
  // We add an hour as a convenience for the user
  const remaining = expiresAt - (now + oneHour)
  return remaining < 0
}

async function updatePayload (accessToken) {
  try {
    const results = await api.fetchSubscriptionStatus(accessToken)
    storage.set({
      [STORAGE_KEY_PAYLOAD]: results[STORAGE_KEY_PAYLOAD] || null,
      [STORAGE_KEY_EXPIRES_AT]: results[STORAGE_KEY_EXPIRES_AT] || null
    })
  } catch (error) {
    return storage.set({
      [STORAGE_KEY_ACCESS_TOKEN]: null,
      [STORAGE_KEY_PAYLOAD]: null,
      [STORAGE_KEY_EXPIRES_AT]: null
    })
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
