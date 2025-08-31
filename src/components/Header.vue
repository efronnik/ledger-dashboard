<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWalletStore } from '../stores/wallet';

const wallet = useWalletStore();
const isLoadingWallet = ref(false);

const handleWalletClick = async () => {
  if (!window.ethereum) return;

  isLoadingWallet.value = true;
  try {
    if (wallet.isConnected) {
      await wallet.disconnectWallet();
    } else {
      await wallet.connectWallet();
      await wallet.checkNetwork();
    }
  } catch (err) {
    console.error('Wallet action failed', err);
  } finally {
    isLoadingWallet.value = false;
  }
};

const copyWallet = async () => {
  if (!wallet.account) return;
  try {
    await navigator.clipboard.writeText(wallet.account);
  } catch (err) {
    console.error('Failed to copy wallet:', err);
  }
};

onMounted(async () => {
  if (wallet.isConnected) {
    await wallet.checkNetwork();
  }
});
</script>

<template>
  <header
    class="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-2 bg-white shadow-sm rounded-b-md fixed top-0 left-0 w-full z-50"
  >
    <!-- Логотип и название -->
    <div class="flex items-center space-x-2 mb-2 sm:mb-0">
      <img src="../assets/logo.jpg" alt="Logo" class="w-8 h-8" />
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
        <span class="truncate max-w-[120px] sm:max-w-[200px]">
          {{
            wallet.isConnected
              ? wallet.account?.slice(0, 6) + '...' + wallet.account?.slice(-4)
              : 'Not connected'
          }}
        </span>
        <button
          class="p-1 rounded border border-transparent text-gray-700 bg-gray-100 hover:bg-gray-200 hover:border-blue-500 transition-all"
          @click="copyWallet"
          title="Copy wallet address"
        >
          📋
        </button>
      </div>

      <button
        class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-all flex items-center justify-center"
        @click="handleWalletClick"
        :disabled="isLoadingWallet"
      >
        <span v-if="isLoadingWallet" class="animate-spin mr-1">⏳</span>
        {{ wallet.isConnected ? 'Disconnect' : 'Connect' }}
      </button>
    </div>
  </header>
</template>
