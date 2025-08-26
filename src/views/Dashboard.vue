<script setup>
import Header from "../components/Header.vue";
import Tabs from "../components/Tabs.vue";
import WalletBalance from "../components/WalletBalance.vue";
import Assets from "../components/Assets.vue";
import RecentTransactions from "../components/RecentTransactions.vue";
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <!-- Header и вкладки -->
    <Header />
    <Tabs />

    <!-- Основной контент растянут на всю оставшуюся высоту -->
    <div class="flex flex-1 gap-6 p-4 overflow-hidden">
      <!-- Левая колонка: Recent Transactions, 70% ширины -->
      <div class="w-[70%] h-full">
        <RecentTransactions class="h-full"/>
      </div>

      <!-- Правая колонка: Wallet Balance и Assets, 30% ширины -->
      <div class="w-[30%] flex flex-col gap-6 h-full overflow-auto">
        <WalletBalance />
        <Assets />
      </div>
    </div>
  </div>
</template>

