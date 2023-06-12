---
description: Register a token with users using wallet_watchAsset.
---

# Register a token with users

When a user opens Fluent, they're shown a variety of assets, including tokens.
By default, FLuent detects some major popular tokens and displays them, but for most tokens, the
user must register the token themselves.
This process can be cumbersome, involves the user interacting with contract addresses, and is error-prone.

You can improve the security and experience of users registering your token on their Fluent
interface by using the [`wallet_watchAsset`](../reference/rpc-api.md#wallet_watchasset) RPC method.

For example, you can add something like the following to your project script:

```javascript
const tokenAddress = 'cfxtest:acepe88unk7fvs18436178up33hb4zkuf62a9dk1gv';
const tokenSymbol = 'cUSDT';
const tokenDecimals = 18;
const tokenImage = 'https://scan-icons.oss-cn-hongkong.aliyuncs.com/testnet/cfxtest%3Aacepe88unk7fvs18436178up33hb4zkuf62a9dk1gv.png';

try {
  // wasAdded is a boolean. Like any RPC method, an error can be thrown.
  const wasAdded = await conflux.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'CRC20', // Initially only supports CRC-20 tokens, but eventually more!
      options: {
        address: tokenAddress, // The address of the token.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
        decimals: tokenDecimals, // The number of decimals in the token.
        image: tokenImage, // A string URL of the token logo.
      },
    },
  });

  if (wasAdded) {
    console.log('Thanks for your interest!');
  } else {
    console.log('Your loss!');
  }
} catch (error) {
  console.log(error);
}
```

For more examples, the following are live web dapps that let you enter your token details and share
them using a simple web link:

- [Add Token dapp](https://dapp-demo.fluentwallet.dev/)
