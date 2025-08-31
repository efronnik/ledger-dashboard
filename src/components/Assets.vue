<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWalletStore } from '../stores/wallet';
import { fetchTokens, TokenBalance } from '../services/tokens';
import EmptyState from './EmptyState.vue';

interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  amount?: number;
}

const assets = ref<Token[]>([]);
const isLoading = ref(true);

const wallet = useWalletStore();

const fetchAssets = async () => {
  if (!wallet.account) {
    console.warn('Wallet not connected');
    isLoading.value = false;
    return;
  }

  isLoading.value = true;

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false',
    );
    const data: Token[] = await res.json();

    const balances: TokenBalance[] = await fetchTokens(wallet.account);

    assets.value = data.map(token => {
      const found = balances.find(
        b => b.token.toLowerCase() === token.symbol.toLowerCase(),
      );
      return {
        ...token,
        amount: found?.amount ?? 0,
      };
    });
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    assets.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleRefresh = () => fetchAssets();

onMounted(fetchAssets);
</script>

<template>
  <div
    class="bg-white rounded-xl shadow p-4 w-full max-w-3xl border border-gray-200"
  >
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-semibold text-sm">Assets</h2>
      <button
        @click="handleRefresh"
        :disabled="isLoading || !wallet.account"
        class="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
      >
        🔄
      </button>
    </div>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center py-8 text-gray-500"
    >
      🔄 Loading assets...
    </div>

    <!-- Empty state -->
    <EmptyState v-else-if="assets.length === 0" message="No assets found" />

    <!-- Asset list -->
    <div v-else class="space-y-3">
      <div
        v-for="asset in assets"
        :key="asset.id"
        class="flex items-center justify-between p-3 rounded-lg bg-white"
      >
        <!-- Левая часть: иконка + название -->
        <div class="flex items-center space-x-3 w-2/5 min-w-[120px]">
          <img
            :src="asset.image"
            :alt="asset.name"
            class="w-8 h-8 rounded-full"
          />
          <div class="truncate">
            <p class="font-semibold uppercase truncate">{{ asset.symbol }}</p>
            <p class="text-xs text-gray-400 truncate">{{ asset.name }}</p>
          </div>
        </div>

        <!-- Amount -->
        <div class="text-right w-1/5 min-w-[80px]">
          <p class="font-mono text-sm truncate">
            {{ asset.amount?.toFixed(6) }}
          </p>
          <p class="text-xs text-gray-400">Amount</p>
        </div>

        <!-- Value -->
        <div class="text-right w-1/5 min-w-[90px]">
          <p class="font-mono text-sm truncate">
            ${{ ((asset.amount ?? 0) * asset.current_price).toFixed(2) }}
          </p>
          <p class="text-xs text-gray-400">Value</p>
        </div>

        <!-- Change 24h -->
        <div
          class="text-right flex flex-col items-end w-1/5 min-w-[70px]"
          :class="
            asset.price_change_percentage_24h >= 0
              ? 'text-green-500'
              : 'text-red-500'
          "
        >
          <p class="font-mono text-sm">
            {{ asset.price_change_percentage_24h.toFixed(2) }}%
          </p>
          <span v-if="asset.price_change_percentage_24h >= 0">📈</span>
          <span v-else>📉</span>
        </div>
      </div>
    </div>
  </div>
</template>
