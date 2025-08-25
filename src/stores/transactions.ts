import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchTransactions } from '../services/rpc';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<any[]>([]);

  const fetchTransactionsStore = async () => {
    try {
      const data: any = await fetchTransactions();
      transactions.value = data;
    } catch (err) {
      console.error('Error fetching transactions', err);
    }
  };

  return { transactions, fetchTransactions: fetchTransactionsStore };
});
