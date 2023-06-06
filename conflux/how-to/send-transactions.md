---
description: Send transactions using cfx_sendTransaction.
---

# Send transactions

You can send a transaction in Fluent Wallet using the
[`cfx_sendTransaction`](https://conflux-chain.github.io/fluent-wallet-doc/docs/provider-rpc/#cfx_sendtransaction)
RPC method.

For example, the following JavaScript gets the user's accounts and sends a transaction when they
select each button, and the following HTML displays the buttons.

<!--tabs-->

# JavaScript

```javascript
const confluxButton = document.querySelector('.enableConfluxButton');
const sendCfxButton = document.querySelector('.sendCfxButton');

let accounts = [];

// Send Conflux to an address
sendCfxButton.addEventListener('click', () => {
  conflux
    .request({
      method: 'cfx_sendTransaction',
      params: [
        {
          from: accounts[0], // The user's active address.
          to: 'cfx:aana7ds0dvsxftyanc727snuu6husj3vmyc3f1ay93', // Required except during contract publications.
          value: '0x1', // Only required to send cfx to the recipient from the initiating external account.
          gasPrice: '0x7530', // Customizable by the user during Fluent  confirmation.
          gas: '0x5208', // Customizable by the user during Fluent confirmation.
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error(error));
});

confluxButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  accounts = await conflux.request({ method: 'cfx_requestAccounts' });
}
```

# HTML

```html
<button class="enableConfluxButton btn">Enable Conflux</button>
<button class="sendCfxButton btn">Send CFX</button>
```

<!--/tabs-->

## Transaction parameters

### Nonce

:::note
Fluent ignores this field.
:::

In Conflux, every transaction has a nonce, so each transaction can only be processed by the
blockchain once.
To be a valid transaction, either:

- The nonce must be `0`.
- A transaction with a nonce of the previous number, from the same account, must have been processed.

This means that transactions are always processed in order for a given account.

Nonces are easy to mess up, especially when a user is interacting with multiple applications with
pending transactions using the same account, potentially across multiple devices.
Because of this, Fluent doesn't allow dapp developers to customize nonces.


### Gas price

Gas price is an optional parameter, and best used on private blockchains.

In Conflux, every transaction specifies a price for the gas it consumes.
To maximize their profit, block producers pick pending transactions with higher gas prices first
when creating the next block.
This means that a high gas price usually causes your transaction to be processed faster, at the cost
of greater transaction fees.


### Gas limit

Gas limit is an optional parameter, since Fluent automatically calculates a reasonable gas price.

### To

The `to` parameter is a base32-encoded Conflux address.
It's required for transactions with a recipient (all transactions except for contract creation).

Contract creation occurs when there is no `to` value but there is a `data` value.

### Value

The `value` parameter is a hex-encoded value of the network's native currency to send.
On Mainnet, this is [cfx](https://developer.confluxnetwork.org/introduction/en/conflux_basics#cfx), which is denominated in Drip.

These numbers are often far higher precision than native JavaScript numbers, and can cause
unpredictable behavior if not anticipated.
We recommend using [BN.js](https://github.com/indutny/bn.js/) when manipulating
values intended for Conflux.

### Data

The `data` parameter is required for smart contract creation.

This field is also used for specifying contract methods and their parameters.
See the [Solidity ABI spec](https://solidity.readthedocs.io/en/develop/abi-spec.html) for more
information on how the data is encoded.

### Chain ID

:::note
Fluent ignores this field.
:::

The chain ID is derived from the user's current selected network at `window.conflux.networkVersion`. Or you can call the `net_version` method using the [`provider.request()`]((../../../reference/provider-api.md#windowconfluxrequestargs))

```javascript
conflux.request({ method: 'net_version', params: [] });
```

