import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { fetchTokens, TokenBalance } from "../services/tokens";
import { useWalletStore } from "./wallet";

export const useAssetsStore = defineStore("assets", () => {
  const assets = ref<TokenBalance[]>([]);
  const loading = ref(false);
  const error = ref(false);

  const wallet = useWalletStore();

  // Функция загрузки активов
  const fetchAssets = async (forceRefresh = false) => {
    if (!wallet.account) {
      console.warn("Wallet not connected, cannot fetch assets");
      assets.value = [];
      return;
    }

    loading.value = true;
    error.value = false;

    try {
      // Передаём forceRefresh = true для принудительной загрузки с сети
      const data = await fetchTokens(wallet.account, forceRefresh);
      assets.value = data;
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  // Автоматическая загрузка при смене аккаунта
  watch(
    () => wallet.account,
    (newAccount) => {
      assets.value = [];
      if (newAccount) fetchAssets();
    },
    { immediate: true } // сразу подгружаем при инициализации store
  );

  return { assets, loading, error, fetchAssets };
});
