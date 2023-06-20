import React, {useState} from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline, Typography } from "@mui/material";
import "@fontsource/poppins";
import theme from "./theme";

import { useSnackbar } from "notistack";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Nav from "./components/Nav/Nav";
import { NftClient, NftQueryClient } from "./ledgers/NftClient";
import {
  keplrSigningClient,
  getConnectedAccount,
  AccountDetails,
} from "./ledgers/KeplrLedger";
import { CollectionList } from "./components/Collection/CollectionList";
import { NftList } from "./components/Nft/NftList";
import { Mint } from "./components/MintForm/Mint";
import { IssueMessage, MintMessage } from "./types/nft";

function App() {
  const [nftSingingClient, setNftSigningClient] = useState<NftClient | null>(
    null
  );
  const nftQueryClient: NftQueryClient | null = new NftQueryClient();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Handles connecting to the Cudos blockchain network.
   * Connection is maintained via the keplrSigningClient function, which returns a cudosSigningStargateClient that is used to initialize the NftClient.
   * We also set the account, and set the connection state, setIsConnected, to true.
   */
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

    /**
   * This handles disconnecting from the Cudos blockchain network if there's a current connection.
   * It also resets the following state variables: nftSigningClient, account and isConnected.
   */
  const disconnect = () => {
    if (nftSingingClient) {
      nftSingingClient.disconnect();
      setNftSigningClient(null);
      setAccount(null);
      setIsConnected(false);
    }
  };

    // Fetches NFTs belonging to a denom
    const getAllNftsById = async (denomId: string) => {
      return await nftQueryClient.getAllTokensInCollection(denomId);
    };
  
   // This handles the creation of a new NFT denom
    const createDenom = async (denomMessage: IssueMessage) => {
      if (isConnected) {
        await nftSingingClient?.issueDenom(denomMessage);
        return denomMessage.id;
      } else throw new Error("Keplr Wallet not connected");
    };
  
    //This handles minting of NFTs
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