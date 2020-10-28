# API demo
WIP: Include info about how it works here.

## fetching the subscription status of the authenticated user


	curl \
	  -H "Accept: application/json" \
	  https://api.flattr.com/rest/v2/subscription-status

Fetching this endpoint will return an object with the authenticated user's subscription status. The returned JSON has 3 parts, paying, expires_at and payload.

* paying: a boolean value that is true when the user has an active subscription.
* expires_at: The time at which this payload will have to be renewed. The extension should make sure to update this payload shortly after the expire time.
* payload: a cryptographically signed and encoded string intended to be shared with third parties.

**Response**
	
	HTTP/1.1 200 OK
	Content-Type: application/json;charset=utf-8
	
	{
	  "paying": true,
     "expires_at": 1603888902,
	  "payload": "Gwx7MU+Nmh4tBVhhGeoXjoWOQXrsgqTWgMI+QwuWrWfF0aJ4OAMB5zyJKpA9+pTTGJzP6rVEzZw"
	}
	
A user with no active subscription returns a slightly less populated result.

	HTTP/1.1 200 OK
	Content-Type: application/json;charset=utf-8

	{
	  "paying": false
	}
	