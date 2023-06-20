import { Window as KeplrWindow } from "@keplr-wallet/types";

export {};

declare global {
  // type Override<T1, T2> = Omit<T1, keyof T2> & T2
  interface Window extends KeplrWindow {
  }
 
}
