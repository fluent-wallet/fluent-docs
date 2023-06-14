---
title: React
---

# Use JS-CONFLUX-SDK with React

You can import JS-CONFLUX-SDK into your React dapp to enable your users to easily connect with their
Fluent wallet.
The SDK for React [works the same way](index.md#how-it-works) and has the
[same prerequisites](index.md#prerequisites) as for standard JavaScript.

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

Instantiate the SDK using any [options](../../../reference/sdk-js-options.md):

```javascript
const cfxClient=new Conflux();
cfxClient.provider=ethereum;// Actually,it is the window.ethereum injected by Fluent Wallet. You can also access via window.ethereum
ethereum.on('chainChanged', cfxClient.updateNetworkId); 
```

### 4. Use the SDK

Use the SDK by calling any [provider API methods](../../../reference/provider-api.md).
Always call [`eth_requestAccounts`](../../../reference/rpc-api.md#eth_requestaccounts) using
[`provider.request()`](../../../reference/provider-api.md#windowconfluxrequestargs) first, since it
prompts the installation or connection popup to appear.

```javascript
cfxClient.provider.request({ method: 'eth_requestAccounts', params: [] });
```
