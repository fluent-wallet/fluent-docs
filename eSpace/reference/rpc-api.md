---
description: Fluent Ethereum JSON-RPC API reference
---

# JSON-RPC API

Fluent uses the [`window.ethereum.request(args)`](provider-api.md#windowethereumrequestargs)
provider method to wrap a JSON-RPC API.
The API contains standard Ethereum JSON-RPC API methods and Fluent-specific methods.

For more information on the standard Conflux eSpace RPC methods, see the
[Conflux eSpace Methods](https://developer.confluxnetwork.org/conflux-doc/docs/EVM-Space/evm_space_rpc_compatibility).

:::note
All RPC method requests can return errors.
Make sure to handle errors for every call to
[`window.ethereum.request(args)`](provider-api.md#windowethereumrequestargs).
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
[`eth_accounts`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc/#eth_accounts) method),
or they might require confirmation by the user (for example,
[`wallet_addEthereumChain`](#wallet_addethereumchain)).

The following are some Fluent-specific unrestricted methods.
For the full list of Fluent JSON-RPC API methods, see the
[Fluent API](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc).

### eth_requestAccounts

Requests that the user provide an Ethereum address to be identified by.
Use this method to [access a user's accounts](../get-started/access-accounts.md).

This method is specified by [EIP-1102](https://eips.ethereum.org/EIPS/eip-1102).

:::info
Internally, this method calls [`wallet_requestPermissions`](#wallet_requestpermissions) for
permission to call [`eth_accounts`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc/#eth_accounts).
:::

#### Returns

If the user accepts the request, this method returns an array of a single, hexadecimal Ethereum
address string.
If they reject the request, this method rejects with a `4001` error.

#### Example

```javascript
document.getElementById('connectButton', connect);

function connect() {
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to Fluent.');
      } else {
        console.error(error);
      }
    });
}
```

### wallet_getPermissions

Gets the caller's current [permissions](#restricted-methods).

:::note
This method is not yet available on Fluent Mobile.
:::

#### Returns

An array of the caller's permission objects.
If the caller has no permissions, the array is empty.

### wallet_requestPermissions

Requests [permissions](#restricted-methods) from the user.

The request causes a Fluent popup to appear.
You should only request permissions in response to a direct user action, such as a button click.

:::note
This method is not yet available on Fluent Mobile.
:::

#### Parameters

An array containing the requested permission objects.

#### Returns

An array of the caller's permission objects.
If the user denies the request, a `4001` error is returned.

#### Example

```javascript
document.getElementById('requestPermissionsButton', requestPermissions);

function requestPermissions() {
  ethereum
    .request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    })
    .then((permissions) => {
      const accountsPermission = permissions.find(
        (permission) => permission.parentCapability === 'eth_accounts'
      );
      if (accountsPermission) {
        console.log('eth_accounts permission successfully requested!');
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

### wallet_addEthereumChain

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
  [eth_chainId](https://conflux-chain.github.io/fluent-wallet-doc/docs/standard-rpc#eth_chainid) is called.
- The chain ID corresponds to any default Fluent chains.

This method is specified by [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085).

#### Parameters

An array containing an object containing the following metadata about the chain to be added to Fluent:

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

We recommend using this method with [`wallet_addEthereumChain`](#wallet_addethereumchain):

```javascript
try {
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xf00' }],
  });
} catch (switchError) {
  // This error code indicates that the chain has not been added to Fluent.
  if (switchError.code === 4902) {
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
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

### wallet_switchEthereumChain

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
to add it using [`wallet_addEthereumChain`](#wallet_addethereumchain).

#### Example

See the [`wallet_addEthereumChain`](#wallet_addethereumchain) example.


### wallet_watchAsset

Requests that the user track the specified token in Fluent.

Most Ethereum wallets support some set of tokens, usually from a centrally curated registry of tokens.
This method enables dapp developers to ask their users to track tokens in their wallets, at runtime.
Once added, the token is indistinguishable from those added using legacy methods, such as a
centralized registry.

This method is specified by [EIP-747](https://eips.ethereum.org/EIPS/eip-747).

#### Parameters

An object containing the following metadata of the token to watch:

- `type` - Currently only supports `ERC20`.
- `options` - An object containing:
  - `address` - The address of the token contract.
  - `symbol` - The symbol of the token, up to 11 characters.
  - `decimals` - The number of token decimals.
  - `image` - A URL string of the token logo.

#### Returns

`true` if the token was added, `false` otherwise.

#### Example

```javascript
ethereum
  .request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
        symbol: 'FOO',
        decimals: 18,
        image: 'https://foo.io/token-image.svg',
      },
    },
  })
  .then((success) => {
    if (success) {
      console.log('FOO successfully added to wallet!');
    } else {
      throw new Error('Something went wrong.');
    }
  })
  .catch(console.error);
```

