'use strict'

const storageKey = 'auth'

const isNotAuthorized = document.getElementById('is-not-authorized')
const button = document.getElementById('auth-button')
const link = document.getElementById('manage-link')

const isAuthorized = document.getElementById('is-authorized')
const toggle = document.getElementById('toggle')

function init () {
  chrome.runtime.onMessage.addListener(
    function (request) {
      if (!request || !request.hasOwnProperty(authenticated)) return
  
      const { authenticated } = request
  
      if (authenticated) {
        showAuthorized()
      } else {
        showNotAuthorized()
      }
    }
  )

  chrome.storage.local.get(
    [storageKey],
    result => {
      if (!result[storageKey]) {
        showNotAuthorized()
      } else {
        showAuthorized()
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

function showAuthorized () {
  isAuthorized.style.display = 'block'
  isNotAuthorized.style.display = 'none'
}

function showNotAuthorized () {
  isNotAuthorized.style.display = 'block'
  isAuthorized.style.display = 'none'
}

// TODO: Actually do something
// TODO: Disabled while saving?
function toggleSendStatus () {
  const isChecked = toggle.getAttribute('aria-checked')
  const newValue = isChecked === 'false'
  // TODO: Should we be removing the attribute instead of setting it to true?
  toggle.setAttribute('aria-checked', newValue)
}

button.addEventListener('click', triggerAuth)
link.addEventListener('click', openAppsTab)
toggle.addEventListener('click', toggleSendStatus)

init()
