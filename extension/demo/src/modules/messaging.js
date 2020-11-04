'use strict'

import browser from 'webextension-polyfill'

/**
 * @param {string} key Id/key for the message to listen for
 * @param {function|Promise} callback Response handler 
 */
export function addListener (key, callback) {
  const listener = ({ key: requestKey, data = {} }) => {
    if (requestKey === key) {
      return Promise.resolve(callback(data))
    }
  }
  browser.runtime.onMessage.addListener(listener)
}

/**
 * @param {string} key Id/key for the message to send
 * @param {object} data Data to send with the message
 * @returns {Promise} Promise that is resolved with response of the listener
 */
export function sendMessage (key, data) {
  const payload = {
    key,
    data
  }
  return browser.runtime.sendMessage(payload)
}
