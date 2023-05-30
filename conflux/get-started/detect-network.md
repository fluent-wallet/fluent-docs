---
description: Detect a user's network and network changes.
---

# Detect a user's network

It's important to keep track of the user's network chain ID because all RPC requests are submitted
to the currently connected network.

Use the [`cfx_chainId`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc#cfx_chainid)
RPC method to detect the chain ID of the user's current network.
Listen to the [`chainChanged`](../reference/provider-api.md#chainchanged) provider event to
detect when the user changes networks.

In the [example project script](set-up-dev-environment.md#example), the following code detects a
user's network and when the user changes networks:

```javascript title="index.js"
const chainId = await window.conflux.request({ method: 'cfx_chainId' });

window.conflux.on('chainChanged', handleChainChanged);

function handleChainChanged(chainId) {
  // We recommend reloading the page, unless you must do otherwise.
  window.location.reload();
}
```

## Chain IDs

These are the chain IDs of the Conflux networks that Fluent supports by default.
Consult [ConfluxNetwork Developer Doc](https://developer.confluxnetwork.org/introduction/en/conflux_basics#chainid--networkid) for more.

| Hex      | Decimal  | Network                                                                   |
|----------|----------|---------------------------------------------------------------------------|
| 0x405    | 1029     | Conflux main network (Mainnet)                                            |
| 0x1      | 1        | Test network                                                              |   

