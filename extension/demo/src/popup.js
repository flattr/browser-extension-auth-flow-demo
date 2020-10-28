'use strict'

const storageKey = 'auth'

const button = document.getElementById('auth-button')
const message = document.getElementById('auth-message')
const link = document.getElementById('manage-link')

function init () {
  chrome.runtime.onMessage.addListener(
    function (request) {
      if (!request || !request.hasOwnProperty(authenticated)) return
  
      const { authenticated } = request
  
      if (authenticated) {
        showMessage()
      } else {
        showButton()
      }
    }
  )

  chrome.storage.local.get(
    [storageKey],
    result => {
      if (!result[storageKey]) {
        showButton()
      } else {
        showMessage()
      }
    }
  )
}

function triggerAuth () {
  chrome.storage.local.get(
    [storageKey],
    result => {
      if (!result[storageKey]) {
        openAuthTab()
      }
    }
  )
}

function openAuthTab () {
  chrome.tabs.create({
    url: 'https://flattr.com/oauth/ext',
    active: true
  })
}

function openAppsTab () {
  chrome.tabs.create({
    url: 'https://flattr.com/apps',
    active: true
  })
}

function showMessage () {
  message.style.display = 'block'
  button.style.display = 'none'
}

function showButton () {
  button.style.display = 'block'
  message.style.display = 'none'
}

button.addEventListener('click', triggerAuth)
link.addEventListener('click', openAppsTab)

init()
