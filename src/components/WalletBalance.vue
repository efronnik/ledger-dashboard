<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useWalletStore } from '../stores/wallet';
import EmptyState from './EmptyState.vue';

const wallet = useWalletStore();
const isLoading = ref(false);
const isError = ref(false);
const balance = ref<number | null>(null);
const displayedBalance = ref<number | null>(null);

// Анимация изменения баланса
const animateBalance = (newValue: number) => {
  if (displayedBalance.value === null) {
    displayedBalance.value = newValue;
    return;
  }
  const start = displayedBalance.value;
  const end = newValue;
  const duration = 500; // миллисекунды
  const stepTime = 20;
  const steps = duration / stepTime;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    displayedBalance.value = parseFloat(
      (start + ((end - start) * currentStep) / steps).toFixed(4),
    );
    if (currentStep >= steps) clearInterval(timer);
  }, stepTime);
};

watch(balance, newVal => {
  if (newVal !== null) animateBalance(newVal);
});

const loadBalance = async () => {
  if (!wallet.isConnected || !wallet.account) return;

  if (!window.ethereum) {
    console.error('MetaMask is not installed');
    isError.value = true;
    return;
  }

  isLoading.value = true;
  isError.value = false;

  try {
    const raw = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [wallet.account, 'latest'],
    });
    balance.value = parseFloat((parseInt(raw, 16) / 1e18).toFixed(4));
  } catch (err) {
    console.error('Failed to fetch balance', err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadBalance);
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 mt-24 w-full max-w-3xl relative">
    <!-- Кнопка refresh -->
    <button
      @click="loadBalance"
      :disabled="isLoading || !wallet.isConnected"
      class="absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-blue-500 transition-all"
      title="Refresh"
    >
      🔄
    </button>

    <!-- Заголовок с иконкой доллара -->
    <h2 class="font-semibold text-sm mb-1 flex items-center gap-1">
      💵 Wallet Balance
    </h2>
    <p class="text-xs text-gray-500 mb-2">Total Portfolio Value</p>

    <!-- Основной баланс -->
    <div v-if="isLoading" class="text-gray-500 font-semibold text-xl">
      Loading...
    </div>
    <div v-else-if="isError" class="text-red-500 font-semibold text-xl">
      Network error, please try again
    </div>
    <EmptyState v-else-if="displayedBalance === null" message="No data found" />
    <div
      v-else
      class="text-2xl font-bold text-gray-700 mb-1 flex items-baseline gap-1"
    >
      {{ displayedBalance }}
      <span class="text-xs text-gray-500">ETH</span>
    </div>
  </div>
</template>
