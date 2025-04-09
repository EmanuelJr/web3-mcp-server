import { z } from "zod";
import { formatUnits } from "viem";

import { createClient, getChainById } from "../viem";

export const FetchBalanceSchema = z.object({
  walletAddress: z.string().startsWith("0x"),
  chainId: z.number(),
});
export type FetchBalanceOptions = z.infer<typeof FetchBalanceSchema>;

export const fetchBalance = async (options: FetchBalanceOptions) => {
  const { walletAddress, chainId } = options;

  const chain = getChainById(chainId);
  const client = createClient(chain);

  const balance = await client.getBalance({
    address: walletAddress as `0x${string}`,
  });

  return {
    balance: balance.toString(),
    formattedBalance: formatUnits(balance, chain.nativeCurrency.decimals),
  };
};
