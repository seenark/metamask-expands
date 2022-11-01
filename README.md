# Metamask-expands
is a library wrap up metamask provider which is injected (`window.ethereum` object) into typescript and easier to use


## Provider
```ts
import { getProvider } from "@aumstack/metamask-extends";

const providers: {
web3Provider: Web3Provider;
externalProvider: ExternalProvider;
} | undefined = await getProvider();
```

---

### Ethereum Request

this is a class that wrap `window.ethereum` object

```ts
import {
  EthereumRequest,
  getProvider,
} from "@aumstack/metamask-extends";

const providers = await getProvider();

const er = new EthereumRequest(providers.web3Provider, providers.externalProvider);
```

method and object inside EthereumRequest

```ts
export declare class EthereumRequest {
    provider: providers.Web3Provider;
    externalProvider: providers.ExternalProvider;
    ethereum: MetamaskProvider;
    constructor(provider: providers.Web3Provider, externalProvider: providers.ExternalProvider);
    switchChain(chainIdHex: string, chainDataToBeAddIfSpecifiedChainDoesNotAddedYet?: AddEthereumChainParameter): Promise<void>;
    addChain(params: AddEthereumChainParameter): Promise<void>;
    isConnected(): boolean;
    connectMetamask(): Promise<string[] | undefined>;
    watchAssets(address: string, symbol: string, decimal: number, tokenLogoUrl?: string): Promise<boolean>;
    isMetamaskUnlocked(): Promise<boolean>;
    requestAccount(): Promise<string[]>;
    onChainChanged(callback: TEthereumEventHandler<"chainChanged">): EthereumEvent<"chainChanged">;
    onAccountChanged(callback: TEthereumEventHandler<"accountsChanged">): EthereumEvent<"accountsChanged">;
}
```

---
## Example

### connect to metamask

```ts

const er = new EthereumRequest(providers.web3Provider, providers.externalProvider);

async function onClickConnectBtn() {
	const address = await er.connectMetamask(); 
}

```


### on account changed event

```ts
import { EthereumEvent, EthereumRequest } from "@aumstack/metamask-extends";

function handleAccountChangedEvent(accounts: string[]) {
  console.log("accounts", accounts);
}

const er = new EthereumRequest(p.web3Provider, p.externalProvider);

useEffect(() => {
	const accountChangeEvnet : EthereumEvent<"accountsChanged"> = er.onAccountChanged(handleAccountChangedEvent)
	accountChangeEvnet.listen()
	return  () => {
		accountChangeEvnet.removeListener()
	}
}, [er])

```

### there is a chain changed event as well 
usage of this event is same as account changed event
```ts
	async function cb() {
		window.location.reload();
	}
    const chainChangedEvent = er.onChainChanged(cb);
```

the `EthereumEvent` methods list is below
```ts
export declare class EthereumEvent<T extends TEthereumEventName> {
    private externalProvider;
    private event;
    handleEvent: TEthereumEventHandler<T>;
    ethereum: any;
    constructor(externalProvider: providers.ExternalProvider, event: T, handleEvent: TEthereumEventHandler<T>);
    listen(): void;
    removeListener(): void;
}
```

