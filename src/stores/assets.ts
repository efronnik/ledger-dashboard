import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { fetchTokens, TokenBalance } from "../services/tokens";
import { useWalletStore } from "./wallet";

export const useAssetsStore = defineStore("assets", () => {
  const assets = ref<TokenBalance[]>([]);
  const loading = ref(false);
  const error = ref(false);

  const wallet = useWalletStore();

  const fetchAssets = async () => {
    if (!wallet.account) {
      console.warn("Wallet not connected, cannot fetch assets");
      assets.value = [];
      return;
    }

    loading.value = true;
    error.value = false;

    try {
      const data = await fetchTokens(wallet.account);
      assets.value = data;
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => wallet.account,
    (newAccount, oldAccount) => {
      assets.value = [];
      if (newAccount) fetchAssets();
    }
  );

  return { assets, loading, error, fetchAssets };
});
