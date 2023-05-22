# Create an NFT Minting dApp with Cudos NFT Native Module

NFT Minting is one of the most common applications of blockchain technology and the application of NFTs are almost limitless, so it is a good idea to look at how we can create NFTs on the Cudos blockchain. To do this, we will build a webapp that interacts with the Cudos-node’s NFT module using the Cudosjs.

In this tutorial, you will learn how to use the CudosJs library to create a web app that integrates with the Cudos network and the knowledge you gain here can be applied to build different types of decentralised applications on Cudos. 

What you will learn from this tutorial are:

- Features of the Cudos-Node’s NFT module
- How to set up a React TS app with Keplr and [Cudos-js](https://www.npmjs.com/package/cudosjs)
- how to setup and interact with keplr extension to sign transactions
- Querying and executing transactions on Cudos testnet using cudosjs and Keplr
- Possible ways to extend the project

This GitHub repository contains the finished project…

The tooling used are:

[Cudos-node](https://github.com/CudoVentures/cudos-node) we will be interacting with the Cudos testnet in this tutorial, you can find the current rpc [URLs here](https://docs.cudos.org/docs/build/overview/connect-network#01-connect-to-testnet-rpc). You may also choose to run your own local [Cudos-Node](https://github.com/CudoVentures/cudos-node).

React is the front-end framework we will use.

[Cudosjs](https://www.npmjs.com/package/cudosjs) this is the library with which we interact with the Cudos network.

## 00A What is Cudos Network?

[Cudos](https://www.cudos.org/) is a network that seeks to unite cloud and blockchain by enabling the use of spare computing. [Cudo Compute](https://docs.cudos.org/docs/blockchain-compute/introduction/overview/) platform is powered by smartcontracts that allow you to easily deploy virtual machines on a decentralised cloud platform at a fraction of the cost of traditional cloud platforms.

Transactions on Cudos network are low-cost which makes it a great network to build your dApps on. 

## 00B Features of the Cudos-Node’s NFT module

First let us take a look at the Cudos-node’s NFT module, here is the [link](https://github.com/CudoVentures/cudos-node/tree/cudos-master/x/nft) to the repo on Github. 

There are 2 concepts/terms that are important to understand in the context of the NFT module :

1. Denom: a denom is a collection of NFTs, you can create a denom by executing an `issue` transaction. All NFTs belong to a denom. 
2. NFTs: this is the NFT itself and as I said earlier an NFT belongs to a denom, hence only the denom creator can mint a new NFT that is associated with a particular denom. When minting an NFT the owner can be set to an address other than the denom creator’s address.   

The NFT module has the following features:

- Executable functions that allow us to:
    - create NFT collections known as denom,
    - mint NFTs in a denom,
    - set and transfer denom and NFT ownership,
    - grant or revoke addresses permissions to transfer an NFT,
    - edit NFT data, and lastly burn NFT.
- Query functions that allow us to query NFT and Denom data such as:
    - querying denom by id, name, or symbol,
    - query all the denoms/collections in a network,
    - query specific or all the NFTs in a collection,
    - query the total supply of (i.e. number of tokens in) a collection,
    - query the denoms and NFTs owned by an address

You can learn more about the NFT module by looking [at the code on Github](https://github.com/CudoVentures/cudos-node/tree/cudos-master/x/nft). 

## Step 01 Set up the react project and install Cudosjs

We use [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) to scaffold our React Typescript project, Vite requires Node.js 14.18 or higher.  

Go to the directory you want your project located in and run the command `npm create vite@latest.`

![Initialising your react project with Vite](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/730vuqhq7proqfvbdzqi.png)

You will be prompted to provide: Project name, Package name, framework, and variant. Enter the names of your choice and use your arrow keys to select the framework and variant. The framework and variant in this tutorial are React and Typescript respectively.


![File Structure of our newly initialised project](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cwbq7b5nbyi3cwjzkoqy.png)

You will then need to run the command `npm install` to install all the libraries that are part of the project scaffolding process. 

Opening the project root in VS code, or another editor of choice, we will need to install more dependencies we need in our project. 

Using npm (or other package manager of choice) you can install all the dependencies at once with the following command : 

`npm install cudosjs react-router-dom react-hook-form zod notistack @mui/material @mui/lab @emotion/react @emotion/styled @fontsource/poppins @hookform/resolvers @keplr-wallet/types @mui/icons-material @esbuild-plugins/node-globals-polyfill`

Or you can install them individually as listed below 

| command | dependency | function |
| --- | --- | --- |
| npm i cudosjs | https://www.npmjs.com/package/cudosjs | A JavasSript Open Source Library for https://cudos.org/
 network |
| npm i react-router-dom | https://www.npmjs.com/package/react-router-dom | It contains bindings for the routing library for React |
| npm i react-hook-form | https://www.npmjs.com/package/react-hook-form | Performant, flexible and extensible forms with easy to use validation. |
| npm i zod | https://www.npmjs.com/package/zod | A type declaration and validation library. We use it to declare and validate the data type of the forms used in NFT minting. |
| npm i @hookform/resolvers | https://github.com/react-hook-form/resolvers | allows you to use an external validation library with React hook form |
| npm i @mui/material @mui/lab @emotion/react @emotion/styled | https://mui.com/material-ui/getting-started/overview/ for component styling | Material UI is an open-source React component library that implements Google's https://m2.material.io/
. |
| npm i notistack  | https://www.npmjs.com/package/notistack | For snack bar notification |
| npm i @fontsource/poppins | Poppins font  | Poppins font via Fontsource |
| npm i @keplr-wallet/types |  |  |
| npm install @esbuild-plugins/node-globals-polyfill |  | To make the Node module Buffer available in our project  |

After installing all the dependencies, start the development server to verify everything works. Do this by running the command `npm run dev` which usually makes the project live on [`http://localhost:5173/`](http://localhost:5173/) . When you open this in your browser, you'll see it displayed like this:

![boilerplate react-vite project browser output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nbfvofw0v0jc2vse41zc.png)

Upon completing this step, your project should be similar to what can be found here[branch 1].

## Step 02 Adapting and removing boilerplate code

In this step, we will remove some boilerplate code, update the `vite.config.ts` file and adapt the project to use Material UI components. 

We will make a change and an addition to the `index.html` file. 

```html
// index.html	
...
    <title>Reified Token</title> //change 
	...
    <script type="module" src="/src/main.tsx"></script>
    <script> var global = global || window; </script> //addition  
  </body>
</html>
```

First, change the title of the app to **Reified Tokens.** Then add

 `<script> var global = global || window; </script>` below the first script tag, this creates a `global` variable and assigns it to  `window`, if it exists. The aim of this is to ensure that the code works well in the browser, especially when we need to access the browser extensions.

 You will then delete the content of the `App.css`, and paste this 

```css
/* src/App.css */
#root {
  width: -webkit-fill-available;
}
```

The code above sets the width of the root element of our React app to the maximum available width.

Delete the CSS rules in index.css, except that of the body, such that the `index.css` file is as below.

```css
body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
```

### Material UI modifications

Remember that we have installed Material UI and Icons during project setup. We want to customise the theme for the application. To do this, you will create a `theme.ts` file in the `src` folder adding the code below into it. 

```tsx
// src/theme.ts

import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#52A6F8",
      light: "#8bd6ff",
      dark: "#0077c4",
    },
    secondary: {
      main: "#2A4064",
      light: "#576b92",
      dark: "#001a39",
    },
    background: {
      default: "#1C2030",
      paper: "#576b92",
    },
    text: {
      primary: "#000",
      secondary: "#fff",
    },
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    fontSize: 14,
  },
});

export default theme;
```

With the `createTheme` function of the Material UI library, we have created a custom theme system of color palette and typography for our app. 

Secondly, remove the boilerplate code in the `App.tsx` file and update it to reflect the code below.

```tsx
import React from "react";
import "./App.css";

import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, Typography } from "@mui/material";
import "@fontsource/poppins";
import theme from "./theme";

function App() {
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Typography color="text.secondary">Hello...</Typography>
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default App;
```

This file is the entry point for our app. We import the `ThemeProvider` passing in the theme we previously defined in the `theme.ts` file. The **`CssBaseline`** component applies a baseline CSS to the application, ensuring consistent styling across different browsers. We also import the font family and display a simple **Hello…** world using some material UI components.

### Adding Router and Notistack

Modify the `main.tsx` file to:

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <SnackbarProvider maxSnack={2} preventDuplicate={true}>
      <App />
    </SnackbarProvider>
  </Router>
);
```
Note that we wrap the `App` in the `SnackbarProvider`, this provides a global context for displaying snackbars used for notifications in the app, and we set the maximum number of snackbars displayed simultaneously as 2 with the `maxSnack` prop. 

To enable routing in our web app, we import `BrowserRouter` from the `react-router-dom` library and make it accessible as `Router`. The `App` and its container `SnackbarProvider` are both wrapped with `Router` component, which provides client-side routing functionality to our application.

Now we need to add some configurations to the `vite.config.ts` file

1. Add `import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill' ` to the imports
2. Add the following config to the config definition

```
  ...
    optimizeDeps: {
          esbuildOptions: {
              define: {
                  global: 'globalThis'
              },
              plugins: [
                  NodeGlobalsPolyfillPlugin({
                      buffer: true
                  })
              ]
          }
      }
  })
```

After following the above instructions, running `npm run dev` should display as below in the browser.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/73s0jhedzj552oit8vb8.png)
Upon completing this step, your project should be similar to what can be found here[branch 2].

## Step 03 Create helper functions related to the Keplr Wallet

We will first need to create `global.d.ts` file which is a type declaration file. In it, we will extend the global browser `window` interface to include the `KeplrWindow` interface provided by the `@keplr-wallet/types` interface. This is our way of ensuring we can access the functions provided with the KeplrWallet extension through the global `window` object. You will find an example of this when we call on `window.keplr.enable()` later in this section.

### Creating .env file to store our variables

Create a `.env` file in the project root, and paste the following variables in it.

```
VITE_NETWORK='LOCAL' || 'TESTNET'
VITE_GAS_PRICE ="5000000000000acudos"

# TESTNET
VITE_APP_RPC='https://rpc.testnet.cudos.org:443'
VITE_APP_API='https://sentry1.gcp-uscentral1.cudos.org:31317'
VITE_APP_CHAIN_ID ='cudos-testnet-public-3'
VITE_APP_ADDRESS_PREFIX = 'cudos'
```

The environmental variables and their usage are explained in the table below. Please note that changing any of the variables in the .env file while the app is running, the app must be stopped by running `ctrl + C` and then built again with `npm run dev` before the changes take effect.

The variables are made available to the application code via `import.meta.env<variable-name>`. For example, the **Cudos testnet RPC endpoint** is accessed in the code by referencing `import.meta.env.VITE_APP_RP`

| Variable | Descrition  |  |
| --- | --- | --- |
|  VITE_APP_RPC |  The Cudos public testnet RPC endpoint   | https://docs.cudos.org/docs/build/overview/connect-network#01-connect-to-testnet-rpc |
| VITE_APP_API |   The cudos public testnet HTTP endpoint  |  |
| VITE_APP_CHAIN_ID  | The chain id |  |
| VITE_APP_ADDRESS_PREFIX | The network prefix, used in configuring Keplr wallet |  |

### KeplrLedger.ts File

We are now going to create  `KeplrLedger` file which will contain utility functions for signing the blockchain transactions, using Keplr Wallet browser extension. Below is the code.

```tsx
//src/ledgers/KeplrLedger.ts

import { GasPrice, SigningStargateClient } from "cudosjs";

export type AccountDetails = { address: string; username: string };

export const keplrSigningClient = async (): Promise<SigningStargateClient> => {
  if (!window.keplr || !window.keplr.getOfflineSignerAuto) {
    throw new Error("Keplr extension not installed");
  }
  await window.keplr.enable(import.meta.env.VITE_APP_CHAIN_ID).catch((err) => {
    console.error(err);
    throw new Error("Keplr can't connect to this chainId!");
  });
  const offlineSigner = await window.keplr.getOfflineSignerAuto(
    import.meta.env.VITE_APP_CHAIN_ID
  );
  const client = await SigningStargateClient.connectWithSigner(
    import.meta.env.VITE_APP_RPC,
    offlineSigner,
    {
      prefix: "cudos",
      gasPrice: GasPrice.fromString("5000000000000acudos"),
    }
  );
  return client;
};

export const getConnectedAccount = async (): Promise<AccountDetails> => {
  const key = await window.keplr!.getKey(import.meta.env.VITE_APP_CHAIN_ID);
  return { address: key.bech32Address, username: key.name };
};
```

The function `keplrSigningClient` returns a promise of `SigningStargateClient`, of the CudosJs library, which we use to sign and broadcast messages to the Cudos network. 

```tsx
if (!window.keplr || !window.keplr.getOfflineSignerAuto) {
	throw new Error("Keplr extension not installed");
}
```

We first confirm that the Keplr extension is installed in the browser, otherwise we throw an error. 

```tsx
await window.keplr.enable(import.meta.env.VITE_APP_CHAIN_ID).catch((err) => {
    console.error(err);
    throw new Error("Keplr can't connect to this chainId!");
  });
```

Next, we make an async call on keplr’s the enable method to request the user's permission to authorise our dapp to access the cudos chain on Keplr wallet. The `enable()` method also requests that the user unlocks the wallet if it is locked and it throws an error if the user cancels the unlock or rejects the permission.

```tsx
const offlineSigner = await window.keplr.getOfflineSignerAuto(
    import.meta.env.VITE_APP_CHAIN_ID
  );
```

We then pass in the cudos chain id to keplr’s `getOfflineSignerAuto()` method. 

<aside>

💡 An Offline signer allows us to securely sign our transactions with our private key saved in the wallet, without exposing the private key to the internet.

</aside>

```tsx
const client = await SigningStargateClient.connectWithSigner(
    import.meta.env.VITE_APP_RPC,
    offlineSigner,
    {
      prefix: "cudos",
      gasPrice: GasPrice.fromString("5000000000000acudos"),
    }
  );
  return client;
```

With the snippet above, we instantiate a `SigningstargateClient` object, by calling on the `SigningStargate.connectWithSigner()` function from the CudosJs library. We pass in parameters such as rpc node endpoint, offlineSigner and an object containing optional parameters prefix and gasPrice, other acceptable options are broadcastTimeoutMs and lots more. 

The returned `client` is an instance that is connected to the Cudos rpc endpoint to broadcast and view transaction history on Cudos. You may check your editor’s intellisense to see the possible methods/functions available to us. 
Upon completing this step, your project should be similar to what can be found here[branch 3].

## STEP 04 Composing Queries and Transactions

<aside>

💡 Interactions with the blockchain can be either **queries** that read from the network or **transactions** that change the state of the blockchain. 
Transaction objects are made up of `context` (metadata ) and (signed) Messages.

</aside>

In this step, we are going to create classes/functions related to the nft minting. In the same `ledger` directory, create a file named `NftClient.ts` which will contain the code below:

*Your code editor may point out an error with some of the imports but we will create the files later.*

```tsx
//ledger/NftClient.ts
import {
    Account,
    assertIsDeliverTxSuccess,
    GasPrice,
    StargateClient,
    generateMsg,
  } from "cudosjs";

  import {
    QueryCollectionResponse,
    QueryDenomByNameResponse,
    QueryDenomBySymbolResponse,
    QueryDenomResponse,
    QueryDenomsResponse,
    QueryNFTResponse,
    QuerySupplyResponse,
  } from "cudosjs/build/stargate/modules/nft/proto-types/query";
  import { IssueMessage, MintMessage } from "../types/nft";
  import { getConnectedAccount, keplrSigningClient } from "./KeplrLedger";

  const queryClient = await StargateClient.connect(import.meta.env.VITE_APP_RPC);
  const cudosSigningStargateClient = await keplrSigningClient();

  export interface INftQueryClient {
    getAllDenoms: () => Promise<QueryDenomsResponse>;
    getDenom: (denomId: string) => Promise<QueryDenomResponse>;
    getToken: (denomId: string, tokenId: string) => Promise<QueryNFTResponse>;
    getAllTokensInCollection: (
      denomId: string
    ) => Promise<QueryCollectionResponse>;
    isValidAddress: (address: string) => Promise<Account | null>;
    getDenomByName: (denomName: string) => Promise<QueryDenomByNameResponse>;
    getDenomBySymbol: (symbol: string) => Promise<QueryDenomBySymbolResponse>;
    getNFTDenomSupply: (denomId: string) => Promise<QuerySupplyResponse>;
  }
  
  export class NftQueryClient implements INftQueryClient {

    getAllDenoms() {
      return queryClient.nftModule.getNftDenoms();
    }
    getDenom(denomId: string) {
      return queryClient.nftModule.getNftDenom(denomId);
    }
    getToken(denomId: string, tokenId: string) {
      return queryClient.nftModule.getNftToken(denomId, tokenId);
    }
    getAllTokensInCollection(denomId: string) {
      return queryClient.nftModule.getNftCollection(denomId);
    }
    isValidAddress(address: string) {
      return queryClient.getAccount(address);
    }
  
    getDenomByName(denomName: string) {
      return queryClient.nftModule.getNftDenomByName(denomName);
    }
    getDenomBySymbol(symbol: string) {
      return queryClient.nftModule.getNftDenomBySymbol(symbol);
    }
    getNFTDenomSupply(denomId: string) {
      return queryClient.nftModule.getNftDenomSupply(denomId);
    }
  }

  export interface INftClient {
    issueDenom: (denomMessage: IssueMessage) => Promise<void>;
    mintNFT: (mintMessage: MintMessage) => Promise<void>;
  }
  
  export class NftClient implements INftClient {
    client = cudosSigningStargateClient;
  
    async issueDenom(denomMessage: IssueMessage) {
      const account = await getConnectedAccount();
      const denomMsg = generateMsg("msgIssueDenom", denomMessage);
  
      const result = await this.client.signAndBroadcast(
        account.address,
        [denomMsg],
        "auto"
      );
      assertIsDeliverTxSuccess(await result);
    }
  
    async mintNFT(mintMessage: MintMessage) {
      const account = await getConnectedAccount();
      const result = await this.client.nftMintToken(
        account.address,
        mintMessage.denomId,
        mintMessage.name,
        mintMessage.uri,
        mintMessage.data,
        mintMessage.recipient,
        GasPrice.fromString(import.meta.env.VITE_GAS_PRICE)
      );
  
      assertIsDeliverTxSuccess(result);
    }
  
    disconnect() {
      this.client.disconnect();
    }
  }
```

 For the purpose of this tutorial, we will create two classes, one for query, and the other for executing transactions.

```tsx
//ledger/NftClient.ts
... 
const queryClient = await StargateClient.connect(import.meta.env.VITE_APP_RPC);
const cudosSigningStargateClient = await keplrSigningClient();
...
```

Now, let us have a look at the code you pasted earlier. First, we initialise the connection to the cudos network. Then, we declare the interface of the classes, describing the methods that will be implemented for each class: `INftQueryClient` (for queries) and `INftClient` (for writing onto the blockchain). `NftQueryClient` class’ methods include `getDenom`, `getAllDenom`, `getToken`, etc. These methods call their corresponding methods in the `queryClient` instance of the `StargateClient` class. 

Unlike, the SigningStargate client we talked about in Step 03, the stargateClient is a read-only client. You can check the editor’s intellisense to see the possible methods/functions available to us. Link to the sourcecode of the cudos Stargate class from cudosjs.

The `NftClient` class implements the `INftClient` interface and defines methods to issue and mint NFTs. These methods include `issueDenom` and `mintNFT`. These methods use the `cudosSigningStargateClient` instance of the `keplrSigningClient` function to sign and broadcast transactions to the Cudos network.

We would explore 2 approaches to sending (signed) transactions to the network: 

1.  Using the module-specific methods available via the **client,** as used in the `mintNFT()`. With this approach, we access the `CudosSigningStargateClient` ’s methods available in the Cudosjs library, in this case, `this.client.nftMintToken()`.  

This is the method signature of `nftMintToken()`

Let us take a look at the corresponding snippet.

```tsx
nftMintToken(sender: string,
						 denomId: string, 
						 name: string, 
						 uri: string, 
						 data: string, 
						 recipient: string, 
						 gasPrice: GasPrice, 
						 memo?: string, 
						 gasMultiplier?: number)
: Promise<DeliverTxResponse>;
```

The async method has parameters such as transaction`sender` address, token `name`, `uri` pointing to a the location of token info, `data` string, `recipient` address (i.e. the address of the owner of the minted token), the `gasPrice`  the price we are willing to pay for a single unit of gas, optional `memo` (string) that can be attached to the transaction, and an optional `gasMultiplier.`

```tsx
import {...assertIsDeliverTxSuccess, GasPrice } from "cudosjs";
import { MintMessage... } from "../types/nft";
import { getConnectedAccount, keplrSigningClient } from "./KeplrLedger";
...
export class NftClient implements INftClient {
  client = cudosSigningStargateClient;
...
  async mintNFT(mintMessage: MintMessage) {
    const account = await getConnectedAccount();
    const result = await this.client.nftMintToken(
      account.address,
      mintMessage.denomId,
      mintMessage.name,
      mintMessage.uri,
      mintMessage.data,
      mintMessage.recipient,
      GasPrice.fromString(import.meta.env.VITE_GAS_PRICE)
    );

    assertIsDeliverTxSuccess(result);
}
...
...
```

`mintNFT` returns a promise of type `DeliverTxResponse` with this structure

```tsx
export interface DeliverTxResponse {
    readonly height: number;
    /** Error code. The transaction suceeded iff code is 0. */
    readonly code: number;
    readonly transactionHash: string;
    readonly rawLog?: string;
    readonly data?: readonly MsgData[];
    readonly gasUsed: number;
    readonly gasWanted: number;
}
```

We can then call on `assertIsDeliverTxSuccess()` passing in the response. This asserts that the response is that of a successful transaction, otherwise it throws an error. If no error is thrown, the token must have been minted successfully.

<aside>

💡 **GasMultiplier**
Instead of specifying the gas price, you may use the `"gas": "auto”`  so that the blockchain application automatically estimates gas for you before submitting the transaction into the network for consensus with the estimate.
This is why we include the `gasMultiplier`. By providing the gas multiplier you are specifying that the gas estimate should be multiplied by this number to account for possible changes in the gas fee estimate and the eventual gas fee. See [The estimate is not always the exact gas required for the transaction execution.](https://github.com/cosmos/cosmos-sdk/issues/4938)

</aside>

1. Usually, the Cudosjs`SigningStargateClient` methods are enough. But, sometimes you may need to manually create and send messages in a transaction. This second approach to sending transactions to the blockchain network is by using the signing stargate client’s `signAndBroadcast` function. Let us have a look at the function signature. 

```tsx
signAndBroadcast(
	signerAddress: string,
	messages: readonly EncodeObject[], 
	fee: StdFee | "auto" | number, 
	memo?: string): Promise<DeliverTxResponse>;
```

It takes the `signerAddress`, an array of `messages` of type `EncodeObject`, the fee (gas fee and tokens attached to the transaction), and lastly, an optional `memo` which is a string sent along with the transaction. `signAndBroadcast` also returns a promise of type `DeliverTxResponse`. 

CudosJS comes with a utility function called `generateMsg` to make it easier to create custom messages.

```tsx
function generateMsg(msgName: string, params: object):EncodeObject
```

`generateMsg`’s parameters are : a string `msgName` and `params`, an object containing the message’s properties. The provided `msgName` must correspond to the ones exposed by our blockchain application interface, See https://github.com/CudoVentures/cudos-node on Github.

```tsx
...
import {...generateMsg} from "cudosjs";
import { IssueMessage... } from "../types/nft";
import { getConnectedAccount, keplrSigningClient } from "./KeplrLedger";
...
export class NftClient implements INftClient {
  client = cudosSigningStargateClient;

  async issueDenom(denomMessage: IssueMessage) {
    const account = await getConnectedAccount();
    const denomMsg = generateMsg("msgIssueDenom", denomMessage);

    const result = await this.client.signAndBroadcast(
      account.address,
      [denomMsg],
      "auto"
    );
    assertIsDeliverTxSuccess(await result);
  }
...
...
```

Our `issueDenom` method accepts the parameter `denomMessage` object. The object is then passed into the `generateMsg` function, as the second parameter.  We then await the call to `signAndBroadcast()`, passing its response to the `assertIsDeliverTxSuccess` .

Now let us resolve the issue with the type imports.

### The  `types/nft.ts` file

Create the `nft.ts` file in the `types` directory and paste the following code for interface declaration. 

```tsx
export interface Denom {
  id: string;
  name: string;
  schema: string;
  creator: string;
  symbol: string;
}
export interface Nft {
  id: string;
  name: string;
  uri?: string;
  data?: string;
  owner: string;
  approvedAddresses?: string[];
}

export interface Collection {
  denom: Denom;
  nfts?: Nft[];
}

export interface AllTokenResponse {
  collection: Collection;
  pagination?: Pagination;
}

export interface Pagination {
  total: {
    low: number;
    high: number;
    unsigned: boolean;
  };
  nextkey: object;
}

export interface IssueMessage {
  id: string;
  name: string;
  symbol: string;
  from: string;
  schema: string;
  chainId: string;
  sender: string;
}

export interface MintMessage {
  denomId: string;
  name: string;
  uri: string;
  data: string;
  from: string;
  recipient: string;
  chainId: string;
}
```

This file contains the definition of the interfaces relating to our project. We imported some of the interfaces in this step, we would use the rest in the coming steps.
Upon completing this step, your project should be similar to what can be found here [branch 4].

## Step 05 Creating the components for Minting NFTs

In this and the following steps, we are going to create the components needed for our dApp UI. Now create a folder named `components` inside the `src` directory wherein we would put our components.

*Remember, we are using the Material UI component library.*

Here we are going to create the various components used in the NFT minting process. They are `FormInput`,  `DenomForm`, `NftForm`, and Mint that is the parent component comprising the other ones. The minting process may take either of these 2 forms:

- A user can start by creating a new NFT denom, and minting one or more nfts belonging to the denom.
- A user can mint more NFTs when viewing a list of NFTs belonging to an already existing denom.

### FormInput

Create a `MintForm` directory in the `components` directory and add the `FormInput.tsx` file, with the below content.

```tsx
import React, { FC } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Material UI TextField Component
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#5e5b5d",
    fontWeight: 400,
  },
  "& .MuiInputBase-input": {
    borderColor: "#c8d0d4",
  },
  "& .MuiInput-underline:after": {
    border: "none",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-error": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d32f2f",
      },
    },
    "& fieldset": {
      borderColor: "#c8d0d4",
      borderRadius: 0,
    },
    "&:hover fieldset": {
      border: "1px solid #c8d0d4",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #c8d0d4",
    },
  },
});

type FormInputProps = {
  name: string;
} & TextFieldProps;

const FormInput: FC<FormInputProps> = ({ name, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <CssTextField
          {...field}
          {...otherProps}
          variant="filled"
          sx={{ mb: "1.5rem" }}
          error={!!errors[name]}
          helperText={
            errors[name] ? (errors[name]?.message as unknown as string) : ""
          }
        />
      )}
    />
  );
};

export default FormInput;
```

The **`FormInput`** component is a reusable form input field that integrates with **`react-hook-form`** and provides styled Material-UI components to simplify validated form input creatiion. It handles form validation and error handling.  It takes `name` and other props. The component uses react-hook-form’s **`useFormContext`** to access the form context and **`Controller`** to manage the field's value and registration.  The **`error`** prop and **`helperText`** display validation errors if present. 

For an in-depth explanation of how the components, react-hook-form and zod work please [read this](https://codevoweb.com/react-material-ui-and-react-hook-form-html-forms/) and [this](https://react-hook-form.com/api/useform/). 

### DenomForm

This component is used for the first step in Minting NFT collections. It contains the form for creating a denom. The form we will create will take denom details such as required  `DenomId`, `Name`, `Symbol`, and an optional `Description`.  Add a newfile named `DenomForm.tsx` into the `MintForm` folder.

```tsx
import React, { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./FormInput";
import { IssueMessage } from "../../types/nft";
import { NftQueryClient } from "../../ledgers/NftClient";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { useSnackbar } from "notistack";

const nftQueryClient = new NftQueryClient();
const denomFormSchema = object({
  denomId: string()
    .min(4, "DenomId should be at least 4 alphanumeric character")
    .max(8, "DenomId should not be more than 8 characters").refine(
      async (val) => {
        try {
          const denom = await (await nftQueryClient.getDenom(val)).denom;
          return denom == null;
        } catch (e: any) {
          return e.message.includes("not found denom");
        }
      },
      { message: "DenomId already in use." }
    ),
  name: string()
    .min(4, "Name is required.")
    .max(20, "Name should not be more than 20 characters.")
    .refine(
      async (val) => {
        try {
          const denom = await (await nftQueryClient.getDenomByName(val)).denom;
          return denom == null;
        } catch (e: any) {
          return e.message.includes("not found denom");
        }
      },
      { message: "Name already in use" }
    ),
  symbol: string()
    .min(3, "Symbol must be at least 3 characters.")
    .max(6, "Symbol cannot be more than 6 characters.")
    .refine(
      async (val) => {
        try {
          const denom = await (
            await nftQueryClient.getDenomBySymbol(val)
          ).denom;
          return denom == null;
        } catch (e: any) {
          return e.message.includes("not found denom");
        }
      },
      { message: "Symbol already in use" }
    ),

  description: string().optional(),
});

type IDenom = TypeOf<typeof denomFormSchema>;

export type DenomFormProps = {
  createDenom: (denom: IssueMessage) => Promise<string | undefined>;
  account: AccountDetails | null;
  setDenomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsCreatingCollectionSucceed: React.Dispatch<React.SetStateAction<boolean>>;
  setNextStep: () => void;
};

export const DenomForm = ({
  createDenom,
  account,
  setDenomId: setDenomId,
  setIsCreatingCollectionSucceed,
  setNextStep,
}: DenomFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

const defaultValues: IDenom = {
    denomId: "",
    name: "",
    symbol: "",
    description: "",
  };

  const denomFormMethods = useForm<IDenom>({
    resolver: zodResolver(denomFormSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<IDenom> = async (values: IDenom) => {
    if (account?.address) {
      const denom: IssueMessage = {
        id: values.denomId,
        name: values.name,
        symbol: values.symbol,
        from: account.address,
        schema: values.description ?? "",
        chainId: import.meta.env.VITE_APP_CHAIN_ID,
        sender: account.address,
      };
      try {
        const successReturnsDenom = await createDenom(denom);
        setDenomId(successReturnsDenom);
        setIsCreatingCollectionSucceed(true);
        enqueueSnackbar("Collection Created", { variant: "success" });
        setNextStep(); 
      } catch (error: any) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    } else {
      setIsCreatingCollectionSucceed(false);
      throw new Error("Please Connect your Keplr Wallet");
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100%",
        width: "fit-content",
        backgroundColor: { xs: "#fff", md: "#f4f4f4" },
      }}
    >
      {/* react hook form's FormProvider */}
      <FormProvider {...denomFormMethods}>
        <Box
          display="flex"
          flexDirection="column"
          component="form"
          noValidate
          autoComplete="off"
          sx={{ py: "6rem", px: "1rem", width: "50vw" }}
          onSubmit={(e) => {
            setIsLoading(true);
            denomFormMethods
              .handleSubmit(onSubmitHandler)(e)
              .catch((error: any) => {
                enqueueSnackbar(error.message, {
                  variant: "error",
                });
              })
              .finally(() => setIsLoading(false));
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{ textAlign: "center", mb: "1.5rem" }}
          >
            Create Asset Collection
          </Typography>

          <FormInput
            label="DenomId"
            type="text"
            name="denomId"
            focused
            required
          />
          <FormInput label="Name" type="text" name="name" focused required />
          <FormInput
            type="text"
            label="Symbol"
            name="symbol"
            required
            focused
          />

          <FormInput
            type="text"
            label="Description"
            name="description"
            focused
          />

          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{
              py: "0.8rem",
              mt: 2,
              width: "80%",
              marginInline: "auto",
            }}
          >
            Create Collection
          </LoadingButton>
        </Box>
      </FormProvider>
    </Container>
  );
};
```

This is quite a long one! However, what goes on is easy to grasp. Firstly, we declare a constant variable, passing in to it the `NftQueryClient` we created in step 04 — we would use this to validate that the denomId, denom name, and denom symbol inputs are not already taken.  The component uses Zod package to validate form input fields. 

The Denom form validation schema is defined with ZodObject. We define simple validation rules like minimum and maximum characters. The interesting rule is where we used Zod’s refine method. 

```tsx
...
const denomFormSchema = object({
  denomId: string()
    .min(4, "DenomId should be at least 4 alphanumeric character")
    .max(8, "DenomId should not be more than 8 characters")
    .refine(
      async (val) => {
        try {
          const denom = await (await nftQueryClient.getDenom(val)).denom;
          return denom == null;
        } catch (e: any) {
          return e.message.includes("not found denom");
        }
      },
      { message: "DenomId already in use." }
    ),
  ...
  description: string().optional(),
});
```

The custom validation with zod checks if the provided **`denomId`** already exists by making a query to the **`nftQueryClient.getDenom()`.** If the denom name is already taken, a valid object is returned, we expect a null response for an available denomId. Hence the validation returns false for a denomId that is in use, and returns true for a denomId that is available. Similar logic is used for the name, and symbol validation. The defined schema

The `DenomForm` component takes the following props:

- `createDenom` function that sends denom creation request to the blockchain network, it returns a promise containing the denomId string.
- `props.account` - object containining the details of the connected account, or null if no account is connected.
- `setDenomId`  this function sets the DenomId property in the Mint component after a Denom has been successfully created.
- `setIsCreatingCollectionSucceed` this function is used to inform the parent Mint component whether the denom was created successfully.
- `setNextStep` this function sets the next step in the NFT minting process

Now let us have a look at what happens when a form is submitted. 

```tsx
const onSubmitHandler: SubmitHandler<IDenom> = async (values: IDenom) => {
    if (account?.address) {
      const denom: IssueMessage = {
        id: values.denomId,
        ... };
      try {
        const successReturnsDenom = await createDenom(denom);
        setDenomId(successReturnsDenom);
        setIsCreatingCollectionSucceed(true);
        enqueueSnackbar("Collection Created", { variant: "success" });
        setNextStep(); 
      } catch (error: any) {
		   ...
    }
  };
```

When the form is submitted, it triggers the **`onSubmitHandler`** function, which creates the collection using the form data. If the creation is successful, it sets the state and also calls the function that sets the next step, and displays  a success message. If there's an error during the creation process, an error message is displayed. The form also includes a loading button that indicates the submission is in progress.

### NftForm

Also a child of the `Mint` component, this is involved in the 2nd step of the minting process. It is used to mint the actual NFTs in a collection/denom. In the `MintForm` directory, create a file named `NftForm.tsx` and paste the below code into it. 

```tsx
import React, { useState } from "react";
import { Container,  Box,  Typography,  FormControlLabel,  Checkbox} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { boolean, object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./FormInput";
import { MintMessage } from "../../types/nft";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { useSnackbar } from "notistack";

const nftFormSchema = object({
  name: string()
    .min(4, "Name is required")
    .max(20, "Name should not be more than 20 character"),
  uri: string().url("This must be a valid url"),
  data: string().optional(),
  mintForAnotherAddress: boolean().optional(),
  recipient: string(),
});
type INFT = TypeOf<typeof nftFormSchema>;

export type NftFormProps = {
  account: AccountDetails | null;
  mintNft: (mintMessage: MintMessage) => Promise<string | undefined>;
  denomId: string | undefined;
  setIsMintingNFTSucceed: any;
};

export const NftForm = ({
  mintNft,
  account,
  denomId,
  setIsMintingNFTSucceed,
}: NftFormProps) => {
  const [currentAccountIsRecipient, setCurrentAccountIsRecipient] =
    useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues: INFT = {
    name: "",
    recipient: account?.address ?? "",
    data: "",
    uri: "",
    mintForAnotherAddress: false,
  };

  const methods = useForm<INFT>({
    resolver: zodResolver(nftFormSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<INFT> = async (values: INFT) => {
    if (account?.address && denomId) {
      const mintMsg: MintMessage = {
        denomId: denomId,
        name: values.name,
        uri: values.uri,
        data: values.data ?? "",
        from: account.address,
        recipient: values.mintForAnotherAddress
          ? values.recipient
          : account.address,
        chainId: import.meta.env.VITE_APP_CHAIN_ID,
      };
      try {
        await mintNft(mintMsg);
        enqueueSnackbar("NFT Minted", {
          variant: "success",
        });
        setIsMintingNFTSucceed(true);
        methods.reset(defaultValues);
        handleNFTOwnerToggle();
      } catch (error: any) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    } else {
      throw new Error("Please Connect your Keplr Wallet");
    }
  };

  const handleNFTOwnerToggle = () => {
    setCurrentAccountIsRecipient(!currentAccountIsRecipient);
    if (currentAccountIsRecipient) {
      methods.setValue("recipient", "");
    } else {
      methods.setValue("recipient", "currentUser");
    }
  };

  return (
    <Container
      sx={{ height: "100%", backgroundColor: "text.secondary", width: "40em" }}
    >
      <FormProvider {...methods}>
        <Box
          display="flex"
          flexDirection="column"
          component="form"
          noValidate
          autoComplete="off"
          sx={{ py: "6rem", px: "1rem" }}
          onSubmit={(e) => {
            setIsLoading(true);
            methods
              .handleSubmit(onSubmitHandler)(e)
              .catch((error) => {
                enqueueSnackbar(error.message, {
                  variant: "error",
                });
              })
              .finally(() => setIsLoading(false));
          }}
        >
          <Typography
            variant="h6"
            component="h1"
            sx={{ textAlign: "center", mb: "1.5rem" }}
          >
            Mint Asset as NFT
          </Typography>

          <FormInput label="Name" type="text" name="name" focused required />
          <FormInput type="text" label="URI" name="uri" required focused />

          <FormInput
            type="text"
            label="Description"
            name="data"
            focused
            required
            multiline
            rows={5}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                aria-label="mint for someone else checkbox"
                sx={{ outline: "1px solid #576b92" }}
                color="secondary"
                checked={!currentAccountIsRecipient}
                inputProps={{ "aria-label": "controlled" }}
                {...methods.register("mintForAnotherAddress", {
                  onChange: (e) => {
                    handleNFTOwnerToggle();
                  },
                })}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "#5e5b5d",
                  padding: "1rem",
                }}
              >
                Mint NFT to a Separate Address
              </Typography>
            }
          />

          {!currentAccountIsRecipient && (
            <FormInput
              type="text"
              label="Recipient Address"
              name="recipient"
              InputProps={{
                readOnly: currentAccountIsRecipient,
              }}
            />
          )}

          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{
              py: "0.8rem",
              mt: 2,
              width: "80%",
              marginInline: "auto",
            }}
          >
            Mint Asset
          </LoadingButton>
        </Box>
      </FormProvider>
    </Container>
  );
};
```

`NftForm` component takes the following props:

- `mintNft`function that sends the mint request to the blockchain returns a promise containing the nft's name as string.
- `account` containining the details of the connected account, or null if no account is connected.
- `denomId` this is the denomId of the Collection the NFT is a part of.
- `setIsMintingNFTSucceed` tthis function is used to inform the parent component (Mint) whether the NFT was minted successfully (true) or not (false).

This component uses react-hook-form and Zod just like the `DenomForm` component, so we would not have to go into details as most of it has been explained earlier. The nft form has a checkbox that can be toggled by the user to indicate whether the owner of the NFT is the connected account, or a different one — if it a different account, an input field is displayed where the recipient account can be entered.

### Mint

The `Mint` component is where we tie all the 3 components created earlier in this step together. The component includes sub-components such as `DenomForm` for creating a collection/denom and `NftForm` for minting NFTs. It uses MUI stepper to track the progress of the minting process, handles the navigation between steps, and allows the user to reset the process or view their collections. 

Create a file named `Mint.tsx` in the `MintForm` folder, pasting into it the code below.

```tsx
import React, { useEffect, useState } from "react";
import {StepLabel, Button, Box, Stepper, Step, StepContent,} from "@mui/material";
import Typography from "@mui/material/Typography";
import { DenomForm } from "./DenomForm";
import { NftForm } from "./NftForm";
import { IssueMessage, MintMessage } from "../../types/nft";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { useLocation, useNavigate } from "react-router-dom";

const steps = ["Create Collection", "Mint NFT for an Asset"];

type MintProps = {
  account: AccountDetails | null;
  mintNft: (mintMessage: MintMessage) => Promise<string | undefined>;
  createDenom: (denom: IssueMessage) => Promise<string | undefined>;
};
export const Mint = ({ account, createDenom, mintNft }: MintProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [denomId, setDenomId] = useState<string | undefined>();
  const [isCreatingCollectionSucceed, setIsCreatingCollectionSucceed] =
    useState(false);
  const [isMintingNFTFSucceed, setIsMintingNFTSucceed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = () => {
    setActiveStep(0);
    setDenomId(undefined);
    setIsCreatingCollectionSucceed(false);
    setIsMintingNFTSucceed(false);
  };

  useEffect(() => {
    setDenomId(location.state);
    if (location.state) {
      handleNext();
    }
  }, [location]);

  const handleBack = () => {
    setIsMintingNFTSucceed(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <Box sx={{ padding: "2em" }}>
      <Box sx={{ backgroundColor: "background.default", padding: "2em" }}>
        <Box sx={{ padding: "2em" }}>
          <Typography variant="h6" color="text.secondary">
            Mint NFTs to represent your physical assets on the Cudos Blockchain
          </Typography>
        </Box>
        <Box>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel> {steps[0]}</StepLabel>
              <StepContent>
                <DenomForm
                  createDenom={createDenom}
                  account={account}
                  setDenomId={setDenomId}
                  setIsCreatingCollectionSucceed={
                    setIsCreatingCollectionSucceed
                  }
                  setNextStep={handleNext}
                />
              </StepContent>
            </Step>

            <Step>
              <StepLabel>{steps[1]}</StepLabel>
              <StepContent>
                <NftForm
                  mintNft={mintNft}
                  account={account}
                  denomId={denomId}
                  setIsMintingNFTSucceed={setIsMintingNFTSucceed}
                />
              </StepContent>
            </Step>
          </Stepper>
          {isMintingNFTFSucceed && (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Successfully minted NFT
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={(event) => {
                      event.preventDefault();
                      handleReset();
                    }} variant="contained">
                        Create A New Collection
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(`/collections`);
                    }}
                  >
                    View Your Collections
                  </Button>
                </Box>
            </React.Fragment>
          )}
            </Box>
      </Box>
    </Box>
  );
};
```
Upon completing this step, your project should be similar to what can be found here[branch 5].

## Step 06 Creating the components for Displaying NFTs
### Collection Components

The components in this folder are going to be used in displaying the details related to an NFT collection.  Create a folder inside of the `components` folder, giving it the name `Collection`.

The `Collection.tsx` file contains code for the `Collection` component. This component renders a card that displays information about each NFT collection i.e. denom. 

```tsx
import React from "react";
import {  Tooltip,  Box,  Card,  CardHeader,  CardContent,  CardActions,
  Avatar,  IconButton,  Typography,} from "@mui/material";
import { OpenInFullRounded, MoreVert } from "@mui/icons-material";
import { Denom } from "../../types/nft";
import { useNavigate } from "react-router-dom";

type CollectionProps = {
  denom: Denom;
};

export const Collection = ({ denom }: CollectionProps) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 400,
          height: 300,
          bgcolor: "background.default",
          boxShadow: 1,
          borderRadius: 5,
          p: 2,
          borderColor: "secondary.light",
          "&:hover": {
            opacity: [0.9, 0.8, 0.7],
          },
        }}
        variant="outlined"
      >
        <CardHeader
          avatar={
            <Tooltip title={denom.symbol}>
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  width: 48,
                  height: 48,
                  borderColor: "primary",
                }}
                sizes="md"
                aria-label="symbol"
              >
                <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                  {denom.symbol
                    ? denom.symbol.substring(0, 5).toLocaleUpperCase() //truncate the denom symbol to display the first 5 characters
                    : ""}
                </Typography>
              </Avatar>
            </Tooltip>
          }
          title={
            <Tooltip title={denom.name}>
              <Typography color="text.secondary">
                {`${denom.name.substring(0, 5).toLocaleUpperCase()}`}
              </Typography>
            </Tooltip>
          }
          subheader={
            <Tooltip title={denom.creator}>
              <Typography sx={{ my: 1.5, fontSize: 12 }} color="text.secondary">
                {`${denom.creator.substring(0, 7)}...${denom.creator.substring(
                  denom.creator.length - 5,
                  denom.creator.length - 1
                )}`}
              </Typography>
            </Tooltip>
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {denom.schema}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Tooltip title="View NFTs in Collection">
            <IconButton
              aria-label="View Collection"
            >
              <OpenInFullRounded color="primary" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );
};
```

This component takes `denom` object, containing information about the collection to be displayed, as a prop. The **`navigate`** function inside the component uses the **`useNavigate`** hook from **`react-router-dom`,** we would use this later after we have defined our routes.

Reviewing the code, you will see that we are using a card to display the denom info. The card's content includes a **`CardHeader`** with an avatar, title, and subheader. The avatar displays the first 5 characters of the denom symbol, and the title displays the name of the collection also truncated to the first 5 characters. The subheader displays the account that created of the collection truncated to show only a portion of the address. The body of the card displays more details about the denom.

### The `CollectionsList` component

```tsx
import React from "react";
import { Box, Grid, Typography, Divider, Button, Card, CardMedia, CardContent} from "@mui/material";
import { QueryDenomsResponse } from "cudosjs/build/stargate/modules/nft/proto-types/query";
import { useEffect, useState } from "react";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { Collection } from "./Collection";
import reified from "../../assets/reified.png";
import { Denom } from "../../types/nft";
import { useNavigate } from "react-router-dom";

type CollectionListProps = {
  getDenom: () => Promise<QueryDenomsResponse>;
  account: AccountDetails | null;
};
export const CollectionList = ({ getDenom, account }: CollectionListProps) => {
  const navigate = useNavigate();
  const [filteredDenoms, setFilteredDenom] = useState<Denom[]>([]);

  useEffect(() => {
    (async () => {
      const resp = await getDenom();
      setFilteredDenom(
        resp?.denoms.filter((denom) => denom.creator == account?.address) ?? []
      );
    })();
  }, [getDenom, account]);

  if (filteredDenoms.length < 1) {
    return (
      <Card sx={{ display: "flex", width: "95vw", height: "100vh" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1", width: "40vW", padding: 5 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ padding: 5 }}
            >
              You have not Created any Collections
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="div"
              sx={{ padding: 5 }}
            >
              Mint NFTs to represent your physical assets on the Cudos
              Blockchain. Connect your Wallet to start minting NFTs on Reified.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 5 }}
              onClick={(event) => {
                event.preventDefault();
                navigate(`/mint`);
              }}
            >
              Create Collection
            </Button>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ flex: "1", width: "100%", height: "100%", objectFit: "cover" }}
          image={reified}
          alt="Live from space album cover"
          sizes="(max-width: 600px) 50vw,
                    800px"
        />
      </Card>
    );
  }
 return (
    <Box sx={{ padding: "5em", bgcolor: "background.paper" }}>
      {/* <Box sx={{ padding:'2em' }}> */}
      <Grid container wrap="nowrap" direction="column">
        <Grid item>
          <Typography gutterBottom variant="h5" component="div">
            Your Assets Collections
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom variant="h6" component="div">
            You can Expand Each Collection to Load the NFTs in each.
          </Typography>
        </Grid>
      </Grid>
      {/* </Box> */}
      <Divider sx={{ margin: "1em" }}></Divider>
      <Box sx={{ flexGrow: 1, minHeight: "60vh", my: 5, mx: 3, padding: 3 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 25 }}
        >
          {filteredDenoms.map((denom, index) => (
            <Grid item xs={4} sm={4} md={4} lg={5} key={index}>
              <Collection denom={denom}></Collection>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
```

The `CollectionList` component displays a list of the connected user's NFT denoms. It uses the collection component as its child component; it takes 2 props: `getDenom` function, and an `account` object. We get and set the user’s NFT collections/denom in the `useEffect` hook, using the `getDenom` function. The denoms owned by the connected account are stored in the `filteredDenoms` state.  

When a user does not have any NFT collections, the component displays a message with a button to create a collection, otherwise the collections are displayed in a grid.

### NFT components

Create a folder inside of the components folder, giving it the name `Nft`, this folder will contain the components related to NFT. 

Now, create a file named `Nft.tsx` with the below content:

```tsx
import React from "react";
import {
  Tooltip,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { OpenInFullRounded, MoreVert } from "@mui/icons-material";
import { Nft as Token } from "../../types/nft";

type NFTProps = {
  nft: Token;
};

export const NFT = ({ nft }: NFTProps) => {
  return (
    <Box>
      <Card
        sx={{
          maxWidth: 400,
          height: 300,
          bgcolor: "background.default",
          boxShadow: 1,
          borderRadius: 5,
          p: 2,
          borderColor: "secondary.light",
          "&:hover": {
            opacity: [0.9, 0.8, 0.7],
          },
        }}
        variant="outlined"
      >
        <CardHeader
          avatar={
            <Tooltip title={nft.name}>
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  width: 48,
                  height: 48,
                  borderColor: "primary",
                }}
                sizes="md"
                aria-label="symbol"
              >
                <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>
                  {nft.name.substring(0, 5).toLocaleUpperCase()}
                </Typography>
              </Avatar>
            </Tooltip>
          }
          title={
            <Tooltip title={nft.name}>
              <Typography color="text.secondary">
                {`${nft.name.toLocaleUpperCase()}`}
              </Typography>
            </Tooltip>
          }
          subheader={
            <Tooltip title={nft.owner}>
              <Typography sx={{ my: 1.5, fontSize: 12 }} color="text.secondary">
                {`${nft.owner.substring(0, 7)}...${nft.owner.substring(
                  nft.owner.length - 5,
                  nft.owner.length - 1
                )}`}
              </Typography>
            </Tooltip>
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {nft.data}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Tooltip title={nft.uri}>
            <IconButton aria-label="Url">
              <OpenInFullRounded color="primary" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );
};
```

This component is a card displaying information about an NFT. It receives a prop `nft`, which is an object containing information about the NFT.

The card displays the name, owner address, and data of the NFT. The name is shown as an avatar containing the first 5 characters displayed in uppercase. The NFT name is also displayed as the card's title. The owner's full address is displayed as a tooltip when the runcated version of the owner's address is hovered on. The NFT data is displayed in the card's content section.

The card also includes a button represented by the `OpenInFullRounded` icon. Clicking on this button opens the URL associated with the NFT's URI. The URI is displayed as a tooltip for the button.

### NftList.tsx

Using the Nft component as a child component, we are going to create an `NtList` component; this displays a list of user’s NFT. To do this, create a file in the same folder with the name `NftList.tsx` and paste the following code into it:

```tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  CardContent,
  Card,
  Button,
  CardMedia,
  Fab,
  Tooltip,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { Nft as NftType } from "../../types/nft";
import { NFT as Nft } from "./Nft";
import reified from "../../assets/reified.png";
import { useNavigate, useLocation } from "react-router-dom";
import { QueryCollectionResponse } from "cudosjs/build/stargate/modules/nft/proto-types/query";

type NftListProps = {
  getNft: (denomId: string) => Promise<QueryCollectionResponse>;
  account: AccountDetails | null;
};
export const NftList = ({ getNft, account }: NftListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const denomId = location.state;
  const [collection, setCollection] = useState<QueryCollectionResponse>();
  const [filteredNFT, setFilteredNFTs] = useState<NftType[]>([]);

  useEffect(() => {
    (async () => {
      const resp = await getNft(denomId);
      setCollection(resp);
      setFilteredNFTs(
        resp?.collection?.nfts?.filter(
          (nft) => nft.owner == account?.address
        ) ?? []
      );
    })();
  }, [account]);

  if (filteredNFT.length < 1) {
    return (
      <Card sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1", width: "40vW", padding: 5 }}>
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ padding: 5 }}
            >
              You do not own any NFT in this Collection.
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="div"
              sx={{ padding: 5 }}
            >
              Mint NFTs to represent your physical assets on the Cudos
              Blockchain. Connect your Wallet to start minting NFTs on Reified.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 5 }}
              onClick={(event) => {
                event.preventDefault();
                navigate(`/mint`, { state: denomId });
              }}
            >
              Mint NFTs for Physical Assets
            </Button>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ flex: "1", width: "100%", height: "100%", objectFit: "cover" }}
          image={reified}
          sizes="(max-width: 600px) 50vw,
                    800px"
        />
      </Card>
    );
  }
  return (
    <Box sx={{ padding: "5em", bgcolor: "background.paper" }}>
      <Grid container wrap="nowrap">
        <Grid item xs={8}>
          <Typography gutterBottom variant="h5" component="div">
            {collection?.collection?.denom?.name} Collection
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography gutterBottom variant="h5" component="div">
            Symbol: {collection?.collection?.denom?.symbol}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title="Mint NFT To Add to Collection">
            <Fab
              color="primary"
              aria-label="add"
              onClick={(event) => {
                event.preventDefault();
                navigate(`/mint`, { state: denomId });
              }}
            >
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container wrap="nowrap" spacing={3}>
        <Grid item xs={8}>
          <Typography color="text.secondary" variant="h6" component="div">
            {collection?.collection?.denom?.schema}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="text.secondary" variant="h6" component="div">
            Count: {filteredNFT?.length}
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ m: "1em", color: "primary.dark" }} />
      <Box sx={{ flexGrow: 1, minHeight: "60vh", my: 5, mx: 3, padding: 3 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12, lg: 25 }}
        >
          {filteredNFT.map((nft, index) => (
            <Grid item xs={4} sm={4} md={4} lg={5} key={index}>
              <Nft nft={nft}></Nft>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
```

`NftList` shows a list of NFTs (Non-Fungible Tokens) in a collection, along with the information about the NFT collection, including the collection's name, symbol, schema, and the number of NFTs in the collection. It also provides a button to mint new NFTs and add them to the collection.

The component takes two props: `getNft`, a function that retrieves the NFT collection data, and `account`, an object containing details about the user's account. 

We use the `useLocation` hook to get the  `denomId` from the location state. We would be using react’s `useState` hook to manage the collection and filteredNFTs data. We are filtering the NFTs because we are only interested in displaying only NFTs owned by the connected user account. 

Inside the `useEffect` hook, an asynchronous function is called to retrieve the NFT collection data using the `getNft` function. The retrieved collection data is stored in the `collection` state, and the filtered NFTs owned by the connected user account are stored in the `filteredNFT` state.

If there are no NFTs owned by this user in the collection, we display the message “You do not own any NFT in this Collection.”, along with a button that the user can click to mint NFTs in the collection.

Otherwise, we display a list of Nfts. It displays the collection's name, symbol, schema, and the count. The list is represented by a grid layout, and each NFT is rendered using the `Nft` component, passing the respective NFT data as a prop.

Upon completing this step, your project should be similar to what can be found here[branch 6].

## Step 07 Tying the Components Together

Congratulations, you made it to the final step, this is where we tie together all the components we created earlier, by making a nav bar, a home page, and adding routing to our dApp.

### Nav Bar

This is a responsive navigation component that displays a material UI `App Bar` with logos and navigation links as well as the user wallet/account information.
Create a folder inside the `components` folder and give it the name `Nav` , and in this folder create a file named `Nav.tsx` .

```tsx
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import DiamondIcon from "@mui/icons-material/Diamond";
import { AccountDetails } from "../../ledgers/KeplrLedger";
import { useNavigate } from "react-router-dom";

interface NavProps {
  connect: () => Promise<void>;
  account: AccountDetails | null;
  disconnect: () => void;
  isConnected: boolean;
}

function Nav({ connect, account, disconnect, isConnected }: NavProps) {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        height: "5em",
        backgroundColor: "primary.dark",
        marginBottom: "5em",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DiamondIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            REIFIED
          </Typography>

          {isConnected && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem>
                  <Typography textAlign="center">Assets</Typography>
                </MenuItem>

                <MenuItem>
                  <Typography textAlign="center">Mint</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

          <DiamondIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            REIFIED
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isConnected && (
              <>
                <Button
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Assets
                </Button>
                <Button
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Mint
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isConnected ? (
              <>
                <Button
                  onClick={handleOpenUserMenu}
                  color="secondary"
                  variant="contained"
                >
                  <Typography>
                    {account!.username.substring(0, 10).toLocaleUpperCase()}
                  </Typography>
                </Button>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      disconnect();
                    }}
                  >
                    <Typography textAlign="center">Disconnect</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="secondary" variant="contained" onClick={connect}>
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;
```

We import the Material-UI components such as `AppBar`,  `Button`, `MenuItem`, etc. used to style the navigation bar. We also import the `useNavigate` hook from React Router, to handle navigation.

The `Nav` component receives several props (that will be later passed in from the `App.tsx` file)

- `connect` - A function to initiate wallet connection.
- `account` - Account data of the connected user.
- `disconnect` - A function to disconnect the wallet.
- `isConnected` - A boolean value indicating whether the wallet is connected or not.

The component's structure consists of a container `Container` with a fixed `AppBar` inside. The app bar contains a `Toolbar` that holds the various elements.

The elements within the navigation bar include a logo (represented by a `DiamondIcon`), a brand name (`Typography`), navigation links (`Button`), and an account-related section.

The account-related section varies based on the `isConnected` prop. If the wallet is connected, it displays the user's account info, including the first 10 characters of the username and a menu (**`Menu`**) with an option to disconnect. If the wallet is not connected, it shows a "Connect Wallet" button, and the menu is hidden.

The component also handles the opening and closing of menus (**`handleOpenNavMenu`**, **`handleOpenUserMenu`**, **`handleCloseNavMenu`**, **`handleCloseUserMenu`**) using the **`useState`** hook.

You would also notice that we handle responsive with Material UI’s `display` prop to toggle which components are displayed depending on the screen width.

### Home Page

To set up the required file structure, follow these steps:

1. Create an `assets` folder in the `src` directory and place insert link this image file inside it.
2. Create a new folder named "pages" inside the `src` directory.
3. Inside the `pages` folder, add a file called `Home.tsx`.

Paste the code below into the `Home.tsx` file:

```tsx
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
  } from "@mui/material";
  import React from "react";
  import reified from "../assets/reified.png";
  
  export const Home = () => {
    return (
      <Card sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1", width: "40vW", padding: 5 }}>
            <Typography component="div" variant="h2" sx={{ padding: 5 }}>
              Reified NFTs
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="div"
              sx={{ padding: 5 }}
            >
              Mint NFTs to represent your physical assets on the Cudos Blockchain.
              Connect your Wallet to start minting NFTs on Reified.
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ flex: "1", width: "100%", height: "100%", objectFit: "cover" }}
          image={reified}
          alt="Live from space album cover"
          sizes="(max-width: 600px) 50vw,
                800px"
        />
      </Card>
    );
  };
```

This is a simple homepage displaying a card layout with some content about the dApp, and an image.

### Updating `App.tsx`

Currently, if you run `npm run dev` in your terminal the dApp simply shows the message **Hello…** We are now going to make it show all the components we created together. 

First, with the imports, add the following to the already existing imports in the file:

```tsx
...
import { useSnackbar } from "notistack";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import Nav from "./components/Nav/Nav";
import { NftClient, NftQueryClient } from "./ledgers/NftClient";
import {  keplrSigningClient,  getConnectedAccount,  AccountDetails,} from "./ledgers/KeplrLedger";
import { CollectionList } from "./components/Collection/CollectionList";
import { NftList } from "./components/Nft/NftList";
import { Mint } from "./components/MintForm/Mint";
import { IssueMessage, MintMessage } from "./types/nft";
```

Along with the components, we are importing the Nft clients, functions associated with KeplrWallet as well as `Routes` and `Route` from React-Router. Next, we will initialise the state variables, because we will be using react’s `useState` hook, we need to update the import from react library to include the `useState` hook. So this becomes `import React, {useState} from "react";`

```tsx
...
function App() {
	  const [nftSingingClient, setNftSigningClient] = useState<NftClient | null>(
	    null
	  );
	  const nftQueryClient: NftQueryClient | null = new NftQueryClient();
	
	  const [isConnected, setIsConnected] = useState<boolean>(false);
	  const [account, setAccount] = useState<AccountDetails | null>(null);
	  const { enqueueSnackbar } = useSnackbar();
...
```

The `nftQueryclient` class’s methods do not need a user to be connected, so we can instantiate the variable that holds it. However, the state of the `nftSigningClient`, `isConnected`, and `account` can all change, hence we use the `useState` hook for these. 

Below this, we will create the functions used in the `App` components and some passed onto its children components. 

```tsx
...
const connectWallet = async () => {
      try {
        setNftSigningClient(new NftClient());
        setAccount(await getConnectedAccount());
        setIsConnected(true);
      } catch (error: any) {
        enqueueSnackbar(`Error Connecting! ${error.message}`, {
          variant: "error",
        });
      }
    };
...
```

The `connectWallet` function lets a user connect to the Cudos blockchain network. We set the nft signing client as an instance of `nftClient` We also set the `account`, and set the connection state `setIsConnected`, to true.

```tsx
  const disconnect = () => {
    if (nftSingingClient) {
      nftSingingClient.disconnect();
      setNftSigningClient(null);
      setAccount(null);
      setIsConnected(false);
    }
  };
```

The `disconnect` function handles disconnecting from the Cudos blockchain network if there's a current connection. It also resets the following state variables: `nftSigningClient`, `account`, and `isConnected`. 

```tsx
...
const getAllNftsById = async (denomId: string) => {
    return await nftQueryClient.getAllTokensInCollection(denomId);
  };

  const createDenom = async (denomMessage: IssueMessage) => {
    if (isConnected) {
      await nftSingingClient?.issueDenom(denomMessage);
      return denomMessage.id;
    } else throw new Error("Keplr Wallet not connected");
  };

  const mintNft = async (mintMessage: MintMessage) => {
    if (isConnected) {
      await nftSingingClient?.mintNFT(mintMessage);
      return mintMessage.denomId;
    } else throw new Error("Keplr Wallet not connected");
  };
...
```

The three functions `getAllftsById`, `createDenom`, and `mintNft` above fetch NFTs belonging to a denom, hands the creation of a new NFT denom, and handles the minting of NFTs respectively. 

Now, let us bring it all together. 

```tsx
import React, {useState} from "react";
...
import { IssueMessage, MintMessage } from "./types/nft";

function App() {
  const [nftSingingClient, setNftSigningClient] = useState<NftClient | null>(
    null
  );
 ...
    const mintNft = async (mintMessage: MintMessage) => {
      if (isConnected) {
        await nftSingingClient?.mintNFT(mintMessage);
        return mintMessage.denomId;
      } else throw new Error("Keplr Wallet not connected");
    };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Nav
            connect={connectWallet}
            disconnect={disconnect}
            account={account}
            isConnected={isConnected}
          />
          <Box sx={{ paddingTop: "5em" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/collections"
                element={
                  <CollectionList
                    getDenom={nftQueryClient.getAllDenoms}
                    account={account}
                  />
                }
              />
              <Route
                path="/assets/:denomId"
                element={<NftList getNft={getAllNftsById} account={account} />}
              />
              <Route
                path="/mint"
                element={
                  <Mint
                    createDenom={createDenom}
                    mintNft={mintNft}
                    account={account}
                  />
                }
              />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default App;
```

The App is made up of the Nav component and a material Ui Box containing React Router’s Routes component. The `connectWallet` , `disconnect`, functions along with the  `account`, and `isConnected` states are passed into the Nav component  as props. 

### Routes

The **`Routes`** component from React Router is used to define the different routes in our dApp and their corresponding components.

| Route | Component |
| --- | --- |
| “/” | Home |
| “/collections” | CollectionList |
| “/assets/:denomId” | NftList |
| “/mint” | Mint |

We are now going to update the `Nav` component by adding navigation to the menu items. To do this, open the `Nav.tsx` file. 

```tsx
...
function Nav({ connect, account, disconnect, isConnected }: NavProps) {
  const navigate = useNavigate();
  //add new lines from here
  const goToCollection = () => {
    if (account) {
      handleCloseNavMenu();
      navigate("/collections");
    }
  };

  const goToMintPage = () => {
    handleCloseNavMenu();
    if (account !== null) {
      navigate("/mint");
    }
  };

  const goToHomePage = () => {
    handleCloseNavMenu();
    navigate("/");
  };
  //end of the new lines
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
...
```

All of these use the useNavigate hook to handle navigation to the various components. We are now going to add it to the `onClick` event handler for the corresponding elements of the **`Nav`** bar elements that we created earlier.

```tsx
function Nav({ connect, account, disconnect, isConnected }: NavProps) {
 ...
  return (
    <AppBar
      ...
                <MenuItem onClick={goToCollection}>
                  <Typography textAlign="center">Assets</Typography>
                </MenuItem>

                <MenuItem
                  onClick={(event) => {
                    event.preventDefault();
                    goToMintPage();
                  }}
                >
                  <Typography textAlign="center">Mint</Typography>
                </MenuItem>
          ...
          
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isConnected && (
              <>
                <Button
                  onClick={goToCollection}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Assets
                </Button>
                <Button
                  onClick={goToMintPage}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Mint
                </Button>
              </>
            )}
          </Box>
		    ...
          <MenuItem
            onClick={() => {
            handleCloseUserMenu();
            disconnect();
            goToHomePage();
            }}
          >
            <Typography textAlign="center">Disconnect</Typography>
          </MenuItem>
        </Menu>
         ...
```

Lastly, in the `Collection` component, add a navigate hook to the `IconButton` in the `CardActions` Component, so that it becomes like this:

```tsx
...
<CardActions disableSpacing>
	<Tooltip title="View NFTs in Collection">
		<IconButton
	    aria-label="View Collection"
	    onClick={(event) => {
        event.preventDefault();
	      navigate(`/assets/${denom.id}`, { state: denom.id }); 
	    }}
	  >
	    <OpenInFullRounded color="primary" />
	  </IconButton>
	</Tooltip>
</CardActions>
...
```
Upon completing this step, your project should be similar to what can be found here[branch 7].


That's it! You've built your NFT dApp with me, congratulations on 
completing this comprehensive tutorial! I want to express my sincere gratitude for following through to the end! By reaching this point, you've learnt how to build fronttend that integrates with not just Cudos but other Cosmos SDK blockchain, awesome, isn't it? I hope you apply this knowledge and build more using what you've learnt here.