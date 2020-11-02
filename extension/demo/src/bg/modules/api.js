export function fetchPayload (accessToken) {
  return fetch(
    `${API_BASE}/rest/v2/subscription-status`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
}
