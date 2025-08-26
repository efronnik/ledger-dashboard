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
  <div class="bg-white rounded-xl shadow p-4 mt-24 w-full">
    <!-- Заголовок -->
    <h2 class="font-semibold text-lg mb-4">Recent Transactions</h2>

    <!-- Фильтры -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <select
        v-model="filterStatus"
        class="border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
      >
        <option value="">All Status</option>
        <option value="Validated">Validated</option>
        <option value="Pending">Pending</option>
        <option value="Invalid">Invalid</option>
      </select>

      <input
        v-model="search"
        type="text"
        placeholder="Search by Transaction ID"
        class="border border-gray-300 rounded px-2 py-2 bg-white text-gray-700 w-60 min-w-[150px]"
      />
    </div>

    <!-- Таблица -->
    <table class="w-full text-left text-sm border-collapse">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-2 border">Transaction ID</th>
          <th class="p-2 border">Type</th>
          <th class="p-2 border">Timestamp</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Block</th>
          <th class="p-2 border">Chaincode</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tx in paginatedTransactions"
          :key="tx.txID"
          class="border-t hover:bg-gray-50 cursor-pointer"
          @click="openModal(tx)"
        >
          <td class="p-2 text-blue-600">
            {{ tx.txID.slice(0,6) + '...' + tx.txID.slice(-4) }}
          </td>
          <td class="p-2">{{ tx.type }}</td>
          <td class="p-2">{{ formatDate(tx.timestamp) }}</td>
          <td class="p-2">
            <span
              class="px-2 py-1 rounded text-xs"
              :class="{
                'bg-green-100 text-green-800': tx.status === 'Validated',
                'bg-yellow-100 text-yellow-800': tx.status === 'Pending',
                'bg-red-100 text-red-800': tx.status === 'Invalid'
              }"
            >
              {{ tx.status }}
            </span>
          </td>
          <td class="p-2">{{ tx.block }}</td>
          <td class="p-2 text-green-700">{{ tx.chaincode }}</td>
        </tr>
        <tr v-if="filteredTransactions.length === 0">
          <td colspan="6" class="text-center p-4 text-gray-500">No transactions found</td>
        </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="flex justify-end mt-2 space-x-2">
  <button
    class="px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
    :disabled="currentPage === 1"
    @click="currentPage--"
  >
    Previous
  </button>
  <button
    class="px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
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
