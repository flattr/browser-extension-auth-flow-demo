'use strict'

const env = process.env.TARGET_ENV

export const ACCESS_TOKEN = 'accessToken'
export const SUBSCRIPTION = 'subscription'
export const IS_PAYING = 'isPaying'
export const PAYLOAD = 'payload'
export const TTL = 'expiresAt'
const apiDomain = env === 'production' ? 'flattr.com' : 'flattr.test'
const apiProtocol = env === 'production' ? 'https' : 'http'
export const API_BASE = `${apiProtocol}://api.${apiDomain}`
export const API_BASE_WEB = `${apiProtocol}://${apiDomain}`
