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

// TODO: Actually do something
// TODO: Disabled while saving?
function toggleSendStatus () {
  const isChecked = toggle.getAttribute('aria-checked')
  const newValue = isChecked === 'false'
  // TODO: Should we be removing the attribute instead of setting it to true?
  toggle.setAttribute('aria-checked', newValue)
}

function setView ({ isAuthenticated = false }) {
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
toggle.addEventListener('click', toggleSendStatus)

addListener('popup-set-view', setView)

;(async () => {
  const response = await sendMessage('popup-check-auth')
  setView(response)
})();
