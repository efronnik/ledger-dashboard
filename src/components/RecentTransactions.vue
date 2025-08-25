<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTransactionsStore } from '../stores/transactions';
import Modal from './Modal.vue';
import { formatDate } from '../utils/formatDate';

// Store транзакций
const transactionsStore = useTransactionsStore();

// Поиск и фильтры
const search = ref('');
const filterStatus = ref('');

// Модальное окно
const showModal = ref(false);
const selectedTx = ref<any>(null);

// Фильтрация транзакций по статусу и TxID
const filteredTransactions = computed(() => {
  return transactionsStore.transactions
    .filter(tx => !filterStatus.value || tx.status === filterStatus.value)
    .filter(tx => !search.value || tx.txID.toLowerCase().includes(search.value.toLowerCase()));
});

// Открытие модального окна
const openModal = (tx: any) => {
  selectedTx.value = tx;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Получаем транзакции при монтировании
onMounted(() => {
  transactionsStore.fetchTransactions();
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
        <tr v-for="tx in filteredTransactions" :key="tx.txID" class="hover:bg-gray-100">
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
  </div>
</template>
