---
description: Learn about convenience libraries.
---

# Convenience libraries

Various convenience libraries exist for dapp developers.
Some of them simplify the creation of specific user interface elements, some entirely manage the
user account onboarding, and others give you a variety of methods for interacting with smart
contracts, for a variety of API preferences (for example, promises, callbacks, and strong types).

The [Fluent Conflux provider API](../reference/provider-api.md) is very simple, and wraps
[Conflux JSON-RPC](https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/Conflux-Chain/jsonrpc-spec/main/src/cfx/cfx.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=false&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D) formatted messages, which is why
some developers use a convenience library for interacting with the provider, such as
[js-conflux-sdk](https://www.npmjs.com/package/js-conflux-sdk), 
[conflux-Truffle](https://www.npmjs.com/package/conflux-truffle).
You can refer to those tools' documentation to interact with the provider.

The provider API is all you need to create a full-featured web3 application, but if you need
higher-level abstractions than those provided by the API, we recommend using a convenience library.
