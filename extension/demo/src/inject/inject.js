'use strict'

function dispatchEvent (name, data = {}) {
  document.dispatchEvent(
    new CustomEvent(`flattr-${name}`, { detail: data })
  )
}

function sendMessage (type, data, callback) {
  const payload = {
    type: type,
    data: data
  }
  chrome.runtime.sendMessage(payload, callback)
}

function onAuthenticated ({ authenticated }) {
  dispatchEvent('authenticated', { authenticated })
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
