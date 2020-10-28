'use strict'

function dispatchEvent (name, data = {}) {
  document.dispatchEvent(
    new CustomEvent(`flattr-${name}`, { detail: data })
  )
}

document.addEventListener('flattr-trigger', event => {
  if (event.detail.action !== 'authentication') return

  dispatchEvent('authenticate')
})

document.addEventListener('flattr-token', event => {
  let { accessToken, subscription } = event.detail
  chrome.runtime.sendMessage(
    { type: 'token', accessToken, subscription },
    ({ authenticated }) => {
      dispatchEvent('authenticated', { authenticated })
    }
  )
})

document.addEventListener('flattr-subscription', event => {
  let { subscription } = event.detail
  chrome.runtime.sendMessage(
    { type: 'subscription', subscription },

  )
})
