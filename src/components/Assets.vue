<script setup lang="ts">
import { onMounted } from "vue";
import { useAssetsStore } from "../stores/assets";
import { useWalletStore } from "../stores/wallet";
import EmptyState from "../components/EmptyState.vue";

const assetsStore = useAssetsStore();
const wallet = useWalletStore();

const refreshAssets = () => {
  assetsStore.fetchAssets();
};

onMounted(() => {
  if (wallet.isConnected) {
    refreshAssets();
  }
});
</script>

<template>
  <div class="p-4 border rounded-lg shadow bg-white">
    <h2 class="text-lg font-bold mb-4">Assets</h2>

    <button
      :disabled="assetsStore.loading"
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      @click="refreshAssets"
    >
      Refresh
    </button>

    <p v-if="assetsStore.loading" class="text-gray-500">Loading...</p>
    <p v-else-if="assetsStore.error" class="text-red-500 font-semibold">
      Failed to load assets
    </p>

    <EmptyState
      v-else-if="!assetsStore.loading && !assetsStore.error && assetsStore.assets.length === 0"
      message="No assets found"
    />

    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">Token</th>
          <th class="p-2 border">Amount</th>
          <th class="p-2 border">Value ($)</th>
          <th class="p-2 border">24h Change</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="asset in assetsStore.assets"
          :key="asset.token"
          class="hover:bg-gray-100"
        >
          <td class="p-2 border flex items-center gap-2">
            <img
              :src="`/assets/${asset.token.toLowerCase()}.png`"
              alt=""
              class="h-5 w-5"
            />
            {{ asset.token }}
          </td>
          <td class="p-2 border">{{ asset.amount }}</td>
          <td class="p-2 border">${{ asset.usdValue.toFixed(2) }}</td>
          <td
            class="p-2 border"
            :class="asset.change24h > 0 ? 'text-green-600' : asset.change24h < 0 ? 'text-red-600' : 'text-gray-500'"
          >
            {{ asset.change24h }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
