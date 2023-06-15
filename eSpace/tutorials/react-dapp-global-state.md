---
title: Create a React dapp with global state
description: Create a multi-component React dapp with global state.
toc_max_heading_level: 4
---

# Create a React dapp with global state

This tutorial walks you through integrating a React dapp with Fluent.
The dapp has multiple components, so requires managing global state.
You'll use the [Vite](https://v3.vitejs.dev/guide) build tool with React and TypeScript to create
the dapp.

:::tip
We recommend first [creating a React dapp with local state](react-dapp-local-state.md).
This tutorial is a follow-up to that tutorial.
:::

The [previous tutorial](react-dapp-local-state.md) walks you through creating a dapp that connects
to Fluent and handles account, balance, and network changes with a single component.
In real world use cases, a dapp might need to respond to state changes in different components.

In this tutorial, you'll move that state and its relevant functions into
[React context](https://react.dev/reference/react/useContext), creating a
[global state](https://react.dev/learn/reusing-logic-with-custom-hooks#custom-hooks-sharing-logic-between-components)
so other components and UI can affect it and get Fluent wallet updates.

This tutorial also provides a few best practices for a clean code base, since you'll have multiple
components and a slightly more complex file structure.

:::info Project source code
You can see the source code for the
[starting point](https://github.com/fluent-wallet/react-dapp-tutorial/tree/global-state-start) and
[final state](https://github.com/fluent-wallet/react-dapp-tutorial/tree/evm-global-state-final) of this dapp.
:::

## Prerequisites

- [Node.js](https://nodejs.org/) version 18+
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 9+
- A text editor (for example, [VS Code](https://code.visualstudio.com/))
- The [Fluent Wallet extension](https://fluentwallet.com/) installed
- Basic knowledge of TypeScript, React and React Hooks

## Steps

### 1. Set up the project

Clone the [`react-dapp-tutorial`](https://github.com/fluent-wallet/react-dapp-tutorial) GitHub repository
on GitHub by running the following command:

```bash
git clone https://github.com/fluent-wallet/react-dapp-tutorial.git
```

Checkout the `global-state-start` branch:

```bash
cd react-dapp-tutorial && git checkout global-state-start
```

Install the node module dependencies:

```bash
npm install
```

Open the project in a text editor.

:::note tip
If you use VS Code, you can run the command `code .` to open the project.
:::

This is a working React dapp, but it's wiped out the code from the previous tutorial's
[`App.tsx`](https://github.com/Fluent/react-dapp-tutorial/blob/local-state-final/src/App.tsx) file.  

Run the dapp using the command `npx vite`.
The starting point looks like the following:

![](../assets/tutorials/react-dapp/pt2-01.png)

There are three components, each with static text: navigation (with a logo area and connect button),
display (main content area), and footer.
You'll use the footer to show any Fluent errors.  

Before you start, comment out or remove the `border` CSS selector, as it's only used as a visual aid.
Remove the following line from each component style sheet:

```css title="Display.module.css | FluentError.module.css | Navigation.module.css"
// border: 1px solid rgb(...);
```

#### Styling

This dapp has Vite's typical `App.css` and `index.css` files removed, and uses a modular approach to CSS.

In the `/src` directory, `App.global.css` contains styles for the entire dapp (not specific to a
single component), and styles you might want to reuse (such as buttons).  

In the `/src` directory, `App.module.css` contains styles specific to `App.tsx`, your dapp's
container component.
It uses the `appContainer` class, which sets up a
[Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox) to define the `display` type
(`flex`) and the `flex-direction` (`column`).   

Using Flexbox here ensures that any child `div`s are laid out in a single-column layout (vertically).  

Finally, the `/src/components` directory has subdirectories for `Display`, `Navigation`, and `FluentError`.
Each subdirectory contains a corresponding component file and CSS file.
Each component is a
[flex-items](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-basics-and-terminology)
within a
[flex-container](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-flexbox-properties),
stacked in a vertical column with the navigation and footer (`FluentError`) being of fixed height
and the middle component (`Display`) taking up the remaining vertical space.

#### Optional: Linting with ESLint

This dapp uses a standard ESLint configuration to keep the code consistent.
There are two ways to use ESLint:

1. Run `npm run lint` or `npm run lint:fix` from the command line.
    The former displays all the linting errors, and the latter updates your code to fix linting
    errors where possible.
2. Set up your IDE to show linting errors and automatically fix them on save.
    For example, in VS Code, you can create or update the file at `.vscode/settings.json` in the
    root of the project with the following settings:

    ```json title="settings.json"
    {
      "eslint.format.enable": true,
      "eslint.packageManager": "npm",
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      },
      "eslint.codeActionsOnSave.mode": "all"
    }
    ```

#### Project structure

The following is a tree representation of the dapp's `/src` directory:

```text
├── src
│   ├── assets
│   ├── components
│   │   └── Display
│   │   |   └── index.tsx
│   │   |   └── Display.module.css
│   │   |   └── Display.tsx
│   │   ├── FluentError
│   │   |   └── index.tsx
│   │   |   └── FluentError.module.css
│   │   |   └── FluentError.tsx
│   │   ├─── Navigation
│   │   |   └── index.tsx
│   │   |   └── Navigation.module.css
│   │   |   └── Navigation.tsx
│   ├── hooks
│   │   ├── useFluent.tsx
│   ├── utils
│   │   └── index.tsx
├── App.global.css
├── App.module.css
├── App.tsx
├── main.tsx
├── vite-env.d.ts
```

Instead of a single component, there's a `src/components` directory with UI and functionality
distributed into multiple components.
You'll modify the dapp's state in this directory and make it available to the rest of the dapp using
a [context provider](https://react.dev/reference/react/useContext).
This provider will sit in the `src/App.tsx` file and wrap the three child components.  

The child components will have access to the global state and the functions that modify the global state.
This ensures that any change to the `wallet` (`address`, `balance`, and `chainId`), or the global
state's properties and functions (`hasProvider`, `error`, `errorMessage`, and `isConnecting`) will
be accessible by re-rendering those child components.

The following graphic shows how the context provider wraps its child components, providing access to
the state modifier functions and the actual state itself.
Since React uses a one-way data flow, any change to the data gets re-rendered in those components automatically.

![](../assets/tutorials/react-dapp/pt2-02.png)

### 2. Build the context provider

In this step, you'll create a context called `FluentContext` and a provider component called
`FluentContextProvider` in the `/src/hooks/useFluent.tsx` file.

This provider component will use similar `useState` and `useEffect` hooks with some changes from
the previous tutorial's local state component to make it more DRY (don't repeat yourself).

It will also have similar `updateWallet`, `connectFluent`, and `clearError` functions, all of
which do their part to connect to Fluent or update the Fluent state.

`FluentContext` will return a `FluentContext.Provider`, which takes a value of type
`FluentContextData`, and supplies that to its children.

You'll export a React hook called `useFluent`, which uses your `FluentContext`.

Update `/src/hooks/useFluent.tsx` with the following:

:::caution Read the comments
The following code contains comments describing advanced React patterns and how Fluent state is managed.
:::

```tsx title="useFluent.tsx"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createContext, PropsWithChildren, useContext, useCallback } from 'react'

import detectProvider from '@fluent-wallet/detect-provider'
import { formatBalance } from '~/utils'

interface WalletState {
  accounts: any[]
  balance: string
  chainId: string
}

interface FluentContextData {
  wallet: WalletState
  hasProvider: boolean | null
  error: boolean
  errorMessage: string
  isConnecting: boolean
  connectFluent: () => void
  clearError: () => void
}

const disconnectedState: WalletState = { accounts: [], balance: '', chainId: '' }

const FluentContext = createContext<FluentContextData>({} as FluentContextData)

export const FluentContextProvider = ({ children }: PropsWithChildren) => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)

  const [isConnecting, setIsConnecting] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const clearError = () => setErrorMessage('')

  const [wallet, setWallet] = useState(disconnectedState)
  // useCallback ensures that you don't uselessly recreate the _updateWallet function on every render
  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    const accounts = providedAccounts || await window.ethereum.request(
      { method: 'eth_accounts' },
    )

    if (accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      setWallet(disconnectedState)
      return
    }

    const balance = formatBalance(await window.ethereum.request({
      method: 'eth_getBalance',
      params: [accounts[0]],
    }))
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    })

    setWallet({ accounts, balance, chainId })
  }, [])

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet])
  const updateWallet = useCallback((accounts: any) => _updateWallet(accounts), [_updateWallet])

  /**
   * This logic checks if Fluent is installed. If it is, some event handlers are set up
   * to update the wallet state when Fluent changes. The function returned by useEffect
   * is used as a "cleanup": it removes the event handlers whenever the FluentProvider
   * is unmounted.
   */
  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectProvider({
        injectFlag: 'ethereum',
        defaultWalletFlag: 'isFluent',
      })
      setHasProvider(Boolean(provider))

      if (provider) {
        updateWalletAndAccounts()
        window.ethereum.on('accountsChanged', updateWallet)
        window.ethereum.on('chainChanged', updateWalletAndAccounts)
      }
    }

    getProvider()

    return () => {
      window.ethereum?.removeListener('accountsChanged', updateWallet)
      window.ethereum?.removeListener('chainChanged', updateWalletAndAccounts)
    }
  }, [updateWallet, updateWalletAndAccounts])

  const connectFluent = async () => {
    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      clearError()
      updateWallet(accounts)
    } catch(err: any) {
      setErrorMessage(err.message)
    }
    setIsConnecting(false)
  }

  return (
    <FluentContext.Provider
      value={{
        wallet,
        hasProvider,
        error: !!errorMessage,
        errorMessage,
        isConnecting,
        connectFluent,
        clearError,
      }}
    >
      {children}
    </FluentContext.Provider>
  )
}

export const useFluent = () => {
  const context = useContext(FluentContext)
  if (context === undefined) {
    throw new Error('useFluent must be used within a "FluentContextProvider"')
  }
  return context
}
```

With this context provider in place, you can update `/src/App.tsx` to include the provider and wrap
it around the three components.  

Notice the use of `~/utils` to import the utility functions.  

:::note vite-tsconfig-paths
This dapp is configured to use `vite-tsconfig-paths`, allowing it to load modules with locations
specified by the `compilerOptions.paths` object in `tsconfig.json`.
The path corresponding to the `./src/*` directory is represented by the `~/*` symbol.
There's also a reference to `./tsconfig.node.json` in the `reference`'s array objects that correspond
to `path`.

`vite.config.ts` imports `tsconfigPaths` from `vite-tsconfig-paths` and adds it to the `plugins` array.  

See more information about [`vite-tsconfig-paths`](https://github.com/aleclarson/vite-tsconfig-paths).
:::

### 3. Wrap components with the context provider

In this step, you'll import the `FluentContextProvider` in `/src/App.tsx` and wrap that component
around the existing `Display`, `Navigation`, and `FluentError` components.

Update `/src/App.tsx` to the following:

```tsx  title="App.tsx"
import './App.global.css'
import styles from './App.module.css'

import { Navigation } from './components/Navigation'
import { Display } from './components/Display'
import { FluentError } from './components/FluentError'
import { FluentContextProvider } from './hooks/useFluent'

export const App = () => {

  return (
    <FluentContextProvider>
      <div className={styles.appContainer}>
        <Navigation />
        <Display />
        <FluentError />
      </div>
    </FluentContextProvider>
  )
}
```

With `App.tsx` updated, you can update the `Display`, `Navigation`, and `FluentError` components,
each of which will use the `useFluent` hook to display the state or invoke functions that modify state.

### 4. Connect to Fluent in the navigation

The `Navigation` component will connect to Fluent using conditional rendering to show an
**Install Fluent** or **Connect Fluent** button or, once connected, display your wallet address
in a hypertext link that connects to [Confluxscan](https://evm.confluxscan.io/).  

Update `/src/components/Navigation/Navigation.tsx` to the following:

```tsx  title="Navigation.tsx"
import { useFluent } from '~/hooks/useFluent'
import { formatAddress } from '~/utils'
import styles from './Navigation.module.css'

export const Navigation = () => {

  const { wallet, hasProvider, isConnecting, connectFluent } = useFluent()

  return (
    <div className={styles.navigation}>
      <div className={styles.flexContainer}>
        <div className={styles.leftNav}>Vite + React & Fluent</div>
        <div className={styles.rightNav}>
          {!hasProvider &&
            <a href="https://fluent.wallet" target="_blank" rel="noreferrer">
              Install Fluent
            </a>
          }
          {window.ethereum?.isFluent && wallet.accounts.length < 1 &&
            <button disabled={isConnecting} onClick={connectFluent}>
              Connect Fluent
            </button>
          }
          {hasProvider && wallet.accounts.length > 0 &&
            <a
              className="text_link tooltip-bottom"
              href={`https://evm.confluxscan.io/address/${wallet}`}
              target="_blank"
              data-tooltip= "Open in Block Explorer" rel="noreferrer"
            >
              {formatAddress(wallet.accounts[0])}
            </a>
          }
        </div>
      </div>
    </div>
  )
}
```

Notice how `useFluent` de-structures its return value to get the items within `FluentContextData`:

```ts
const { wallet, hasProvider, isConnecting, connectFluent } = useFluent()
```

Also, the `formatAddress` function formats the wallet address for display purposes:

```ts
{formatAddress(wallet.accounts[0])}
```

This function doesn't exist in the `@utils` file yet, so you'll need to add it.
Update `/src/utils/index.tsx` to the following:

```ts title="utils/index.ts"
export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatAddress = (addr: string) => {
  return `${addr.substring(0, 8)}...`
}
```

This should address any build errors in your `Navigation` component.  

Other than using the new styling, the only thing this dapp has done differently than the local-state
tutorial is display the user's `address` formatted inside a link once they're connected.
Now that you have a place for connecting and showing the address, you could build out an entire
profile component (side quest).

![](../assets/tutorials/react-dapp/pt2-03.png)

### 5. Display Fluent data

In the `Display` component, you won't call any functions that modify state; you'll read from
`FluentData`, a simple update.

Update `/src/components/Display/Display.tsx` to the following:

```tsx title="Display.tsx"
import { useFluent } from '~/hooks/useFluent'
import { formatChainAsNum } from '~/utils'
import styles from './Display.module.css'

export const Display = () => {

  const { wallet } = useFluent()

  return (
    <div className={styles.display}>
      {wallet.accounts.length > 0 &&
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
        </>
      }
    </div>
  )
}
```

Notice how `useFluent` de-structures its return value to get only the `wallet` data:

```ts
const { wallet } = useFluent()
```

At this point, you can display `account`, `balance`, and `chainId` in the `Display` component:

![](../assets/tutorials/react-dapp/pt2-04.png)

### 6. Show Fluent errors in the footer

If Fluent errors or the user rejects a connection, you can display that error in the footer, or
`FluentError` component.

Update `/src/components/FluentError/FluentError.tsx` to the following:

```tsx title="FluentError.tsx"
import { useFluent } from '~/hooks/useFluent'
import styles from './FluentError.module.css'

export const FluentError = () => {
  const { error, errorMessage, clearError } = useFluent()
  return (
    <div className={styles.FluentError} style={
      error ? { backgroundColor: 'brown' } : {}
    }>
      { error && (
        <div onClick={clearError}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )
      }
    </div>
  )
}
```

Notice how `useFluent` de-structures its return value to get only the `error`, `errorMessage`, and
`clearError` data:

```ts
const { error, errorMessage, clearError } = useFluent()
```

When you generate an error by cancelling the connection to Fluent, this shows up in the footer.
The background temporarily turns a dark red color:

![](../assets/tutorials/react-dapp/pt2-05.png)

In this tutorial's dapp, you can dismiss any Fluent error displayed in the footer by selecting it.
In a real-world dapp, the best UI/UX for error dismissing would be a component that displays in a
modal or overlay and provides an obvious dismiss button.

## Conclusion

You've successfully converted a single component dapp with local state to a multiple component dapp
with global state, using React context and provider.
You can modify the dapp's global state using functions and data that, when used anywhere in the dapp,
will show up-to-date data associated with your Fluent wallet.

You can see the [source code](https://github.com/fluent-wallet/react-dapp-tutorial/tree/evm-global-state-final)
for the final state of this dapp tutorial.
