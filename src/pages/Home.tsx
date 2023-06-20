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
  