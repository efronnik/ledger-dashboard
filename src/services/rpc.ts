import axios from "axios";

const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
if (!INFURA_PROJECT_ID) throw new Error("VITE_INFURA_PROJECT_ID is not defined in .env");

const INFURA_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

let cachedTxs: Transaction[] = [];
let lastFetchTime = 0;

export interface Transaction {
  txID: string;
  type: "Transfer" | "Contract";
  timestamp: number;
  status: "Validated" | "Pending" | "Invalid";
  block: number; // оставляем number
  chaincode: string;
  creator: string;
  endorsements: string[];
}

export async function fetchTransactions(address: string): Promise<Transaction[]> {
  if (!address) throw new Error("Address is required");

  const now = Date.now();
  if (now - lastFetchTime < 15000 && cachedTxs.length > 0) {
    return cachedTxs;
  }

  try {
    const latestBlockResp = await axios.post(INFURA_URL, {
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });
    const latestBlock = parseInt(latestBlockResp.data.result, 16);

    const txs: Transaction[] = [];
    const blocksToCheck = 3;

    for (let i = latestBlock; i > latestBlock - blocksToCheck; i--) {
      const blockHex = "0x" + i.toString(16);
      const blockResp = await axios.post(INFURA_URL, {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockHex, true],
        id: 1,
      });

      const block = blockResp.data.result;
      if (!block || !block.transactions) continue;

      for (const tx of block.transactions) {
        if (
          tx.from?.toLowerCase() === address.toLowerCase() ||
          tx.to?.toLowerCase() === address.toLowerCase()
        ) {
          txs.push({
            txID: tx.hash,
            type: tx.to ? "Transfer" : "Contract",
            timestamp: parseInt(block.timestamp, 16) * 1000,
            status: "Validated",
            block: parseInt(block.number, 16),
            chaincode: tx.to || "Contract",
            creator: tx.from,
            endorsements: [],
          });
        }
      }
    }

    cachedTxs = txs;
    lastFetchTime = now;
    return txs;
  } catch (err) {
    console.error("Error fetching transactions", err);
    throw new Error("Network error, please try again");
  }
}
