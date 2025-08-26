<script setup lang="ts">
import { ref } from "vue";
import { useWalletStore } from "../stores/wallet";
import EmptyState from "../components/EmptyState.vue";

const wallet = useWalletStore();

const isLoading = ref(false);
const isError = ref(false);
const balance = ref<number | null>(null);

const loadBalance = async () => {
  if (!wallet.isConnected || !wallet.account) return;

  isLoading.value = true;
  isError.value = false;

  try {
    // Здесь пример получения баланса через window.ethereum
    const raw = await window.ethereum.request({
      method: "eth_getBalance",
      params: [wallet.account, "latest"],
    });
    balance.value = parseFloat((parseInt(raw, 16) / 1e18).toFixed(4));
  } catch (err) {
    console.error("Failed to fetch balance", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="p-4 border rounded-lg shadow bg-white w-full max-w-sm">
    <h2 class="text-lg font-bold mb-2">Wallet Balance</h2>

    <p v-if="isLoading" class="text-gray-500">Loading...</p>
    <p v-if="isError" class="text-red-500 font-semibold">
      Network error, please try again
    </p>
    <EmptyState v-else-if="balance === null" message="No data found" />

    <div v-else>
      <p class="text-2xl font-semibold text-gray-700">{{ balance }} ETH</p>
    </div>

    <button
      class="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="loadBalance"
      :disabled="isLoading || !wallet.isConnected"
    >
      Refresh
    </button>
  </div>
</template>
