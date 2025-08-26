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
  <div class="bg-white rounded-xl shadow p-4 mt-6 w-80">
    <h2 class="font-semibold text-sm mb-2">Assets</h2>

    <button
      :disabled="assetsStore.loading"
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
      @click="refreshAssets"
    >
      Refresh
    </button>

    <p v-if="assetsStore.loading" class="text-gray-500 text-sm">Loading...</p>
    <p v-else-if="assetsStore.error" class="text-red-500 font-semibold text-sm">
      Failed to load assets
    </p>
    <EmptyState
      v-else-if="!assetsStore.loading && !assetsStore.error && assetsStore.assets.length === 0"
      message="No assets found"
    />

    <table v-else class="w-full text-left text-sm border-collapse">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-2">Token</th>
          <th class="p-2">Amount</th>
          <th class="p-2">Value</th>
          <th class="p-2">24h Change</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="asset in assetsStore.assets"
          :key="asset.token"
          class="border-t hover:bg-gray-50"
        >
          <td class="p-2 flex items-center gap-2">
            <img
              :src="`/assets/${asset.token.toLowerCase()}.png`"
              alt=""
              class="h-5 w-5"
            />
            {{ asset.token }}
          </td>
          <td class="p-2">{{ asset.amount }}</td>
          <td class="p-2">${{ asset.usdValue.toFixed(2) }}</td>
          <td
            class="p-2"
            :class="asset.change24h > 0 ? 'text-green-500' : asset.change24h < 0 ? 'text-red-500' : 'text-gray-500'"
          >
            {{ asset.change24h }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
