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
  const { accessToken, subscription } = event.detail
  const { isAuthenticated } = await sendMessage('set-token-and-subscription', { accessToken, subscription })
  dispatchEvent('authenticated', {
    authenticated: isAuthenticated
  })
  sendMessage('popup-set-view', {
    isAuthenticated
  })
})

document.addEventListener('flattr-subscription', event => {
  let { subscription } = event.detail
  sendMessage('subscription', { type: 'subscription', subscription })
})

// TODO: Should we send something else if there is no payload?
// TODO: Should we send something else if there emitStatus is not true?
// TODO: Move get-emit-status to request-payload?
document.addEventListener('flattr-request-payload', async () => {
  const emitStatus = await sendMessage('get-emit-status')
  const payload = await sendMessage('request-payload')
  if (payload && emitStatus) {
    dispatchEvent('payload', { payload })
  }
})
