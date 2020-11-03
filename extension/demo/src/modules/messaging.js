'use strict'

export function addListener (key, callback = () => {}) {
  chrome.runtime.onMessage.addListener(async (request, _, sendResponse) => {
    if (!request) return
    const { key: requestKey, data = {} } = request

    if (requestKey === key) {
      const response = await callback(data)
      sendResponse(response)
      return true
    }
  })
}

export function sendMessage (key, data, callback = () => {}) {
  const payload = {
    key,
    data
  }
  chrome.runtime.sendMessage(payload, callback)
}
