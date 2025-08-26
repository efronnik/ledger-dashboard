<script setup lang="ts">
import { computed } from "vue";
import { useWalletStore } from "./stores/wallet";
import Header from "./components/Header.vue";
import Tabs from "./components/Tabs.vue";
import ConnectWallet from "./components/ConnectWallet.vue";

const wallet = useWalletStore();

// Вычисляемое свойство для состояния подключения
const isConnected = computed(() => wallet.isConnected);
</script>

<template>
  <transition name="fade" mode="out-in">
    <!-- Экран подключения кошелька -->
    <ConnectWallet v-if="!isConnected" key="connect" />

    <!-- Основной интерфейс -->
    <div v-else key="main">
      <Header />
      <Tabs />
      <router-view />
    </div>
  </transition>
</template>

<style>
/* Плавное появление/исчезновение */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
