'use strict'

import { sendMessage } from '../modules/messaging'

function dispatchEvent (name, data = {}) {
  document.dispatchEvent(
    new CustomEvent(`flattr-${name}`, { detail: data })
  )
}

function onAuthenticated ({ isAuthenticated }) {
  dispatchEvent('authenticated', { authenticated: isAuthenticated })
}

document.addEventListener('flattr-trigger', event => {
  if (event.detail.action !== 'authentication') return

  dispatchEvent('authenticate')
})

document.addEventListener('flattr-token', event => {
  const { accessToken, subscription } = event.detail
  sendMessage('token', { accessToken, subscription }, onAuthenticated)
})

document.addEventListener('flattr-subscription', event => {
  let { subscription } = event.detail
  sendMessage('subscription', { type: 'subscription', subscription })
})

const FlattrExt = {
  isPayingUser: () => sendMessage('payload-request', {}, payload => payload)
}
