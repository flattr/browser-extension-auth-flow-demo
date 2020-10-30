> This is a WIP and it's likely that the FlattrExt API will change before if goes live.

# Extension demo
Demonstration extension for auth flow setup

## Token acquisition

![Auth flow chart](assets/auth-flow.png?raw=true "Auth flow chart")

1. The extension opens `https://flattr.com/oauth/ext` in the browser
2. The user is guided through the auth flow for creating the token
3. The auth page emits `flattr-token` once accepted
4. The extension stores the included payload from the `flattr-token` event

### Payload example
Auth flow example:

Flattr emit
```js
document.dispatchEvent(new CustomEvent('flattr-trigger'))
```

Extension emit
```js
document.dispatchEvent(new CustomEvent('flattr-authenticate'))
```

Flattr emit
```js
document.dispatchEvent(new CustomEvent('flattr-token', { detail: payload }))
```

Extension handle then emit
```js
document.addEventListener('flattr-token', event => { 
  // Save data in event.detail.payload

  // Emit response
  document.dispatchEvent(new CustomEvent('flattr-authenticated', { detail: { authenticated: true } }))
})
```


A successful `flattr-token` payload will look like this:
```json5
{
  accessToken: 'abc123',
  subscription: {
    active: true
  }
}
```

### Fetching the subscription status

The payload delivered with the `flattr-token` event contains information
about the authenticated users subscription status. A user with an active subscription will have `subscription: { active: true } }` in the payload as well as an `accessToken`.

The extension should then continue to fetch the shareable subscription status payload from the [API](../api/README.md).

## FlattrExt API
The extension provides access to a [payload](../publisher-website/README.md#payload) that can be used to verify that the visitor is a paying Flattr user.
