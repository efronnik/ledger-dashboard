<script setup>
import { ref } from 'vue';

const isLoading = ref(true);
const isError = ref(false);
const isEmpty = ref(false);

const balance = ref(0);
const usdValue = ref(0);

setTimeout(() => {
  isLoading.value = false;
  isError.value = true;
  balance.value = 1.25;
  usdValue.value = 2300;
  isEmpty.value = balance.value === 0;
}, 2000);
</script>

<template>
  <div class="p-4 border rounded-lg shadow bg-white">
    <h2 class="text-lg font-bold mb-2">Wallet Balance</h2>

    <p v-if="isLoading" class="text-gray-500">Loading...</p>
    <p v-else-if="isError" class="text-red-500 font-semibold">Failed to load balance</p>
    <p v-else-if="isEmpty" class="text-gray-400">No funds in wallet</p>

    <div v-else>
        <p class="text-2xl font-semibold text-gray-700">
      {{ balance }} ETH
        </p>
    <p class="text-sm text-gray-500">≈ ${{ usdValue }}</p>
    </div>

    
  </div>
</template>
