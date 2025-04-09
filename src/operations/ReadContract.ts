import { z } from "zod";

import { createClient, getChainById } from "../viem";

export const ReadContractSchema = z.object({
  contractAddress: z.string().startsWith("0x"),
  chainId: z.number(),
  abi: z.string(),
  functionName: z.string(),
  args: z.array(z.string()),
});
export type ReadContractOptions = z.infer<typeof ReadContractSchema>;

export const readContract = async (options: ReadContractOptions) => {
  const { contractAddress, chainId, abi, functionName, args } = options;

  const chain = getChainById(chainId);
  const client = createClient(chain);

  const result = await client.readContract({
    address: contractAddress as `0x${string}`,
    abi: JSON.parse(abi),
    functionName,
    args,
  });

  return result;
};
