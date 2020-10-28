'use strict'

const examplePublicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5Ey6dSJ0rKUJ0K/+kguEPSNHnH8FekBq5DC5U3pka6qoGkuRuzpVApp6bQ8Ks/ZTAH2yHoGe3SrP4HJo1JJ/KJH4+q3f0oW8zKXonpGAOHZ5SOasFHWj5rNdEwVsBT2mGMvKjVcx6m736KRSPfv4Ufx9eoFmll2AgG9Xmq3vUU/LWQSWgwZtJdBAE2k22JsI9S8eQYpAyg89d/81gM7W+WUR7xmAaTnigdV5Xj0NrPlUm/qh01NNY1gKbxiPdz54/vy5Govf8I9R/FBHewlqPHXFIaZsb2QZ+4LHk7LlEW+H47HU2krtamu+a182nwBSIJnlzDXi0nhul6H6pVzQcwIDAQAB-----END PUBLIC KEY-----'
const examplePayload = 'eyJwYXlpbmciOnRydWUsInRzIjoxNjAzODczODMxfQ.p6V9Kt6nA8l7Bl656ZT4Y33OblczVkcufIQMAsDcLvBfsbvS5G26+OVA1J2Ltt7sKibiTkiY6WQL9m6/8awF+4aSL//fKc8Lh3kocJN4Hx0fBffH3PWtheCOPFpkFgndJF/Sk2lsscTMEp7mxXqVL3uTaHkbeUihL8c0miMRVbQ1zDyfyBQ611TNlvXaRQvy87OB1a9ytLSROv474crlTtDVVjVuW68keiIvJtGky5DVTGTn1F+Kac5ELBrWE1nUOmiLBVft5yAi40ZaOmSMiwyhFJRsb+VmPjncCjwBbEeHyw7Xx7q39/OPGSsVwNEAQ4K3XxDCTYFl380m+dDAcw'

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

  return keyToArrayBuffer(cleanKey);
}

const keyToArrayBuffer = function (rawKey) {
  const decoded = window.atob(rawKey)
  const buffer = new ArrayBuffer(decoded.length)
  let bytes = new Uint8Array(buffer)

  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i)
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
    keyToArrayBuffer(signature),
    keyToArrayBuffer(data)
  )

  const parsedData = JSON.parse(window.atob(data))

  return {
    isValid,
    data: parsedData
  }
}

;(async () => {
  const results = await verifyPayload(examplePayload)
  console.table(results)
})()
