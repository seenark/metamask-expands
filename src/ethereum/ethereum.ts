import type { providers } from "ethers";
import { EthereumEvent, TEthereumEvent, TEthereumEventHandler } from "./event";
import { AddEthereumChainParameter, WatchAssetParams } from "./metamask.types";

// type TWalletMethod =
// 	| "eth_requestAccounts"
// 	| "wallet_addEthereumChain"
// 	| "wallet_switchEthereumChain"
// 	| "wallet_watchAsset"
// 	| "wallet_scanQRCode";

enum EWalletMethod {
  addEthereumChain = "wallet_addEthereumChain",
  switchEthereumChain = "wallet_switchEthereumChain",
}

type MetamaskProvider = providers.ExternalProvider & {
  isConnected: () => boolean;
  _metamask: {
    isUnlocked: () => boolean;
  };
};

export class EthereumRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // ethereum: providers.ExternalProvider;
  ethereum: MetamaskProvider;
  constructor(
    public provider: providers.Web3Provider,
    public externalProvider: providers.ExternalProvider
  ) {
    this.ethereum = externalProvider as MetamaskProvider;
  }

  async switchChain(
    chainIdHex: string,
    chainDataToBeAddIfSpecifiedChainDoesNotAddedYet?: AddEthereumChainParameter
  ) {
    const method = "wallet_switchEthereumChain";
    const params = [{ chainId: chainIdHex }];
    try {
      await this.provider.send(method, params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("switch error", error);
      if (error.code === 4902) {
        if (!chainDataToBeAddIfSpecifiedChainDoesNotAddedYet) throw error;
        try {
          await this.addChain(chainDataToBeAddIfSpecifiedChainDoesNotAddedYet);
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }

  async addChain(params: AddEthereumChainParameter) {
    try {
      await this.provider.send(EWalletMethod.addEthereumChain, [params]);
    } catch (error) {
      console.log("add chain error", error);
    }
  }

  isConnected(): boolean {
    return this.ethereum.isConnected() as boolean;
  }
  async connectMetamask() {
    try {
      const addresses: string[] = await this.provider.send(
        "eth_requestAccounts",
        []
      );
      return addresses;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        throw new Error("User Rejected to connect");
        console.log("Please connect to MetaMask.");
      } else {
        console.error(error);
      }
    }
  }

  async watchAssets(
    address: string,
    symbol: string,
    decimal: number,
    tokenLogoUrl = ""
  ) {
    const method = "wallet_watchAsset";
    const params: WatchAssetParams = {
      type: "ERC20",
      options: {
        address: address,
        symbol: symbol,
        decimals: decimal,
        image: tokenLogoUrl,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wasAdded: boolean = await this.provider.send(method, params as any);
    return wasAdded;
  }

  async isMetamaskUnlocked() {
    return await this.ethereum._metamask.isUnlocked();
  }

  async requestAccount() {
    const addresses: string[] = await this.provider.send(
      "eth_requestAccounts",
      []
    );
    return addresses;
  }

  onChainChanged(callback: TEthereumEventHandler<"chainChanged">) {
    const event: EthereumEvent<"chainChanged"> = new EthereumEvent(
      this.externalProvider,
      "chainChanged",
      callback
    );
    return event;
  }

  onAccountChanged(callback: TEthereumEventHandler<"accountsChanged">) {
    return <EthereumEvent<"accountsChanged">>(
      new EthereumEvent(this.externalProvider, "accountsChanged", callback)
    );
  }
}
