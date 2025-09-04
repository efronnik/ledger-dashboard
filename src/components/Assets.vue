<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWalletStore } from '../stores/wallet';
import { useAssetsStore } from '../stores/assets';
import EmptyState from './EmptyState.vue';
import { ethers } from 'ethers';
import { fetchTokens, TokenBalance } from '../services/tokens';
</script>

<template>
  <div
    class="bg-white rounded-xl shadow p-4 w-full max-w-3xl border border-gray-200"
  >
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-semibold text-sm">Assets</h2>
      <button
        class="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
      >
        🔄
      </button>
    </div>

    <!-- Loading -->
    <div class="flex items-center justify-center py-8 text-gray-500">
      🔄 Loading assets...
    </div>

    <!-- Empty state -->
    <!-- <EmptyState v-else-if="assets.length === 0" message="No assets found" /> -->

    <!-- Asset list -->
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 rounded-lg bg-white">
        <!-- Левая часть: иконка + название -->
        <div class="flex items-center space-x-3 w-2/5 min-w-[120px]">
          <img class="w-8 h-8 rounded-full" />
          <div class="truncate">
            <p class="font-semibold uppercase truncate"></p>
            <p class="text-xs text-gray-400 truncate"></p>
          </div>
        </div>

        <!-- Amount -->
        <div class="text-right w-1/5 min-w-[80px]">
          <p class="font-mono text-sm truncate"></p>
          <p class="text-xs text-gray-400">Amount</p>
        </div>

        <!-- Value -->
        <div class="text-right w-1/5 min-w-[90px]">
          <p class="font-mono text-sm truncate"></p>
          <p class="text-xs text-gray-400">Value</p>
        </div>

        <!-- Change 24h -->
        <div class="text-right flex flex-col items-end w-1/5 min-w-[70px]">
          <p class="font-mono text-sm"></p>
          <span>📈</span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>
