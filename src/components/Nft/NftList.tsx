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

/**
 * NftList component displays a list of user's NFT. Uses the Nft component as its child component.
 * @param {Object} props - Props for NftList component.
 * @param {Function} props.getNft - Function that returns a promise containing query response for NFT collections.
 * @param {Object|null} props.account - Object containining the details of the connected account, or null if no account is connected.
 */

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
