'use strict'

const env = process.env.TARGET_ENV

export const STORAGE_KEY = 'auth'
export const API_BASE = env === 'production' ? 'https://flattr.com' : 'http://flattr.test'
