export function fetchPayload () {
  fetch(
    `${API_BASE}/rest/v2/subscription-status`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
}
