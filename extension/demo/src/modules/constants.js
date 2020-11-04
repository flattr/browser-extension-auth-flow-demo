'use strict'

const env = process.env.TARGET_ENV

export const API_BASE = env === 'production' ? 'https://flattr.com' : 'http://flattr.test'
export const STORAGE_KEY_ACCESS_TOKEN = 'accessToken'
export const STORAGE_KEY_SUBSCRIPTION = 'subscription'
export const STORAGE_KEY_EMIT_STATUS = 'emitStatus'
