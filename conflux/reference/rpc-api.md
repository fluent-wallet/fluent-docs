---
description: Fluent Conflux JSON-RPC API reference
---

# JSON-RPC API

Fluent uses the [`window.conflux.request(args)`](provider-api.md#windowconfluxrequestargs)
provider method to wrap a JSON-RPC API.
The API contains standard Conflux JSON-RPC API methods and Fluent-specific methods.


For more information on the standard Conflux RPC methods, see the
[Conflux RPC Methods](https://developer.confluxnetwork.org/conflux-doc/docs/json_rpc#json-rpc-methods).

:::note
All RPC method requests can return errors.
Make sure to handle errors for every call to
[`window.conflux.request(args)`](provider-api.md#windowconfluxrequestargs).
:::

## Restricted methods

Fluent introduced web3 wallet permissions in [EIP-2255](https://eips.ethereum.org/EIPS/eip-2255).
In this permissions system, each RPC method is restricted or unrestricted.
If a method is restricted, a dapp must request permission to call it using
[`wallet_requestPermssions`](#wallet_requestpermissions).
Under the hood, permissions are plain, JSON-compatible objects, with fields that are mostly used
internally by Fluent.


## Unrestricted methods

Unrestricted methods have no corresponding permission, but they might still rely on permissions to
succeed (for example, the signing methods require calling the restricted
[`cfx_accounts`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc#cfx_accounts) method),
or they might require confirmation by the user (for example,
[`wallet_addConfluxChain`](#wallet_addconfluxchain)).

The following are some Fluent-specific unrestricted methods.
For the full list of Fluent JSON-RPC API methods, see the
[Fluent API](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc).

### cfx_requestAccounts

Requests that the user provide an Conflux address to be identified by.
Use this method to [access a user's accounts](../get-started/access-accounts.md).

This method is specified by [EIP-1102](https://eips.ethereum.org/EIPS/eip-1102).

:::info
Internally, this method calls [`wallet_requestPermissions`](#wallet_requestpermissions) for
permission to call [`cfx_accounts`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc#cfx_accounts).
:::

#### Returns

If the user accepts the request, this method returns an array of a single Conflux
address string.
If they reject the request, this method rejects with a `4001` error.

#### Example

```javascript
document.getElementById('connectButton', connect);

function connect() {
  conflux
    .request({ method: 'cfx_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to Fluent .');
      } else {
        console.error(error);
      }
    });
}
```

### wallet_getPermissions

Gets the caller's current [permissions](#restricted-methods).

#### Returns

An array of the caller's permission objects.
If the caller has no permissions, the array is empty.

### wallet_requestPermissions

Requests [permissions](#restricted-methods) from the user.

The request causes a Fluent popup to appear.
You should only request permissions in response to a direct user action, such as a button click.


#### Parameters

An array containing the requested permission objects.

#### Returns

An array of the caller's permission objects.
If the user denies the request, a `4001` error is returned.

#### Example

```javascript
document.getElementById('requestPermissionsButton', requestPermissions);

function requestPermissions() {
  conflux
    .request({
      method: 'wallet_requestPermissions',
      params: [{ cfx_accounts: {} }],
    })
    .then((permissions) => {
      const accountsPermission = permissions.find(
        (permission) => permission.parentCapability === 'cfx_accounts'
      );
      if (accountsPermission) {
        console.log('cfx_accounts permission successfully requested!');
      }
    })
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Permissions needed to continue.');
      } else {
        console.error(error);
      }
    });
}
```

### wallet_addConfluxChain

Creates a confirmation asking the user to add the specified chain to Fluent.
The user may choose to switch to the chain once it has been added.

You should only call this method in response to a direct user action, such as a button click.

Fluent validates the parameters for this method, and rejects the request if any parameter is
incorrectly formatted.
Fluent also rejects the request if any of the following occurs:

- The RPC endpoint doesn't respond to RPC calls.
  :::note
  Calls are made from the extension's background page, not the foreground page.
  If you use an origin allowlist, they're blocked.
  :::
- The RPC endpoint returns a different chain ID when
  [`cfx_chainId`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc#cfx_chainid) is called.
- The chain ID corresponds to any default Fluent chains.

This method is specified by [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085).

#### Parameters

An array containing an object containing the following metadata about the chain to be added to Fluent :

- `chainId` - The chain ID as a `0x`-prefixed hexadecimal string.
- `chainName` - The name of the chain.
- `nativeCurrency` - An object containing:
  - `name` - The name of the currency.
  - `symbol` - The symbol of the currency, as a 2-6 character string.
  - `decimals` - The number of decimals of the currency.
    Currently only accepts `18`.
- `rpcUrls` - An array of RPC URL strings.
  At least one item is required, and only the first item is used.
- `blockExplorerUrls` (optional) - An array of block explorer URL strings.
  At least one item is required, and only the first item is used.
- `iconUrls` (optional, currently ignored) - An array of icon URL strings.

#### Returns

`null` if the request was successful, and an error otherwise.

#### Example

We recommend using this method with [`wallet_addConfluxChain`](#wallet_addconfluxchain):

```javascript
try {
  await conflux.request({
    method: 'wallet_switchConfluxChain',
    params: [{ chainId: '0xf00' }],
  });
} catch (switchError) {
  // This error code indicates that the chain has not been added to Fluent.
  if (switchError.code === 4902) {
    try {
      await conflux.request({
        method: 'wallet_addConfluxChain',
        params: [
          {
            chainId: '0xf00',
            chainName: '...',
            rpcUrls: ['https://...'] /* ... */,
          },
        ],
      });
    } catch (addError) {
      // handle "add" error
    }
  }
  // handle other "switch" errors
}
```

### wallet_switchConfluxChain

Creates a confirmation asking the user to switch to the chain with the specified chain ID.

You should only call this method in response to a direct user action, such as a button click.

Fluent rejects the request if any of the following occurs:

- The chain ID is malformed.
- The chain with the specified chain ID hasn't been added to Fluent.

This method is specified by [EIP-3326](https://ethereum-magicians.org/t/eip-3326-wallet-switchethereumchain).

#### Parameters

An array containing an object containing `chainId`, the chain ID as a `0x`-prefixed hexadecimal string.

#### Returns

`null` if the request was successful, and an error otherwise.

If the error code is `4902`, the requested chain hasn't been added by Fluent, and you must request
to add it using [`wallet_addConfluxChain`](#wallet_addconfluxchain).

#### Example

See the [`wallet_addConfluxChain`](#wallet_addconfluxchain) example.

### wallet_watchAsset

Requests that the user track the specified token in Fluent .

Most Conflux wallets support some set of tokens, usually from a centrally curated registry of tokens.
This method enables dapp developers to ask their users to track tokens in their wallets, at runtime.
Once added, the token is indistinguishable from those added using legacy methods, such as a
centralized registry.

This method is specified by [EIP-747](https://eips.ethereum.org/EIPS/eip-747).

#### Parameters

An object containing the following metadata of the token to watch:

- `type` - Currently only supports `CRC20`.
- `options` - An object containing:
  - `address` - The address of the token contract.
  - `symbol` - The symbol of the token, up to 11 characters.
  - `decimals` - The number of token decimals.
  - `image` - A URL string of the token logo.

#### Returns

`true` if the token was added, `false` otherwise.

#### Example

```javascript
conflux
  .request({
    method: 'wallet_watchAsset',
    params: {
      type: 'CRC20',
      options: {
        address: 'cfx:acdrf821t59y12b4guyzckyuw2xf1gfpj2ba0x4sj6',
        symbol: 'cETH',
        decimals: 18,
        image: 'https://scan-icons.oss-cn-hongkong.aliyuncs.com/mainnet/cfx%3Aacdrf821t59y12b4guyzckyuw2xf1gfpj2ba0x4sj6.png',
      },
    },
  })
  .then((success) => {
    if (success) {
      console.log('cETH successfully added to wallet!');
    } else {
      throw new Error('Something went wrong.');
    }
  })
  .catch(console.error);
```
