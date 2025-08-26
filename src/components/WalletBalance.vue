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

  // Проверка наличия MetaMask
  if (!window.ethereum) {
    console.error("MetaMask is not installed");
    isError.value = true;
    return;
  }

  isLoading.value = true;
  isError.value = false;

  try {
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
  <div class="bg-white rounded-xl shadow p-4 mt-6 w-80">
    <h2 class="font-semibold text-sm mb-2">Wallet Balance</h2>

    <div v-if="isLoading" class="text-gray-500 text-xl font-semibold">Loading...</div>
    <div v-else-if="isError" class="text-red-500 font-semibold text-xl">
      Network error, please try again
    </div>
    <EmptyState v-else-if="balance === null" message="No data found" />
    <div v-else class="text-2xl font-bold text-gray-700">{{ balance }} ETH</div>

    <button
      class="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
      @click="loadBalance"
      :disabled="isLoading || !wallet.isConnected"
    >
      Refresh
    </button>
  </div>
</template>
