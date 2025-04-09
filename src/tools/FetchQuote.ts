import { z } from "zod";

import { getCryptoDataLite } from "../services/cmc";

export const FetchQuoteSchema = z.object({
  slug: z.string(),
});
export type FetchQuoteOptions = z.infer<typeof FetchQuoteSchema>;

export const fetchQuote = async (options: FetchQuoteOptions) => {
  const { slug } = options;

  const data = await getCryptoDataLite(slug);

  return data.data.statistics.price;
};
