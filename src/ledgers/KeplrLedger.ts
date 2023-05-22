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
