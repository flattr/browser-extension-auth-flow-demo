'use strict'

import { API_BASE } from './constants'

export async function fetchSubscriptionStatus (accessToken) {
  const response = await fetch(
    `${API_BASE}/rest/v2/subscription-status`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
  return response.json()
}
