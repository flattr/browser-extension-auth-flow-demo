'use strict'

import { addListener, sendMessage } from './modules/messaging'

const isNotAuthorized = document.getElementById('is-not-authorized')
const button = document.getElementById('auth-button')
const link = document.getElementById('manage-link')

const isAuthorized = document.getElementById('is-authorized')
const toggle = document.getElementById('toggle')

function onButtonClick () {
  sendMessage('popup-trigger-auth')
}

function onLinkClick (event) {
  event.preventDefault()
  sendMessage('popup-open-apps')
}

function setToggle (isChecked) {
  toggle.setAttribute('aria-checked', isChecked)
  toggle.removeAttribute('disabled')
}

async function toggleEmitStatus () {
  const oldValue = toggle.getAttribute('aria-checked') === 'true'
  const newValue = !oldValue
  toggle.setAttribute('aria-checked', newValue)
  toggle.setAttribute('disabled', true)
  try {
    await sendMessage('set-emit-status', newValue)
  } catch (error) {
    toggle.setAttribute('aria-checked', oldValue)
    throw error
  } finally {
    toggle.removeAttribute('disabled')
  }
}

function setView (isAuthenticated = false) {
  if (!isAuthenticated) {
    isNotAuthorized.style.display = 'block'
    isAuthorized.style.display = 'none'
  } else {
    isAuthorized.style.display = 'block'
    isNotAuthorized.style.display = 'none'
  }
}

button.addEventListener('click', onButtonClick)
link.addEventListener('click', onLinkClick)
toggle.addEventListener('click', toggleEmitStatus)

addListener('popup-set-view', setView)

;(async () => {
  const { isAuthenticated, emitStatus } = await sendMessage('popup-setup')
  setToggle(emitStatus)
  setView(isAuthenticated)
})();
