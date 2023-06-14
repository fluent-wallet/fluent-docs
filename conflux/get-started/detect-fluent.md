---
description: Detect the Fluent Conflux provider object.
---

# Detect Fluent

The presence of the Fluent Conflux provider object, `window.conflux`, in a user's browser
indicates an Conflux user.

To demonstrate this, verify if your browser is running Fluent by copying and pasting the following
code snippet in the developer console of your browser:

```javascript
if (typeof window.conflux !== 'undefined') {
  console.log('Fluent Wallet is installed!');
}
```

:::tip
To differentiate Fluent from other Conflux-compatible browsers, you can detect Fluent using the
[`window.conflux.isFluent`](../reference/provider-api.md#windowconfluxisfluent) property.
:::

## Use @fluent-wallet/detect-provider

We recommend using the [`@fluent-wallet/detect-provider`](https://github.com/fluent-wallet/detect-provider)
module to detect the Fluent Conflux provider on any platform or browser.

Use [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install
`@fluent-wallet/detect-provider` in your project directory:

```bash
npm i @fluent-wallet/detect-provider
```

In the [example project script](set-up-dev-environment.md#example), the following code detects the
provider using `@fluent-wallet/detect-provider`:

```javascript title="index.js"
// This function detects most providers injected at window.conflux.This returns the provider, or null if it wasn't detected.
import detectProvider from "@fluent-wallet/detect-provider";
const provider = await detectProvider({
        injectFlag: "conflux",
        defaultWalletFlag: "isFluent",
});

if (provider) {
  // From now on, this should always be true:
  // provider === window.conflux
  startApp(provider); // initialize your app
} else {
  console.log('Please install Fluent Wallet!');
}

function startApp(provider) {
  if (provider !== window.conflux) {
    console.error('Do you have multiple wallets installed?');
  }
  // Access the decentralized web!
}
```

### Compile the module

Use a bundler such as [Webpack](https://github.com/webpack/webpack) to compile the module and create
an output script.
Install Webpack in your project directory:

```bash
npm i --save-dev webpack
```

Install the Webpack CLI:

```bash
npm i --save-dev webpack-cli
```

Compile the module:

```bash
npx webpack
```

:::note
When compiling the module, you might need to pass CLI options such as
[`--experiments-top-level-await`](https://webpack.js.org/configuration/experiments/).
You can alternatively specify options in a configuration file as follows:

```javascript title="webpack.config.cjs"
module.exports = {
    experiments: {
        topLevelAwait: true,
    },
};
```
:::

Run `npx webpack` again upon any changes to `index.js`.
See [Webpack's Getting Started guide](https://webpack.js.org/guides/getting-started/) for more information.
