import { z } from "zod";
import {
  type WalletClient,
  type PublicClient,
  erc20Abi,
  parseUnits,
} from "viem";

import { createClient, getChainById } from "../viem";

export const TransferTokenSchema = z.object({
  tokenAddress: z.string().startsWith("0x"),
  chainId: z.number(),
  recipientAddress: z.string().startsWith("0x"),
  amount: z.string(),
});
export type TransferTokenOptions = z.infer<typeof TransferTokenSchema>;

export const transferToken = async (options: TransferTokenOptions) => {
  const { tokenAddress, chainId, recipientAddress, amount } = options;

  const chain = getChainById(chainId);
  const publicClient = createClient(chain) as PublicClient;
  const walletClient = createClient(
    chain,
    process.env.PRIVATE_KEY as `0x${string}`
  ) as WalletClient;

  const contract = {
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
  };

  const decimals = await publicClient.readContract({
    ...contract,
    functionName: "decimals",
  });

  const { request } = await publicClient.simulateContract({
    ...contract,
    functionName: "transfer",
    args: [recipientAddress as `0x${string}`, parseUnits(amount, decimals)],
    account: walletClient.account,
  });
  const tx = await walletClient.writeContract(request);

  return {
    txHash: tx,
  };
};
