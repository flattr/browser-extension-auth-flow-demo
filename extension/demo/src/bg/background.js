'use strict'

import browser from 'webextension-polyfill'

import { addListener } from '../modules/messaging'
import { API_BASE, STORAGE_KEY } from '../modules/constants'

async function getIsAuthenticated () {
  const results = await browser.storage.local.get([STORAGE_KEY])
  return !!results[STORAGE_KEY]
}

/**
 * @param {object} data Data to save to storage
 * @returns {Promise}
 */
function updateStorage (data) {
  const payload = {
    [STORAGE_KEY]: {
      auth: data
    }
  }
  return browser.storage.local.set(payload)
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

async function onToken (data) {
  await updateStorage(data)
  const isAuthenticated = !browser.runtime.lastError
  return {
    isAuthenticated
  }
}

function onSubscription (data) {
  updateStorage(data)
}

async function onPopupCheckAuth () {
  const isAuthenticated = await getIsAuthenticated()
  return {
    isAuthenticated
  }
}

addListener('token', onToken)
addListener('subscription', onSubscription)
addListener('popup-check-auth', onPopupCheckAuth)
addListener('popup-trigger-auth', onPopupTriggerAuth)
addListener('popup-open-apps', onPopupOpenApps)
