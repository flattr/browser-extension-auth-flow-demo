'use strict'
import { API_BASE } from './constants'

export function fetchSubscriptionStatus (accessToken) {
  return fetch(
    `${API_BASE}/rest/v2/subscription-status`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  ).then(response => response.json())
}
