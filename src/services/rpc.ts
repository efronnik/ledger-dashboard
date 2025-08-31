import axios from 'axios';

const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
if (!INFURA_PROJECT_ID)
  throw new Error('VITE_INFURA_PROJECT_ID is not defined in .env');

const INFURA_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

export interface Transaction {
  txID: string;
  type: 'Transfer' | 'Contract';
  timestamp: number;
  status: 'Validated' | 'Pending' | 'Invalid';
  block: number;
  chaincode: string;
  creator: string;
  endorsements: string[];
}

// Кэш транзакций по адресу
let cachedTxsByAddress: Record<string, Transaction[]> = {};
let lastFetchByAddress: Record<string, number> = {};

// Загружаем из localStorage при старте
const saved = localStorage.getItem('cachedTxsByAddress');
if (saved) {
  try {
    cachedTxsByAddress = JSON.parse(saved);
  } catch (err) {
    console.warn('Failed to parse cached transactions from localStorage', err);
    cachedTxsByAddress = {};
  }
}

export async function fetchTransactions(
  address: string,
): Promise<Transaction[]> {
  if (!address) throw new Error('Address is required');

  const now = Date.now();
  const cachedTxs = cachedTxsByAddress[address] ?? [];
  const lastFetch = lastFetchByAddress[address] ?? 0;

  if (now - lastFetch < 15000 && cachedTxs.length > 0) {
    return cachedTxs;
  }

  try {
    // Получаем последний блок
    const latestBlockResp = await axios.post(INFURA_URL, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1,
    });
    const latestBlock = parseInt(latestBlockResp.data.result, 16);

    const blocksToCheck = 3;
    const blockPromises = [];
    for (let i = latestBlock; i > latestBlock - blocksToCheck; i--) {
      const blockHex = '0x' + i.toString(16);
      blockPromises.push(
        axios.post(INFURA_URL, {
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [blockHex, true],
          id: 1,
        }),
      );
    }

    const blockResponses = await Promise.all(blockPromises);
    const txs: Transaction[] = [];

    for (const resp of blockResponses) {
      const block = resp.data.result;
      if (!block || !block.transactions) continue;

      for (const tx of block.transactions) {
        if (
          tx.from?.toLowerCase() === address.toLowerCase() ||
          tx.to?.toLowerCase() === address.toLowerCase()
        ) {
          txs.push({
            txID: tx.hash,
            type: tx.to ? 'Transfer' : 'Contract',
            timestamp: parseInt(block.timestamp, 16) * 1000,
            status: 'Validated',
            block: parseInt(block.number, 16),
            chaincode: tx.to || 'Contract',
            creator: tx.from,
            endorsements: [],
          });
        }
      }
    }

    // Объединяем с предыдущими, удаляем дубликаты
    const allTxsMap: Record<string, Transaction> = {};
    [...txs, ...cachedTxs].forEach(tx => {
      allTxsMap[tx.txID] = tx;
    });

    const allTxs = Object.values(allTxsMap).sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    cachedTxsByAddress[address] = allTxs;
    lastFetchByAddress[address] = now;

    // Сохраняем в localStorage
    localStorage.setItem(
      'cachedTxsByAddress',
      JSON.stringify(cachedTxsByAddress),
    );

    return allTxs;
  } catch (err) {
    console.error('Error fetching transactions', err);
    // Возвращаем кэш даже при ошибке сети
    return cachedTxs;
  }
}
