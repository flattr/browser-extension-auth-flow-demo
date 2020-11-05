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
  const { isAuthenticated } = await sendMessage('token', { accessToken, subscription })
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

document.addEventListener('flattr-request-payload', async event => {
  const { payload } = await sendMessage('request-payload')

  dispatchEvent('payload', {
    payload: payload
  })

})
