'use strict'

const examplePublicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5Ey6dSJ0rKUJ0K/+kguEPSNHnH8FekBq5DC5U3pka6qoGkuRuzpVApp6bQ8Ks/ZTAH2yHoGe3SrP4HJo1JJ/KJH4+q3f0oW8zKXonpGAOHZ5SOasFHWj5rNdEwVsBT2mGMvKjVcx6m736KRSPfv4Ufx9eoFmll2AgG9Xmq3vUU/LWQSWgwZtJdBAE2k22JsI9S8eQYpAyg89d/81gM7W+WUR7xmAaTnigdV5Xj0NrPlUm/qh01NNY1gKbxiPdz54/vy5Govf8I9R/FBHewlqPHXFIaZsb2QZ+4LHk7LlEW+H47HU2krtamu+a182nwBSIJnlzDXi0nhul6H6pVzQcwIDAQAB-----END PUBLIC KEY-----'
const examplePayload = 'eyJleHBpcmVzQXQiOjE2MDQ5MzUwMDIsImlzUGF5aW5nIjp0cnVlfQ.HWPa6JRnLFyB3J2/UwuPo0eAJg8Ncy1R/DRFlzpNa0FbdmsGMItRup9ONJmrGlZT5ByR6jGMljOP7SoC6cu073pXQPDSu6SOKPYprFLHbDZVf2T6m99AUnR9Db7NvtIhhzb2eRg9/QHfb6SaSIng0d5k+P9I18RVFCl7tAD4nw9Y4XMHOCWbXrcFuqqtWUtI663BVb98Asb8SIzbghBiuug6l9csiv8mAOYzwMpfFT/fjUa27aqBqroJsGv5gnqp/tVPZ2K5yWDd1Qc619ijg0tebTSw511i8zXRCBO6c3oOKp5ZkF8PuyIdU0Mbct9JjpRHgTXfU1+rh2g7fH96EQ'

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
    data: parsedData
  }
}

;(async () => {
  const results = await verifyPayload(examplePayload)
  console.table(results)
})()
