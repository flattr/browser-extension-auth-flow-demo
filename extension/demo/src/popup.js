'use strict'

import { addListener, sendMessage } from './modules/messaging'

const button = document.getElementById('auth-button')
const message = document.getElementById('auth-message')
const link = document.getElementById('manage-link')

function onButtonClick () {
  sendMessage('popup-trigger-auth')
}

function onLinkClick (event) {
  event.preventDefault()
  sendMessage('popup-open-apps')
}

function setView ({ isAuthenticated = false }) {
  if (!isAuthenticated) {
    button.style.display = 'block'
    message.style.display = 'none'
  } else {
    message.style.display = 'block'
    button.style.display = 'none'
  }
}

button.addEventListener('click', onButtonClick)
link.addEventListener('click', onLinkClick)

addListener('popup-set-view', setView)
sendMessage('popup-check-auth')
