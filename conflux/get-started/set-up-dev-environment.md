---
description: Set up a new simple dapp to integrate with Fluent.
---

# Set up your development environment

You can easily set up a simple dapp to integrate with MetaMask.
For a full end-to-end tutorial using [Vite](https://v3.vitejs.dev/guide/), see the
[Create a simple React dapp](../tutorials/react-dapp-local-state.md) tutorial.

## Prerequisites

- [Fluent](https://fluent.wallet/) installed in the browser of your choice on your development
  machine.

- A text editor of your choice, such as [VS Code](https://code.visualstudio.com/).
  You can install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
  extension for VS Code to easily launch a local development server for your dapp.

- A module bundler, such as [Webpack](https://github.com/webpack/webpack).

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Set up a new project

Create a project directory with the following structure:

```text
simple-dapp/
├─ src/
│  ├─ index.js
├─ dist/
│  ├─ index.html
```

For any Conflux dapp to work, your project script `index.js` must:

- [Detect the Fluent provider.](detect-fluent)
- [Detect which Ethereum network the user is connected to.](detect-network)
- [Access the user's Ethereum accounts.](access-accounts)

:::caution important
If you import any modules into your project, such as
[`@cfxjs/use-wallet-react/conflux`](https://github.com/Conflux-Chain/use-wallet), use a bundler such as
[Webpack](https://github.com/webpack/webpack) to compile the modules and create an output script
`dist/main.js`.
See [Webpack's Getting Started guide](https://webpack.js.org/guides/getting-started/) for more information.
:::


## Example

The following is an example simple dapp script and HTML file:

<!--tabs-->

# JavaScript

```javascript title="index.js"
/*****************************************/
/* Detect the Fluent Conflux provider */
/*****************************************/

import { provider } from '@cfxjs/use-wallet-react/conflux';

if (provider) {
  startApp(provider);
} else {
  console.log('Please install Fluent Wallet!');
}

function startApp(provider) {
  if (provider !== window.conflux) {
    console.error('Do you have multiple wallets installed?');
  }
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

const chainId = await window.conflux.request({ method: 'cfx_chainId' });

window.conflux.on('chainChanged', handleChainChanged);

function handleChainChanged(chainId) {
  window.location.reload();
}

/***********************************************************/
/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

let currentAccount = null;
window.conflux.request({ method: 'cfx_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    console.error(err);
  });

window.conflux.on('accountsChanged', handleAccountsChanged);

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log('Please connect to Fluent Wallet.');
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    showAccount.innerHTML = currentAccount;
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

const confluxButton = document.querySelector('.enableConfluxButton');
const showAccount = document.querySelector('.showAccount');

confluxButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  const accounts = await window.conflux.request({ method: 'cfx_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        console.log('Please connect to Fluent Wallet.');
      } else {
        console.error(err);
      }
    });
  const account = accounts[0];
  showAccount.innerHTML = account;
}
```

# HTML

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Simple dapp</title>
  <script type="module" src="index.js"></script>
</head>
<body>
  <!-- Display a connect button and the current account -->
  <button class="enableConfluxButton">Enable Conflux</button>
  <h2>Account: <span class="showAccount"></span></h2>
</body>
</html>
```

<!--/tabs-->
