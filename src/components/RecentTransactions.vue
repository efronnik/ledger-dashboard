<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTransactionsStore } from '../stores/transactions';
import { useWalletStore } from '../stores/wallet';
import Modal from './Modal.vue';
import { formatDate } from '../utils/formatDate';
import type { Transaction } from '../services/rpc';

// Stores
const transactionsStore = useTransactionsStore();
const wallet = useWalletStore();

// Поиск и фильтры
const search = ref('');
const filterStatus = ref('');

// Пагинация
const currentPage = ref(1);
const itemsPerPage = 10;

// Модальное окно
const showModal = ref(false);
const selectedTx = ref<Transaction | null>(null);

// Фильтрация транзакций по статусу и TxID
const filteredTransactions = computed<Transaction[]>(() => {
  return transactionsStore.transactions
    .filter(tx => !filterStatus.value || tx.status === filterStatus.value)
    .filter(tx => !search.value || tx.txID.toLowerCase().includes(search.value.toLowerCase()));
});

// Транзакции для текущей страницы
const paginatedTransactions = computed<Transaction[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

// Открытие модального окна
const openModal = (tx: Transaction) => {
  selectedTx.value = tx;
  showModal.value = true;
};

// Загрузка транзакций при монтировании
const loadTransactions = async () => {
  if (!wallet.account) return;
  await transactionsStore.fetchTransactions(wallet.account);
  currentPage.value = 1; // сброс пагинации при обновлении
};

onMounted(() => {
  loadTransactions();
});
</script>

<template>
  <div class="p-4 mt-24">
    <h2 class="text-xl font-bold mb-4">Recent Transactions</h2>

    <!-- Фильтры -->
    <div class="flex gap-2 mb-4">
      <input v-model="search" placeholder="Search by TxID" class="border px-2 py-1 rounded"/>
      <select v-model="filterStatus" class="border px-2 py-1 rounded">
        <option value="">All</option>
        <option value="Validated">Validated</option>
        <option value="Pending">Pending</option>
        <option value="Invalid">Invalid</option>
      </select>
    </div>

    <!-- Кнопка Refresh -->
    <button
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="loadTransactions"
      :disabled="!wallet.account"
    >
      Refresh
    </button>

    <!-- Таблица -->
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">TxID</th>
          <th class="p-2 border">Type</th>
          <th class="p-2 border">Timestamp</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Block</th>
          <th class="p-2 border">Chaincode</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in paginatedTransactions" :key="tx.txID" class="hover:bg-gray-100">
          <td class="p-2 border text-blue-600 cursor-pointer" @click="openModal(tx)">
            {{ tx.txID.slice(0,6) + '...' + tx.txID.slice(-4) }}
          </td>
          <td class="p-2 border">{{ tx.type }}</td>
          <td class="p-2 border">{{ formatDate(tx.timestamp) }}</td>
          <td class="p-2 border">
            <span :class="{
              'text-green-600': tx.status === 'Validated',
              'text-yellow-500': tx.status === 'Pending',
              'text-red-600': tx.status === 'Invalid'
            }">
              {{ tx.status }}
            </span>
          </td>
          <td class="p-2 border">{{ tx.block }}</td>
          <td class="p-2 border">{{ tx.chaincode }}</td>
        </tr>
        <tr v-if="filteredTransactions.length === 0">
          <td colspan="6" class="text-center p-4 text-gray-500">No transactions found</td>
        </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="flex justify-end gap-2 mt-4">
      <button
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Prev
      </button>

      <span>
        Page {{ currentPage }} of {{ Math.ceil(filteredTransactions.length / itemsPerPage) }}
      </span>

      <button
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)"
        @click="currentPage++"
      >
        Next
      </button>
    </div>

    <!-- Модалка -->
    <Modal v-if="showModal" @close="showModal = false">
      <div>
        <h3 class="text-lg font-bold mb-2">Transaction Details</h3>
        <p><strong>TxID:</strong> {{ selectedTx?.txID }}</p>
        <p><strong>Creator:</strong> {{ selectedTx?.creator }}</p>
        <p><strong>Endorsements:</strong> {{ selectedTx?.endorsements?.join(', ') || 'None' }}</p>
      </div>
    </Modal>
  </div>
</template>
