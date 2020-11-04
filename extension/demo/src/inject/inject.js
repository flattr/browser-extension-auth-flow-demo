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

document.addEventListener('flattr-request-payload', event => {
  // TODO: Do stuff to get real payload...
  dispatchEvent('payload', {
    payload: 'eyJwYXlpbmciOnRydWUsInRzIjoxNjAzODczODMxfQ.p6V9Kt6nA8l7Bl656ZT4Y33OblczVkcufIQMAsDcLvBfsbvS5G26+OVA1J2Ltt7sKibiTkiY6WQL9m6/8awF+4aSL//fKc8Lh3kocJN4Hx0fBffH3PWtheCOPFpkFgndJF/Sk2lsscTMEp7mxXqVL3uTaHkbeUihL8c0miMRVbQ1zDyfyBQ611TNlvXaRQvy87OB1a9ytLSROv474crlTtDVVjVuW68keiIvJtGky5DVTGTn1F+Kac5ELBrWE1nUOmiLBVft5yAi40ZaOmSMiwyhFJRsb+VmPjncCjwBbEeHyw7Xx7q39/OPGSsVwNEAQ4K3XxDCTYFl380m+dDAcw'
  })
})
