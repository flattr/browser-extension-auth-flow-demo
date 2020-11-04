'use strict'

const env = process.env.TARGET_ENV

export const ACCESS_TOKEN = 'accessToken'
export const SUBSCRIPTION = 'subscription'
export const PAYLOAD = 'payload'
export const TTL = 'expiresAt'
export const API_BASE = env === 'production' ? 'https://flattr.com' : 'http://flattr.test'
