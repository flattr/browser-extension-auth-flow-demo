'use strict'

const env = process.env.TARGET_ENV

const apiDomain = env === 'production' ? 'flattr.com' : 'flattr.test'
const apiProtocol = env === 'production' ? 'https' : 'http'
export const API_BASE = `${apiProtocol}://api.${apiDomain}`
export const API_BASE_WEB = `${apiProtocol}://${apiDomain}`

export const STORAGE_KEY_ACCESS_TOKEN = 'accessToken'
export const STORAGE_KEY_SUBSCRIPTION = 'subscription'
export const STORAGE_KEY_EMIT_STATUS = 'emitStatus'
export const STORAGE_KEY_PAYLOAD = 'payload'
export const STORAGE_KEY_TTL = 'expiresAt'
