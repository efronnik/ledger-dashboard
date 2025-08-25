// services/rpc.ts
import axios from 'axios';

// Моковые транзакции для теста
const mockTransactions = [
  {
    txID: '0x1234567890abcdef',
    type: 'Transfer',
    timestamp: Date.now(),
    status: 'Validated',
    block: 12345,
    chaincode: 'ERC20',
    creator: '0xabc...',
    endorsements: ['0x111...', '0x222...']
  },
  {
    txID: '0xabcdef1234567890',
    type: 'Mint',
    timestamp: Date.now() - 100000,
    status: 'Pending',
    block: 12346,
    chaincode: 'ERC20',
    creator: '0xdef...',
    endorsements: ['0x333...']
  }
];

// Функция для получения транзакций
export async function fetchTransactions() {
  // Здесь можно сделать реальный вызов через Infura RPC
  // Например: axios.get('https://sepolia.infura.io/...') и т.д.
  // Пока возвращаем мок
  return new Promise(resolve => {
    setTimeout(() => resolve(mockTransactions), 500);
  });
}
