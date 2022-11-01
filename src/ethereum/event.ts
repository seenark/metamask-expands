import type { ethers, providers } from "ethers";

export interface IProviderChainChange
  extends ethers.providers.ExternalProvider {
  on: (method: "chainChanged", callback: (chainId: string) => void) => void;
  removeListener: (
    method: "chainChanged",
    callback: (chainId: string) => void
  ) => void;
}

export interface IProviderAccountsChanged
  extends ethers.providers.ExternalProvider {
  on: (
    method: "accountsChanged",
    callback: (accounts: string[]) => void
  ) => void;
  removeListener: (
    method: "accountsChanged",
    callback: (accounts: string[]) => void
  ) => void;
}

export type TEthereumEvent = {
  chainChanged: TChainChangedHandleEvent;
  accountsChanged: TAccountsChangedHandleEvent;
};
type TChainChangedHandleEvent = (chainId: number) => void;
type TAccountsChangedHandleEvent = (accounts: string[]) => void;

type TEthereumEventName = "chainChanged" | "accountsChanged";
export type TEthereumEventHandler<T extends TEthereumEventName> =
  T extends "chainChanged"
    ? TChainChangedHandleEvent
    : T extends "accountsChanged"
    ? TAccountsChangedHandleEvent
    : never;

export class EthereumEvent<T extends TEthereumEventName> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum: any;
  constructor(
    private externalProvider: providers.ExternalProvider,
    // private web3Provider: providers.Web3Provider,
    private event: T,
    public handleEvent: TEthereumEventHandler<T>
  ) {
    this.ethereum = externalProvider;
  }
  listen() {
    console.log("listen on event:", this.event);
    // this.externalProvider.on(this.event, this.handleEvent);
    this.ethereum.on(this.event, this.handleEvent);
  }

  removeListener() {
    // this.externalProvider.on(this.event, this.handleEvent);
    this.ethereum.removeListener(this.event, this.handleEvent);
    console.log("remove event:", this.event);
  }
}
