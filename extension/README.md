> This is a WIP and it's likely that the FlattrExt API will change before if goes live.

# Extension demo
Demonstration extension for auth flow setup

## Token acquisition

![Auth flow chart](https://github.com/flattr/browser-extension-auth-flow-documentation/blob/main/assets/auth-flow.png?raw=true "Auth flow chart")

1. The extension opens `https://flattr.com/oauth/ext` in the browser
2. The user is guided through the auth flow for creating the token
3. The auth page emits `flattr-token` once accepted
4. The extension stores the included payload from the `flattr-token` event

### Payload example
Token event example:

From page
```js
document.dispatchEvent(new CustomEvent('flattr-token', { detail: payload }))
```

In extension
```js
document.addEventListener('flattr-token', event => { 
  // Save data in event.detail.payload

  // Emit response
  document.dispatchEvent(new CustomEvent('flattr-authenticated'))
})
```


A successful `flattr-token` payload will look like this:
```json5
{
  accessToken: 'abc123'
}
```

## FlattrExt API
The extension provides access to a [payload](../publisher-website/README.md#payload) that can be used to verify that the visitor is a paying Flattr user.
