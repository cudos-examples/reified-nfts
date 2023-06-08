# Reified NFTs

## Overview

---

Reified is a PoC for a product where users can easily trigger the creation of NFTs that represent real world assets on Cudos Testnet.

This is an example app that shows how to build frontend that interacts with the Cudos blockchain. The concepts can be applied when building apps that interact with other parts (modules) of the Cudos blockchain, or other Cosmos-SDK blockchains.

Built with React, Typescript, Cudosjs.

## Usage

---

### UI Features

To interact with the App, you will connect your [Keplr wallet](https://docs.keplr.app/) to the App. [Check out this guide on how to install and setup your Keplr wallet to work with Cudos.](https://docs.cudos.org/docs/learn/concepts/wallets/keplr-create/)

#### Assets

You can view the NFT denoms associated with your connected accout on the **ASSETS** tab. Each NFT denom/Collection can have NFTs that belong to it. Clicking on the cards with the denom info opens up a page that displays the NFTs in that denom. You can mint a new NFT to the denom by clicking on the + symbol at the top right corner.

A button to **Create Collection** is displayed if there is no denom associated with the connected account.

#### Mint

The **MINT** tab allows you to Mint NFTs in 2 steps (with 2 forms): creating a denom, and then adding NFTs to the denom.

**Create Asset Collection**

To create a denom you will have to fill the form with a **unique DenomId**, a **unique denom name**, and a **unique denom symbol**. You may also add a description to the denom.

**Mint an asset as NFT**

The next step after successfully creating a denom is to add an NFT to the collection/denom. To mint an NFT of an asset you will provide its **name**, **a valid uri**, and **a description**. There is a **checkbox** labelled as **Mint NFT to a Separate Address** which you check when you intend for the owner of the NFT to be a different account, if checked you will also have to provide the **Recipient account's address**.

---

### Starting and Building the App

#### Prerequisites

1. Node.js
2. Keplr wallet as a browser extension.

#### Build steps

1. Clone this repository.
2. Open the project in VS Code or your preferred editor.
3. Install dependencies by running this command in the project directory.

   ` npm install`

4. Run the app by running this command in the project directory.

   `npm run dev`

   The above step usually makes the application accessible on `localhost:5173` in your browser

#### Environmental Variables

The environmental variables used in this app are contained in the `.env` file in the project root.

The environmental variables and their usage are explained in the table below. Please note that changing any of the variables in the .env file while the app is running, the app must be stopped by running `ctrl + C` and then built again with `npm run dev` before the changes take effect.

Environment variables maintained in the .env file are made available to the application code via `import.meta.env<variable-name>`. For example, the Cudos testnet RPC endpoint is accessed in the code by referencing `import.meta.env.VITE_APP_RPC`.

| Environmental Variable  |                     Description                      |                Example Setting                 |                                Where to find the current settings                                 |
| ----------------------- | :--------------------------------------------------: | :--------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
| VITE_APP_RPC            |        The Cudos public testnet RPC endpoint         |       https://rpc.testnet.cudos.org:443        | [Cudos Doc](https://docs.cudos.org/docs/build/overview/connect-network#01-connect-to-testnet-rpc) |
| VITE_APP_API            |        The cudos public testnet HTTP endpoint        | https://sentry1.gcp-uscentral1.cudos.org:36657 |                                                                                                   |
| VITE_APP_CHAIN_ID       |                     The chain id                     |             cudos-testnet-public-3             |                                                                                                   |
| VITE_APP_ADDRESS_PREFIX | The network prefix, used in configuring keplr wallet |                     cudos                      |                                                                                                   |

## Dependencies

---

The libraries used in the project include:

| Library                | Description                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Material UI components | provides a simple, customizable, and accessible library of React components.                                                          |
| Cudosjs                | is a library with which we interact with the Cudos blockchain.                                                                        |
| Zod                    | is a data type declaration and validation library. We use it to declare and validate the data type of the forms used in NFT minting. |
| React Hook form        | used with Zod to create forms with Validation.                                                                                        |
| notistack              | for snack bar notification.                                                                                                           |
