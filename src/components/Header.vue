<script setup lang="ts">
import { useWalletStore } from '../stores/wallet';
const wallet = useWalletStore();
</script>

<template>
  <header class="w-full bg-gray-100 shadow p-4 fixed top-0 left-0 flex items-center">
    <img src="../assets/logo.jpg" alt="Logo" class="h-10" />
    
    <!-- Адрес по центру -->
    <div class="flex-1 text-center text-gray-700">
      {{ wallet.isConnected ? wallet.account?.slice(0, 6) + '...' + wallet.account?.slice(-4) : 'Not connected' }}
    </div>

    <button
      class="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
      @click="wallet.isConnected ? wallet.disconnectWallet() : wallet.connectWallet()"
    >
      {{ wallet.isConnected ? 'Disconnect' : 'Connect' }}
    </button>
  </header>
</template>
