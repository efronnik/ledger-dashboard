import axios from "axios";

const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
const CHAIN_ID = import.meta.env.VITE_DEFAULT_CHAIN_ID || "11155111"; // Sepolia

export interface TokenBalance {
  token: string;
  amount: number;
  usdValue: number;
  change24h: number;
}

// Получаем цены токенов через CoinGecko
async function fetchTokenPrices(tokens: string[]): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  try {
    const ids = tokens.map(t => t.toLowerCase()).join(",");
    const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids,
        vs_currencies: "usd",
        include_24hr_change: "true"
      }
    });
    return res.data as Record<string, { usd: number; usd_24h_change: number }>;
  } catch (err) {
    console.error("Failed to fetch token prices:", err);
    const fallback: Record<string, { usd: number; usd_24h_change: number }> = {};
    tokens.forEach(t => fallback[t.toLowerCase()] = { usd: 0, usd_24h_change: 0 });
    return fallback;
  }
}

// Основная функция получения балансов
export async function fetchTokens(address: string): Promise<TokenBalance[]> {
  if (!INFURA_PROJECT_ID)
    throw new Error("INFURA_PROJECT_ID is not defined in .env");

  const url = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;
  let ethBalance = 0;

  try {
    const ethResponse = await axios.post(url, {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, "latest"],
      id: 1
    });
    ethBalance = parseInt(ethResponse.data.result, 16) / 1e18;
  } catch (err) {
    console.error("Failed to fetch ETH balance:", err);
    ethBalance = 0;
  }

  const tokensList = ["ETH", "USDT", "BTC"];
  const prices = await fetchTokenPrices(tokensList);

  const tokens: TokenBalance[] = [
    {
      token: "ETH",
      amount: ethBalance,
      usdValue: ethBalance * (prices["eth"]?.usd || 0),
      change24h: prices["eth"]?.usd_24h_change || 0
    },
    {
      token: "USDT",
      amount: 1000,
      usdValue: 1000 * (prices["usdt"]?.usd || 1),
      change24h: prices["usdt"]?.usd_24h_change || 0
    },
    {
      token: "BTC",
      amount: 0.05,
      usdValue: 0.05 * (prices["btc"]?.usd || 0),
      change24h: prices["btc"]?.usd_24h_change || 0
    },
  ];

  return tokens;
}
