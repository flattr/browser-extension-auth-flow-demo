'use strict'

import { sendMessage, addListener } from '../modules/messaging'
import { API_BASE, ACCESS_TOKEN, SUBSCRIPTION, PAYLOAD, TTL } from '../modules/constants'
import * as api from '../modules/api'
import * as storage from '../modules/storage'

async function onPopupTriggerAuth () {
  const accessToken = await storage.get(ACCESS_TOKEN)
  if (!accessToken) {
    chrome.tabs.create({
      url: `${API_BASE}/oauth/ext`,
      active: true
    })
  }
}

function onPopupOpenApps () {
  chrome.tabs.create({
    url: `${API_BASE}/apps`,
    active: true
  })
}

async function onToken (data) {
  const { accessToken, subscription } = data
  const isAuthenticated = await storage.set({ accessToken, subscription })
  sendMessage('popup-set-view', {
    isAuthenticated
  })

  return {
    isAuthenticated
  }
}

function timeToLive (expiresAt) {
  return expiresAt - (Math.floor(Date.now() / 1000) + 3600)
}

async function updatePayload () {
  const payload = await storage.get(PAYLOAD)
  if (!payload) {
    const response = await api.fetchPayload()
    if (response.hasOwnProperty(PAYLOAD)) { // fetch return might need to go through .json()?
      let { expiresAt, payload } = response
      await storage.set({ expiresAt, payload })
    }
  } else {
    const ttl = await storage.get(TTL)
    if (ttl) {
      setTimeout(updatePayload, timeToLive(ttl))
    }
  }
}

async function onSubscription (data) {
  const { subscription } = data
  await storage.set({ subscription })
}

async function onPopupCheckAuth () {
  const accessToken = await storage.get(ACCESS_TOKEN)
  sendMessage('popup-set-view', {
    isAuthenticated: !!accessToken
  })
}

async function init () {
  addListener('token', onToken)
  addListener('subscription', onSubscription)
  addListener('popup-check-auth', onPopupCheckAuth)
  addListener('popup-trigger-auth', onPopupTriggerAuth)
  addListener('popup-open-apps', onPopupOpenApps)

  const accessToken = await storage.get(ACCESS_TOKEN)
  if (accessToken) {
    await updatePayload()
  }
}

await init()
