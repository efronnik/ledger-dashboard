<script setup lang="ts">
import { onMounted } from "vue";
import { useWalletStore } from "../stores/wallet";

const wallet = useWalletStore();

const handleWalletClick = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  if (wallet.isConnected) {
    wallet.disconnectWallet();
  } else {
    await wallet.connectWallet();
  }
};

onMounted(async () => {
  if (wallet.isConnected) {
    await wallet.checkNetwork();
  }
});
</script>

<template>
  <header class="flex items-center justify-between px-6 py-2 bg-white shadow-sm rounded-b-md fixed top-0 left-0 w-full z-50">
    <!-- Логотип и название -->
    <div class="flex items-center space-x-2">
      <img src="../assets/logo.jpg" alt="Logo" class="w-8 h-8"/>
      <div>
        <h1 class="font-bold text-base">Blockchain Ledger</h1>
        <p class="text-xs text-gray-500">Corporate Dashboard</p>
      </div>
    </div>

    <!-- Статус кошелька и кнопка -->
    <div class="flex items-center space-x-3">
      <div class="flex items-center space-x-1 text-xs text-gray-700">
        <span
          class="w-3 h-3 rounded-full inline-block"
          :class="wallet.isConnected ? 'bg-green-500' : 'bg-red-500'"
        ></span>
        <span>
          {{ wallet.isConnected ? wallet.account?.slice(0,6) + '...' + wallet.account?.slice(-4) : 'Not connected' }}
        </span>
        <button
          class="p-1 rounded border border-transparent text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-blue-500 transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v16h16V4H4z"></path>
          </svg>
        </button>
      </div>
      <button
        class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-all"
        @click="handleWalletClick"
      >
        {{ wallet.isConnected ? 'Disconnect' : 'Connect' }}
      </button>
    </div>
  </header>
</template>
