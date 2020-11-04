'use strict'

import browser from 'webextension-polyfill'

import { addListener } from '../modules/messaging'
import {
  API_BASE,
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_SUBSCRIPTION,
  STORAGE_KEY_EMIT_STATUS
} from '../modules/constants'

async function getIsAuthenticated () {
  const results = await browser.storage.local.get([STORAGE_KEY_ACCESS_TOKEN])
  return !!results[STORAGE_KEY_ACCESS_TOKEN]
}

async function getEmitStatus () {
  const results = await browser.storage.local.get([STORAGE_KEY_EMIT_STATUS])
  return !!results[STORAGE_KEY_EMIT_STATUS]
}

async function onPopupTriggerAuth () {
  const isAuthenticated = await getIsAuthenticated()
  if (!isAuthenticated) {
    browser.tabs.create({
      url: `${API_BASE}/oauth/ext`,
      active: true
    })
  }
}

function onPopupOpenApps () {
  browser.tabs.create({
    url: `${API_BASE}/apps`,
    active: true
  })
}

function onSetEmitStatus (data) {
  return browser.storage.local.set({
    [STORAGE_KEY_EMIT_STATUS]: data
  })
}

function onGetEmitStatus () {
  return getEmitStatus()
}

async function onSetTokenAndSubscription ({ accessToken, subscription }) {
  await browser.storage.local.set({
    [STORAGE_KEY_ACCESS_TOKEN]: accessToken,
    [STORAGE_KEY_SUBSCRIPTION]: subscription
  })
  const isAuthenticated = await getIsAuthenticated()
  return {
    isAuthenticated
  }
}

function onSetSubscription (subscription) {
  return browser.storage.local.set({
    [STORAGE_KEY_SUBSCRIPTION]: subscription
  })
}

async function onPopupSetup () {
  const results = await browser.storage.local.get([STORAGE_KEY_EMIT_STATUS])
  const hasEmitStatus = results.hasOwnProperty(STORAGE_KEY_EMIT_STATUS)

  if (!hasEmitStatus) {
    await browser.storage.local.set({
      [STORAGE_KEY_EMIT_STATUS]: true
    })
  }

  const isAuthenticated = await getIsAuthenticated()
  const emitStatus = await getEmitStatus()

  return {
    isAuthenticated,
    emitStatus
  }
}

addListener('set-token-and-subscription', onSetTokenAndSubscription)
addListener('set-subscription', onSetSubscription)
addListener('popup-setup', onPopupSetup)
addListener('popup-trigger-auth', onPopupTriggerAuth)
addListener('popup-open-apps', onPopupOpenApps)
addListener('set-emit-status', onSetEmitStatus)
addListener('get-emit-status', onGetEmitStatus)
