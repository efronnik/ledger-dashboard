<script setup lang="ts">
import { useWalletStore } from "../stores/wallet";
const wallet = useWalletStore();

const handleConnect = () => {
  wallet.connectWallet();
};
</script>

<template>
  <div
    class="w-full h-screen flex flex-col items-center justify-center bg-gray-50"
  >
    <img src="../assets/logo.jpg" alt="Logo" class="h-24 mb-6" />
    <h1 class="text-2xl font-bold mb-4">Connect Your Wallet</h1>
    <button
      class="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
      @click="handleConnect"
    >
      Connect MetaMask
    </button>
  </div>
</template>
