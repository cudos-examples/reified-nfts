import React, { useEffect, useState } from "react";
import {
  StepLabel,
  Button,
  Box,
  Stepper,
  Step,
  StepContent,
} from "@mui/material";
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
                <Button onClick={handleReset} variant="contained">
                  Create A New Collection
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  variant="contained"
                  onClick={() => {
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
