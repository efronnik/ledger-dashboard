<script setup>
import { ref } from 'vue';

const isLoading = ref(true);
const isEmpty = ref(false); 
const isError = ref(false);

const assets = ref([
  { name: 'ETH', amount: 1.25, value: 2300 },
  { name: 'USDT', amount: 500, value: 500 },
]);

setTimeout(() => {
  isLoading.value = true;
  isEmpty.value = false;
  isError.value = false;
}, 1000);
</script>

<template>
  <div class="p-4 border rounded-lg shadow-md bg-white">
    <h2 class="text-lg font-bold mb-4">Assets</h2>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-else-if="isEmpty" class="text-gray-500">No assets found</div>
    <div v-else-if="isError" class="text-red-500">Error loading assets</div>

    <!-- Таблица для активов -->
    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b">
          <th class="py-2">Asset</th>
          <th class="py-2">Amount</th>
          <th class="py-2">Value (USD)</th>
        </tr>
      </thead>
      <tbody>
        <!-- Пример строки, потом заменим на динамические данные -->
        <tr v-for="asset in assets" :key="asset.name" class="border-b">
          <td class="py-2">{{ asset.name }}</td>
          <td class="py-2">{{ asset.amount }}</td>
          <td class="py-2">${{ asset.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* позже добавим адаптивность и тему */
</style>
