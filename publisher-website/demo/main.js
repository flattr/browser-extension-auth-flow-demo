'use strict'

const examplePublicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5Ey6dSJ0rKUJ0K/+kguEPSNHnH8FekBq5DC5U3pka6qoGkuRuzpVApp6bQ8Ks/ZTAH2yHoGe3SrP4HJo1JJ/KJH4+q3f0oW8zKXonpGAOHZ5SOasFHWj5rNdEwVsBT2mGMvKjVcx6m736KRSPfv4Ufx9eoFmll2AgG9Xmq3vUU/LWQSWgwZtJdBAE2k22JsI9S8eQYpAyg89d/81gM7W+WUR7xmAaTnigdV5Xj0NrPlUm/qh01NNY1gKbxiPdz54/vy5Govf8I9R/FBHewlqPHXFIaZsb2QZ+4LHk7LlEW+H47HU2krtamu+a182nwBSIJnlzDXi0nhul6H6pVzQcwIDAQAB-----END PUBLIC KEY-----'

const algorithm = {
  name: 'RSASSA-PKCS1-v1_5',
  hash: {
    name: 'SHA-256' // or SHA-512
  }
}

/**
 * Take a public key in a PEM format and convert it to an array buffer
 */
const pemToArrayBuffer = function (pem) {
  // cleanKey should be a raw base64 string
  const cleanKey = pem.replace(/\n|-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, '')

  return toArrayBuffer(window.atob(cleanKey));
}

const toArrayBuffer = function (data) {
  const buffer = new ArrayBuffer(data.length)
  let bytes = new Uint8Array(buffer)

  for (let i = 0; i < data.length; i++) {
    bytes[i] = data.charCodeAt(i)
  }

  return bytes
}

const verifyPayload = async function (payload) {
  const [data, signature] = payload.split('.')

  const importedKey = await window.crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(examplePublicKey),
    algorithm,
    false,
    ['verify']
  )

  const isValid = await window.crypto.subtle.verify(
    algorithm,
    importedKey,
    toArrayBuffer(window.atob(signature)),
    toArrayBuffer(data)
  )

  const parsedData = JSON.parse(window.atob(data))

  return {
    isValid,
    isPaying: false,
    expiresAt: null,
    ...parsedData
  }
}

const messageEl = document.getElementById('message')

let timer = null
let tries = 0

// TODO: Request a real payload from the extension and only verify if it is returned
// TODO: We need a better way to wait for the extension to be ready
const init = () => {
  let message = 'No Flattr extension detected. ☹️'

  if (tries > 10) {
    messageEl.innerText = message
    return
  }
  
  // If we don't get a response we try again
  timer = setTimeout(init, 1000)
  tries++;

  const trigger = new Event('flattr-request-payload')
  document.dispatchEvent(trigger)

  document.addEventListener('flattr-payload', async ({ detail: { payload } }) => {
    clearTimeout(timer)

    const {
      isValid,
      isPaying,
      expiresAt
    } = await verifyPayload(payload)

    message = 'No Flattr user detected. 🤕'

    // TODO: Check that expiresAt isn't before current time?
    if (isValid && isPaying) {
      message = 'Paying Flattr user detected! 🎉'
    } else if (!isValid && isPaying) {
      message = 'Payload was invalid. 🤐'
    } else if (isValid && !isPaying) {
      message = 'Non-paying Flattr user detected! 🤨'
    }

    messageEl.innerText = message
    console.table({
      isValid,
      isPaying,
      expiresAt
    })
  })
}

init()
