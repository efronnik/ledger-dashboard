import axios from 'axios';

export interface TokenPrice {
  symbol: string;
  usd: number;
  usd_24h_change: number;
}

// Преобразуем символ токена в id CoinGecko
const symbolToId: Record<string, string> = {
  ETH: 'ethereum',
  USDC: 'usd-coin',
  DAI: 'dai',
};

export async function getPrice(symbol: string): Promise<TokenPrice | null> {
  const id = symbolToId[symbol];
  if (!id) return null;

  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: id,
          vs_currencies: 'usd',
          include_24hr_change: 'true',
        },
      },
    );

    return {
      symbol,
      usd: res.data[id].usd ?? 0,
      usd_24h_change: res.data[id].usd_24h_change ?? 0,
    };
  } catch (err) {
    console.error('Failed to fetch token price:', err);
    return { symbol, usd: 0, usd_24h_change: 0 };
  }
}

// Получение нескольких токенов сразу
export async function getPrices(symbols: string[]): Promise<TokenPrice[]> {
  const promises = symbols.map(s => getPrice(s));
  const results = await Promise.all(promises);
  return results.filter((r): r is TokenPrice => r !== null);
}
