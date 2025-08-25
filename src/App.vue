<script setup lang="ts">
import { useWalletStore } from './stores/wallet';
import Dashboard from './views/Dashboard.vue';
import ConnectWallet from './components/ConnectWallet.vue';

const wallet = useWalletStore();
</script>

<template>
  <!-- Показываем экран подключения, если кошелёк не подключен -->
  <ConnectWallet v-if="!wallet.isConnected" />
  
  <!-- После подключения — Dashboard -->
  <Dashboard v-else />
</template>
