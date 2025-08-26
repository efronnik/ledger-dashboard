import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchTransactions, Transaction } from "../services/rpc";

const STORAGE_KEY = "cachedTransactions";

export const useTransactionsStore = defineStore("transactions", () => {
  const transactions = ref<Transaction[]>([]);

  // Загружаем транзакции из localStorage при инициализации
  const loadFromStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        transactions.value = JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse transactions from localStorage", err);
        transactions.value = [];
      }
    }
  };

  const fetchTransactionsStore = async (address: string) => {
    try {
      const data: Transaction[] = await fetchTransactions(address);
      transactions.value = data;

      // Сохраняем в localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching transactions", err);
      // Если есть сохранённые данные, оставляем их
      if (!transactions.value.length) transactions.value = [];
    }
  };

  // Инициализация
  loadFromStorage();

  return { transactions, fetchTransactions: fetchTransactionsStore };
});
