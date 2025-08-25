<script setup>
import { ref } from 'vue';

const isLoading = ref(false);
const isError = ref(true);
const isEmpty = ref(false);

const transactions = ref([]);

setTimeout(() => {
  isLoading.value = false;
  isError.value = true; 
  transactions.value = [
    { id: '1', asset: 'ETH', amount: 0.5, date: '2025-08-25 12:34' },
    { id: '2', asset: 'USDC', amount: 100, date: '2025-08-24 15:20' },
  ];

  isEmpty.value = transactions.value.length === 0;
}, 2000);
</script>

<template>
  <div class="bg-gray-900 p-4 rounded-2xl shadow-md">
    <h2 class="text-xl font-bold text-white mb-2">Recent Transactions</h2>

    <p v-if="isLoading" class="text-gray-500">Loading...</p>
    <p v-else-if="isError" class="text-red-500 font-semibold">Failed to load transactions</p>
    <p v-else-if="isEmpty" class="text-gray-400">No transactions found</p>

    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b">
          <th class="py-2">Asset</th>
          <th class="py-2">Amount</th>
          <th class="py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id" class="border-b">
          <td class="py-2">{{ tx.asset }}</td>
          <td class="py-2">{{ tx.amount }}</td>
          <td class="py-2">{{ tx.date }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
