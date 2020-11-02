> This is a WIP and it's likely that the FlattrExt API will change before if goes live.

# Extension demo
Demonstration extension for auth flow setup

## Token acquisition

![Auth flow chart](assets/auth-flow.png?raw=true "Auth flow chart")

### Step-by-step
> These examples are abbreviated for readability. A fully working example can be found in the [demo extension](./demo)

#### 1. Initiate authentication process
The extension initiates the authentication process (if the extension is not already authenticated) by opening flattr.com/oauth/ext in a new browser tab. Ideally triggered by a button in the extension popup.

```javascript
// Background script
chrome.storage.local.get(
  'accessToken',
  result => {
    if (!result) {
      chrome.tabs.create({ url: 'https://flattr.com/oauth/ext', active: true })
    }
  }
)
```

#### 2. User accepts authentication prompt
User has accepted the prompt, website sends the event `flattr-trigger`. The event payload (`event.detail`) looks like this:
```javascript
{
  action: 'authentication'
}
```

The extension then acknowledges this and responds with the event `flattr-authenticate` to ask the website to initiate the request.

```javascript
// Content script
document.addEventListener('flattr-trigger', event => {
  if (event.detail.action !== 'authentication') return
  // No data needs to be sent here so we can send a regular `Event`
  document.dispatchEvent(
    new Event('flattr-authenticate')
  )
})
```

#### 3. Authentication request is sent
The website initiates the actual authentication request and sends the `flattr-token` event to the extension if the request is successful.

The payload for this event (`event.detail`) looks like this:

```javascript
{
  accessToken: 'xyz', // Access token to be saved by the extension
  subscription: {
    active: true // Whether the user has an active Flattr subscription (is a paying user)
  }
}
```

Lastly, the extension responds with the event `flattr-authenticated`. The event payload here should indicate whether the authentication has worked correctly and the token has been saved.

```javascript
// Content script
document.addEventListener('flattr-token', event => {
  const { accessToken, subscription } = event.detail
  
  chrome.storage.local.set({
    accessToken,
    subscription
  }, () => {
    document.dispatchEvent(
      new CustomEvent('flattr-authenticated', {
        detail: {
          authenticated: !chrome.runtime.lastError
        }
      })
    )
  })
})
```
### Fetching the subscription status

The payload delivered with the `flattr-token` event contains information
about the authenticated users subscription status. A user with an active subscription will have `subscription: { active: true } }` in the payload as well as an `accessToken`.

The extension should then continue to fetch the shareable subscription status payload from the [API](../api/README.md).

## FlattrExt API
The extension provides access to a [payload](../publisher-website/README.md#payload) that can be used to verify that the visitor is a paying Flattr user.
