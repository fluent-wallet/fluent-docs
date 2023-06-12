---
description: Fluent Conflux provider API reference
---

# Conflux provider API

Fluent injects a global JavaScript API into websites visited by its users using the
`window.conflux` provider object.
This API allows websites to request users' Conflux accounts, read data from blockchains the user is
connected to, and suggest that the user sign messages and transactions.

You can use the provider [properties](#properties), [methods](#methods), and [events](#events) in
your dapp.
Get started by [setting up your development environment](../get-started/set-up-dev-environment.md).

## Properties

### window.conflux.isFluent

This property is `true` if the user has Fluent installed.

:::note
This property is non-standard.
Non-Fluent providers may also set this property to `true`.
:::

## Methods

### window.conflux.isConnected()

```typescript
window.conflux.isConnected(): boolean;
```

Returns `true` if the provider is connected to the current chain.

If the provider isn't connected, the page must be reloaded to re-establish the connection.
See the [`connect`](#connect) and [`disconnect`](#disconnect) events for more information.

:::note
This method is unrelated to [accessing a user's accounts](../get-started/access-accounts.md).
In the provider interface, "connected" and "disconnected" refer to whether the provider can make RPC
requests to the current chain.
:::

### window.conflux.request(args)

```typescript
interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

window.conflux.request(args: RequestArguments): Promise<unknown>;
```

Use this method to submit [RPC API](rpc-api.md) requests to Conflux using Fluent Wallet.
It returns a promise that resolves to the result of the RPC method call.

The parameters and return value vary by RPC method.
In practice, if a method has parameters, they're almost always of type `Array<any>`.

If the request fails, the promise rejects with an [error](#errors).

The following is an example of using `window.conflux.request(args)` to call
[`cfx_sendTransaction`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc/#cfx_sendtransaction):

```javascript
params: [
  {
    from: 'cfx:aana7ds0dvsxftyanc727snuu6husj3vmyc3f1ay93',
    to: 'cfx:aana7ds0dvsxftyanc727snuu6husj3vmyc3f1ay93',
    gas: '0x5208', // 21000
    gasPrice: '0x7530', // 30000
    value: '0x1'
  },
];


window.conflux
  .request({
    method: 'cfx_sendTransaction',
    params,
  })
  .then((result) => {
    // The result varies by RPC method.
    // For example, this method returns a transaction hash hexadecimal string upon success.
  })
  .catch((error) => {
    // If the request fails, the Promise rejects with an error.
  });
```

## Events

The Fluent provider emits events using the Node.js
[`EventEmitter`](https://nodejs.org/api/events.html) API.
The following is an example of listening to the [`accountsChanged`](#accountschanged) event.
You should remove listeners once you're done listening to an event (for example, on component
unmount in React).

```javascript
function handleAccountsChanged(accounts) {
  // Handle new accounts, or lack thereof.
}

window.conflux.on('accountsChanged', handleAccountsChanged);

// Later

window.conflux.removeListener('accountsChanged', handleAccountsChanged);
```

The first argument of `window.conflux.removeListener` is the event name, and the second argument is
a reference to the function passed to `window.conflux.on` for the event.

### accountsChanged

```typescript
window.conflux.on('accountsChanged', handler: (accounts: Array<string>) => void);
```

The provider emits this event when the return value of the
[`cfx_accounts`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc/#cfx_accounts) RPC
method changes.
`cfx_accounts` returns either an empty array, or an array that contains the address of the most
recently used account the caller is permitted to access.
Callers are identified by their URL origin, which means that all sites with the same origin share
the same permissions.

This means that the provider emits `accountsChanged` when the user's exposed account address changes.
Listen to this event to [handle accounts](../get-started/access-accounts.md#handle-accounts).

### chainChanged

```typescript
window.conflux.on('chainChanged', handler: (chainId: string) => void);
```

The provider emits this event when the currently connected chain changes.
Listen to this event to [detect a user's network](../get-started/detect-network.md).

:::caution important

We strongly recommend reloading the page upon chain changes, unless you have a good reason not to:

```javascript
window.conflux.on('chainChanged', (chainId) => window.location.reload());
```

:::

### connect

```typescript
interface ConnectInfo {
  chainId: string;
}

window.conflux.on('connect', handler: (connectInfo: ConnectInfo) => void);
```

The provider emits this event when it's first able to submit RPC requests to a chain.
We recommend listening to this event and using the
[`window.conflux.isConnected()`](#windowethereumisconnected) provider method to determine when
the provider is connected.

### disconnect

```typescript
ethereum.on('disconnect', handler: (error: ProviderRpcError) => void);
```

The provider emits this event if it becomes unable to submit RPC requests to a chain.
In general, this only happens due to network connectivity issues or some unforeseen error.

When the provider emits this event, it doesn't accept new requests until the connection to the chain
is re-established, which requires reloading the page.
You can also use the [`window.conflux.isConnected()`](#windowethereumisconnected) provider method
to determine if the provider is disconnected.

### message

```typescript
interface ProviderMessage {
  type: string;
  data: unknown;
}

window.conflux.on('message', handler: (message: ProviderMessage) => void);
```

The provider emits this event when it receives a message that the user should be notified of.
The `type` property identifies the kind of message.


## Errors

All errors returned by the Fluent provider follow this interface:

```typescript
interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
```

The [`window.conflux.request(args)`](#windowethereumrequestargs) provider method throws errors
eagerly.
You can use the error `code` property to determine why the request failed.
Common codes and their meaning include:

- `4001` - The request is rejected by the user.
- `-32602` - The parameters are invalid.
- `-32603` - Internal error.

For the complete list of errors, see [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193#provider-errors)
and [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474#error-codes).

:::tip
The [`json-rpc-errors`](https://www.npmjs.com/package/@fluent-wallet/json-rpc-error) package implements all RPC errors
returned by the Fluent provider, and can help you identify their meaning.
:::
