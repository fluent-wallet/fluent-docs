# Use JS-CONFLUX-SDK  with JavaScript

You can import JS-CONFLUX-SDK into your JavaScript dapp to enable your users to easily connect
with a Fluent wallet client.
The following instructions work for web dapps based on standard JavaScript.
You can also see instructions for the following JavaScript-based platforms:

- [React](react.md)
- [Pure JavaScript](pure-js.md)
- [Other web frameworks](other-web-frameworks.md)


## How it works

<!--tabs-->

# Desktop browser

When a user accesses your JavaScript web dapp on a desktop browser and doesn't have the Fluent Wallet
extension installed, a popup appears that prompts the user to install the Fluent Wallet extension 

![SDK desktop browser example](../../../assets/sdk-desktop-browser.gif)

<!--/tabs-->

You can try the
[hosted test dapp with the SDK installed](https://c0f4f41c-2f55-4863-921b-sdk-docs.github.io/test-dapp-2/).

## Prerequisites

- An existing or [new project](../../../get-started/set-up-dev-environment.md) set up.
- [Yarn](https://yarnpkg.com/getting-started/install) or
  [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Steps

### 1. Install the SDK

In your project directory, install the SDK using Yarn or npm:

```bash
yarn add js-conflux-sdk
or
npm i js-conflux-sdk
```

### 2. Import the SDK

In your project script, add the following to import the SDK:

```javascript
import { Conflux } from 'js-conflux-sdk';
```

### 3. Instantiate the SDK

```javascript
const cfxClient=new Conflux();
cfxClient.provider=ethereum;// Actually,it is the window.conflux injected by Fluent Wallet. You can also access via window.ethereum
ethereum.on('chainChanged', cfxClient.updateNetworkId); 
```

### 4. Use the SDK

Use the SDK by calling any [provider API methods](../../../reference/provider-api.md).
Always call [`eth_requestAccounts`](../../../reference/rpc-api.md#eth_requestaccounts) using
[`provider.request()`](../../../reference/provider-api.md#windowethereumrequestargs) first, since it
prompts the installation or connection popup to appear.

```javascript
cfxClient.provider.request({ method: 'eth_requestAccounts', params: [] });
```
