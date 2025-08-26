import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchTransactions, Transaction } from "../services/rpc";

export const useTransactionsStore = defineStore("transactions", () => {
  const transactions = ref<Transaction[]>([]);

  const fetchTransactionsStore = async (address: string) => {
    try {
      const data: Transaction[] = await fetchTransactions(address);
      transactions.value = data;
    } catch (err) {
      console.error("Error fetching transactions", err);
      transactions.value = []; // на случай ошибки, очищаем массив
    }
  };

  return { transactions, fetchTransactions: fetchTransactionsStore };
});
