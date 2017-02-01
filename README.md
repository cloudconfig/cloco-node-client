<p align="center">
  <img src="https://raw.githubusercontent.com/cloudconfig/cloco-docs/master/source/images/logo.png" width="100" height="104" />
</p>

# cloco-node-client

A cloco client for distribution as an NPM package, for incorporating into NodeJS applications.  

## Prerequisites

The following global prerequisites must exist:

- node: >=6.9.1
- npm: >=3.10.8
- a cloco account (see [https://www.cloco.io](https://www.cloco.io))

This client compiles into ES6 for server-side use, and has not currently been tested with client-side applications.  The client makes use of local storage for offline caching, using the logged on user's profile for this.

This product has been tested on Linux.  It may work on Windows but is not currently supported or tested.

# Building the cloco client into your app

If you want to download test the client locally, you can do this by following theses steps.  First, install the client via NPM:

`npm install cloco-node-client --save`

Reference the client:

`var cloco = require('cloco-node-client');`

Instantiate the client:

````
// set up a bunyan logger if you want to set custom logging.
var logger = bunyan.createLogger({name: 'cloco-node-client'});

// cloco initialization options.  See below for the full list of options.
var options = {
  application: 'cloco-cafe',
  cacheCheckInterval: 5000,
  credentials: {key: "<my-client-key>", secret: "<my-client-secret>"},
  encryptor: encryptor,
  environment: 'dev',
  log: logger,
  subscription: "my-subscription",
  ttl: 60,
  useDiskCaching: true | false
};

// instantiate the client and subscribe to the menu.
var client = cloco.createClient(options);
````

# Options

The options object you pass into cloco.

Parameter | Description | Usage
--------- | ----------- | -----
application | The ID of the cloco application. | Optional, but if not supplied this will be taken from the machine default (set via [cloco-bash](https://github.com/cloudconfig/cloco-bash)).
cacheCheckInterval | The time in milliseconds between checking for expired configuration in the cache. | Optional, defaults to 5000ms.
credentials | The credentials to use to access cloco. | Optional, but if not supplied will use the machine credentials.  See Credentials section below.
encryptor | The encryption algorithm. | Optional, by default this will be a passthrough encryptor (i.e. will not encrypt).  See Encryption section below for more information.
environment | The deployment environment. | Optional, but if not supplied will use the machine default.
log | The log provider. | Optional.  Defaults to a new bunyan.Logger with basic settings.  See Logging section for more information.
subscription | The name of your cloco subscription.  | Optional, but if not supplied will use the machine default.
ttl | The time in seconds for items to live in the cache before refreshing. | Optional, if not supplied then cache items will never expire.
url | The cloco API url. | Optional.  Will default to the public hosted cloco API.  Use this to override for on-premise installations of cloco.
useDiskCaching | Indicates whether disk caching is used. | Optional.  Will default to false.  When set to true any information received from the API will be copied to disk, and will be loaded from disk on app start if the API cannot be contacted.

## Credentials

We recommend that you authorize your machine using the cloco-bash tool, but you can set the cloco credentials via the options.  You can generate API credentials via the cloco admin UI or via the API.  Please ensure that the credentials are kept safe.

````
// initialize the credentials if supplied via environment variables.
if (process.env.CLOCO_CLIENT_KEY && process.env.CLOCO_CLIENT_SECRET) {
  options.credentials = { key: process.env.CLOCO_CLIENT_KEY, secret: process.env.CLOCO_CLIENT_SECRET };
}
````

## Encryption

The cloco client currently supports 2 different encryption providers:

- Passthrough
- AES

If no encryption provider is supplied then the default will be passthrough, i.e. your configuration will be serialized with no encryption.

To use the AES encryption algorithm, you must supply an encryption key / secret.

`options.encryptor = cloco.createAesEncryptor("my-encryption-key");`

To roll your own encryption algorithm, create an encryptor that conforms to the following interface:

````
export interface IEncryptor {

  /**
   * Encrypts the given string into a string.
   * @type {string}
   */
  encrypt(data: string): string;

  /**
   * Decrypts the given string.
   * @param  {string} encrypted The encrypted data.
   * @return {string}           The decrypted data.
   */
  decrypt(encrypted: string): string;

}
````

## Logging

Note:  This client makes use of the bunyan logger.  Please check out the documentation for bunyan on NPM [https://www.npmjs.com/package/bunyan](https://www.npmjs.com/package/bunyan).  This is a flexible logging package, and you can configure the logger to your own needs. If you do not supply a logger, cloco will create a default logger that will trace info and above to StdOut.  You can reference bunyan by installing from NPM:

`npm install bunyan --save`

Alternatively, you can supply your own logger (or wrap an alternative logger) as long as the same interface is provided.

# Example application

An example application using the cloco node client is available on GitHub, [cloco-node-example](https://github.com/cloudconfig/cloco-node-example).  Please download the project and follow the instructions in the README to get started.  

This example uses an Express application, with "before cloco" and "after cloco" example websites.

# Building and testing locally

## Install & build

First, clone the repo from GitHub:

`git clone https://github.com/cloudconfig/cloco-node-client.git`

Navigate to the folder:

`cd cloco-node-client`

Install the dependencies from NPM:

`npm install`

Build the client:

`npm run build`

## Test

Run the unit tests with jasmine:

`npm run test`

# Version Notes
- `0.1.0` Initial version, supports read-only access to a configuration object.
- `0.1.1` Minor fixes.
- `0.1.2` Fixes to allow the code to work with cloco-node-example.
- `0.1.3` Clean up of build files, removes final console.logs.
- `0.2.0` Major breaking rebuild.  Aligns with V1.0.0 cloco API.
- `0.3.0` Non-breaking update, aligns AES encryption with openssl.
- `0.3.1` Non-breaking update, additional test coverage and small fixes.

# License
Copyright (c) 2016 345 Systems LLP
Licensed under the MIT license.
