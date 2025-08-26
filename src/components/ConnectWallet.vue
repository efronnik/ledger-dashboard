<script setup lang="ts">
import { ref } from "vue";
import { useWalletStore } from "../stores/wallet";

const wallet = useWalletStore();
const isConnecting = ref(false);

const handleConnect = async () => {
  isConnecting.value = true;
  try {
    await wallet.connectWallet();
  } catch (err) {
    console.error("Failed to connect wallet", err);
  } finally {
    isConnecting.value = false;
  }
};
</script>

<template>
  <div
    class="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
  >
    <img src="../assets/logo.jpg" alt="Logo" class="h-24 mb-6" />
    <h1 class="text-2xl sm:text-3xl font-bold mb-4 text-center">Connect Your Wallet</h1>
    <button
      class="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
      @click="handleConnect"
      :disabled="isConnecting"
    >
      <span v-if="isConnecting">Connecting...</span>
      <span v-else>Connect MetaMask</span>
    </button>
  </div>
</template>
