# API

> This is a WIP and it's likely that the API URL will change before this goes live.

## Authorization

Authentication is required in order to gain access to private data, for this we use OAuth 2. OAuth 2 relies on separate standards for the access tokens - we currently use Bearer tokens which are the simplest and most widespread token type.

See the [extension documentation](../extension/README.md) for how to aquire an access token.

### Including the access token in requests

The access token must be added to the request header.

    Authorization: Bearer 8843d7f92416211de9ebb963ff4ce28125932878

Example:

    curl \
      -H "Accept: application/json" \
      -H "Authorization: Bearer {token}"

## Fetching the subscription status of the authenticated user


    curl \
      -H "Accept: application/json" \
      https://api.flattr.com/rest/v2/subscription-status

Fetching this endpoint will return an object with the authenticated user's subscription status. The returned JSON has 3 parts, isPaying, expiresAt and payload.

* `isPaying`: a boolean value that is true when the user has an active subscription.
* `expiresAt`: The time, as a [unix timestamp](https://en.wikipedia.org/wiki/Unix_time), at which this payload will have to be renewed. The extension should make sure to update this payload shortly after the expire time.
* `payload`: a cryptographically signed and encoded string intended to be shared with third parties. The [payload](../publisher-website/README.md) is described in detail in the [client documentation](../publisher-website/README.md).

**Response**

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=utf-8

    {
      "isPaying": true,
      "expiresAt": 1603888902,
      "payload": "Gwx7MU+Nmh4tBVhhGeoXjoWOQXrsgqTWgMI+QwuWrWfF0aJ4OAMB5zyJKpA9+pTTGJzP6rVEzZw"
    }

A user with no active subscription returns a slightly less populated result.

    HTTP/1.1 200 OK
    Content-Type: application/json;charset=utf-8

    {
      "isPaying": false,
      "expiresAt": null,
      "payload": null
    }
