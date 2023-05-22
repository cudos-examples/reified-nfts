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

// NFTQuery client to validate that the denom id, and denom symbols are not in use.
const nftQueryClient = new NftQueryClient();

// The component uses Zod package to validate form input fields.
// The Denom form validation schema is defined with ZodObject
const denomFormSchema = object({
  denomId: string()
    .min(4, "DenomId should be at least 4 alphanumeric character")
    .max(8, "DenomId should not be more than 8 characters")
    /* Custom validation with Zod's refine method. Checks if the query with the denomId will return any denom. 
    A null response is expected for denom Id that is currently available. */
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
  name: string()
    .min(4, "Name is required.")
    .max(20, "Name should not be more than 20 characters.")
    /* Validates the denom name by checking if a query with the name will return any denom. 
    A null response is expected for denom name that is currently available. */
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
    /*  Checks if the query with the denom symbol will return any denom. 
    A null response is expected for denom symbol that is currently available. */
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

// Infer the Denom form schema to get the TS Type using Zod's TypeOf
type IDenom = TypeOf<typeof denomFormSchema>;

export type DenomFormProps = {
  createDenom: (denom: IssueMessage) => Promise<string | undefined>;
  account: AccountDetails | null;
  setDenomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsCreatingCollectionSucceed: React.Dispatch<React.SetStateAction<boolean>>;
  setNextStep: () => void;
};

/**
 * This component is used for the first step in Minting NFT collections.
 * It is used to create the Denomination of the Collection using a form.
 * It's parent component is the Mint component.
 * @param {Object} props - Props for DenomForm component.
 * @param {Function} props.createDenom Function that takes object `IssueMessage` and returns a promise containing the denomId string.
 * @param {Object|null} props.account - Object containining the details of the connected account, or null if no account is connected.
 * @param {Function} props.setDenomId Passed in from the Mint component, this function sets the DenomId property in the Mint component after a Denom has been successfully created.
 * @param {Function} props.setIsCreatingCollectionSucceed Passed in from the Mint component, this function is used to inform the parent component (Mint) whether the denom was created successfully (true) or not (false).
 * @param {Function} props.setNextStep Passed in from the Mint component, this function sets the next step in the NFT minting process
 */

export const DenomForm = ({
  createDenom,
  account,
  setDenomId: setDenomId,
  setIsCreatingCollectionSucceed,
  setNextStep,
}: DenomFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Set the default values by instantiating an object of type IDenom, passing into the object properties some default values
  const defaultValues: IDenom = {
    denomId: "",
    name: "",
    symbol: "",
    description: "",
  };

  /**
   * The object returned from useForm Hook. 
   * React hook form's useForm hook to manage the denomForm. We pass an object with properties "resolver, and defaultValues" as its parameters.
   * The resolver enables us to use an external validation library for the denomForm validation, in this case we are using zodResolver.
   * The zodResolver hook takes the denomFormSchema we defined earlier.
   */
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
        setNextStep(); //sets the next step in the minting process to display the NFT form the collection denom has been successfully created.
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
