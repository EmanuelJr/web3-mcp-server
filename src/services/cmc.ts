interface GetCryptoDataLiteResponse {
  data: {
    name: string;
    symbol: string;
    slug: string;
    status: string;
    volume: number;
    statistics: {
      price: number;
      marketCap: number;
      circulatingSupply: number;
      totalSupply: number;
    };
  };
}

export const getCryptoDataLite = async (slug: string) => {
  const response = await fetch(
    `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/lite?slug=${slug}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crypto data");
  }

  const data = await response.json();
  return data as GetCryptoDataLiteResponse;
};
