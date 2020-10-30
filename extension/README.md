# Extension demo
Demonstration extension for auth flow setup

## Token acquisition

![Auth flow chart](https://github.com/flattr/browser-extension-auth-flow-documentation/blob/main/assets/auth-flow.png?raw=true "Auth flow chart")

1. The extension opens `https://flattr.com/oauth/ext` in the browser
2. The user is guided through the auth flow for creating the token
3. The auth page emits `flattr-token` once accepted
4. The extension stores the included payload from the `flattr-token` event

### Payload example
Event handling example:
```js
document.addEventListener('event-name', event => { 
  // handle event.detail.payload
})
document.dispatchEvent(new CustomEvent('event-name', { detail: payload }))
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

## FlattrExt API
The extension exposes the FlattrExt object for payload requests

```js
if (FlattrExt !== undefined) {
  const payload = await FlattrExt.isPayingUser()
  
  // Decode payload logic here
}
```

## Success!
![Success kid](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.hKY8epH2DA0lUc8jRqUQmgHaEK%26pid%3DApi&f=1)
