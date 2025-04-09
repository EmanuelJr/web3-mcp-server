import {
  type Chain,
  extractChain,
  http,
  createPublicClient,
  createWalletClient,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";

const chainsList = Object.values(chains);

export const getChainById = (id: number) => {
  return extractChain({
    chains: chainsList,
    id: id as (typeof chainsList)[number]["id"],
  });
};

export const createClient = (chain: Chain, privateKey?: `0x${string}`) => {
  if (privateKey) {
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain,
      transport: http(),
    }).extend(publicActions);
  }

  return createPublicClient({
    chain: chain,
    transport: http(),
    batch: {
      multicall: true,
    },
  });
};
