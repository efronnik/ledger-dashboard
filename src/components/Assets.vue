<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWalletStore } from '../stores/wallet'
import { fetchTokens, TokenBalance } from '../services/tokens'

interface Token {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  amount?: number
}

const assets = ref<Token[]>([])
const isLoading = ref(true)

const wallet = useWalletStore()

const fetchAssets = async () => {
  if (!wallet.account) {
    console.warn('Wallet not connected')
    isLoading.value = false
    return
  }

  try {
    // Получаем цены с CoinGecko
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,binancecoin&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    )
    const data: Token[] = await res.json()

    // Получаем реальные балансы с кошелька
    const balances: TokenBalance[] = await fetchTokens(wallet.account)

    // Сопоставляем по символу и подставляем реальные amount
    assets.value = data.map(token => {
      const found = balances.find(b => b.token.toLowerCase() === token.symbol.toLowerCase())
      return {
        ...token,
        amount: found?.amount ?? 0
      }
    })
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAssets)
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 mt-6 w-full max-w-3xl border border-gray-200">
    <h2 class="font-semibold text-sm mb-2">Assets</h2>

    <div v-if="isLoading" class="text-gray-500 text-sm">Loading...</div>

    <div v-else-if="assets.length === 0">
      <p class="text-gray-500 text-sm">No assets found</p>
    </div>

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
        <div class="text-right flex flex-col items-end w-1/5 min-w-[70px]"
             :class="asset.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'">
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
