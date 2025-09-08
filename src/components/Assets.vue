<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWalletStore } from '../stores/wallet';
import { useAssetsStore } from '../stores/assets';
import EmptyState from './EmptyState.vue';
import { ethers } from 'ethers';
import { fetchTokens, TokenBalance } from '../services/tokens';

const assets = ref<AssetItem[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const wallet = useWalletStore();

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

interface AssetItem {
  symbol: string;
  name: string;
  address: string;
  amount: number;
  value: number;
  image: string;
}

const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x776b6fc2ed15d6bb5fc32e0c89de68683118c62a',
    decimals: 18,
    image:
      'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xf08a50178dfcde18524640ea6618a1f965821715',
    decimals: 6,
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    decimals: 18,
    image: 'https://cryptologos.cc/logos/wrapped-ethereum-weth-logo.png?v=024',
  },
];

async function fetchAssets() {
  if (!wallet.account) return;
  isLoading.value = true;
  assets.value = [];
  const provider = new ethers.BrowserProvider(window.ethereum!);

  for (const token of tokens) {
    let amount = 0;
    try {
      if (token.symbol === 'ETH') {
        const balance = await provider.getBalance(wallet.account);
        amount = Number(ethers.formatUnits(balance, token.decimals));
      } else {
        const contract = new ethers.Contract(
          token.address,
          ERC20_ABI,
          provider,
        );
        const balance = await contract.balanceOf(wallet.account);
        amount = Number(ethers.formatUnits(balance, token.decimals));
      }
    } catch (e) {
      console.warn(`Error fetching balance for ${token.symbol}:`, e);
    }

    assets.value.push({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      amount,
      value: 0,
      image: token.image,
    });
  }

  isLoading.value = false;
}
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
