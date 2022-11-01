import detectEthereumProvider from "@metamask/detect-provider";
import { providers } from "ethers";

export async function getProvider() {
  const provider =
    (await detectEthereumProvider()) as providers.ExternalProvider;
  if (provider) {
    const web3Provider = new providers.Web3Provider(provider);
    return {
      web3Provider,
      externalProvider: provider,
    };
  } else {
    console.warn("Not found provider");
  }
}

export function getSigner(provider: providers.Web3Provider) {
  const signer = provider.getSigner();
  return signer;
}
