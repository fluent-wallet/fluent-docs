---
title: Pure JavaScript
---

# Use  JS-CONFLUX-SDK with pure JavaScript

You can import JS-CONFLUX-SDK into your pure JavaScript dapp to enable your users to easily connect
with a Fluent wallet client.
The SDK for pure JavaScript [works the same way](index.md#how-it-works) and has the
[same prerequisites](index.md#prerequisites) as for standard JavaScript.

To import, instantiate, and use the SDK, you can insert a script in the head section of your website:

```javascript
<head>
...

<script src="https://cdn.jsdelivr.net/npm/js-conflux-sdk/dist/js-conflux-sdk.umd.min.js"></script>

<script>

    const conflux = new window.TreeGraph.Conflux();

    cfxClient.provider=conflux;// Actually,it is the window.conflux injected by Fluent Wallet. You can also access via window.conflux

    conflux.on('chainChanged', cfxClient.updateNetworkId); 

</script>

...
</head>
```

You can configure the SDK using any [options](../../../reference/sdk-js-options.md) and call any
[provider API methods](../../../reference/provider-api.md).
Always call [`cfx_requestAccounts`](../../../reference/rpc-api.md#eth_requestaccounts) using
[`provider.request()`](../../../reference/provider-api.md#windowconfluxrequestargs) first, since it
prompts the installation or connection popup to appear.
