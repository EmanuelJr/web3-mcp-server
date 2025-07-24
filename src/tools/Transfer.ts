import { z } from "zod";
import { type WalletClient, parseUnits } from "viem";

import { createClient, getChainById } from "../viem";

export const TransferSchema = z.object({
  chainId: z.number(),
  recipientAddress: z.string().startsWith("0x"),
  amount: z.string(),
});
export type TransferOptions = z.infer<typeof TransferSchema>;

export const transfer = async (options: TransferOptions) => {
  const { chainId, recipientAddress, amount } = options;

  const chain = getChainById(chainId);
  const walletClient = createClient(
    chain,
    process.env.PRIVATE_KEY as `0x${string}`
  ) as WalletClient;

  const tx = await walletClient.sendTransaction({
    to: recipientAddress as `0x${string}`,
    value: parseUnits(amount, chain.nativeCurrency.decimals),
    account: walletClient.account ?? null,
    chain,
  });

  return {
    txHash: tx,
  };
};
