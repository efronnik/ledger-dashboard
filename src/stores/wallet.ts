import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWalletStore = defineStore('wallet', () => {
  const account = ref<string | null>(null);
  const isConnected = ref(false);
  const networkCorrect = ref(true); // true если сеть правильная

  // Проверка сети (например Sepolia = 11155111)
  const checkNetwork = async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    networkCorrect.value = chainId === '0xaa36a7'; // Sepolia hex
    if (!networkCorrect.value) alert('Неверная сеть! Подключитесь к Sepolia.');
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask не установлен!');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      account.value = accounts[0];
      isConnected.value = true;
      checkNetwork();
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    account.value = null;
    isConnected.value = false;
    networkCorrect.value = true; // сброс сети при отключении
  };

  // Слушаем изменения аккаунта и сети
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        account.value = accounts[0];
        isConnected.value = true;
      } else {
        disconnectWallet();
      }
    });
    window.ethereum.on('chainChanged', () => {
      checkNetwork();
    });
  }

  return { account, isConnected, networkCorrect, connectWallet, disconnectWallet, checkNetwork };
});
