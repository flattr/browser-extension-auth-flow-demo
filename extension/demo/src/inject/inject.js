'use strict'

import { sendMessage } from '../modules/messaging'

function dispatchEvent (name, data = {}) {
  document.dispatchEvent(
    new CustomEvent(`flattr-${name}`, { detail: data })
  )
}

document.addEventListener('flattr-trigger', event => {
  if (event.detail.action !== 'authentication') return
  dispatchEvent('authenticate')
})

document.addEventListener('flattr-token', async event => {
  const { accessToken } = event.detail
  const { isAuthenticated } = await sendMessage('set-token', accessToken)
  dispatchEvent('authenticated', {
    authenticated: isAuthenticated
  })
  sendMessage('popup-set-view', {
    isAuthenticated
  })
})

// TODO: Should we send something else if there is no payload?
document.addEventListener('flattr-request-payload', async () => {
  const payload = await sendMessage('request-payload')
  if (payload) {
    dispatchEvent('payload', { payload })
  }
})
