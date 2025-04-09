import { z } from "zod";
import { erc20Abi, formatUnits, getContract } from "viem";

import { createClient, getChainById } from "../viem";

export const FetchTokenBalanceSchema = z.object({
  tokenAddress: z.string().startsWith("0x"),
  chainId: z.number(),
  walletAddress: z.string().startsWith("0x"),
});
export type FetchTokenBalanceOptions = z.infer<typeof FetchTokenBalanceSchema>;

export const fetchTokenBalance = async (options: FetchTokenBalanceOptions) => {
  const { tokenAddress, chainId, walletAddress } = options;

  const chain = getChainById(chainId);
  const client = createClient(chain);

  const contract = getContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    client,
  });

  const [balance, decimals] = await Promise.all([
    contract.read.balanceOf([walletAddress as `0x${string}`]),
    contract.read.decimals(),
  ]);

  return {
    balance: balance.toString(),
    formattedBalance: formatUnits(balance, decimals),
  };
};
