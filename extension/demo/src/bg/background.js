'use strict'

import browser from 'webextension-polyfill'

import { addListener } from '../modules/messaging'
import { ACCESS_TOKEN, API_BASE_WEB, PAYLOAD, TTL } from '../modules/constants'
import * as api from '../modules/api'
import * as storage from '../modules/storage'

async function onPopupTriggerAuth () {
  const accessToken = await storage.get(ACCESS_TOKEN)
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

async function onToken (data) {
  const { accessToken } = data
  let isAuthenticated = false
  try {
    await storage.set(data)
    isAuthenticated = true
    updatePayload(accessToken)
  } catch (e) {}

  return { isAuthenticated }
}

async function requestPayload () {
  const response = {}
  response[PAYLOAD] = await storage.get(PAYLOAD)

  return response
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
      const callback = () => updatePayload(accessToken)
      setTimeout(callback, timeToLive(ttl))
    }
  }
}

function onSubscription (data) {
  storage.set(data)
}

async function onPopupCheckAuth () {
  return { isAuthenticated: !!await storage.get(ACCESS_TOKEN) }
}

;(async () => {
  addListener('token', onToken)
  addListener('subscription', onSubscription)
  addListener('request-payload', requestPayload)
  addListener('popup-check-auth', onPopupCheckAuth)
  addListener('popup-trigger-auth', onPopupTriggerAuth)
  addListener('popup-open-apps', onPopupOpenApps)

  const accessToken = await storage.get(ACCESS_TOKEN)
  if (accessToken) {
    updatePayload(accessToken)
  }
})()
