import { defineStore } from "pinia";
import { ref } from "vue";

export const useWalletStore = defineStore("wallet", () => {
  const account = ref<string | null>(localStorage.getItem("walletAccount"));
  const isConnected = ref(!!account.value);
  const networkCorrect = ref(true);

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const expectedChainId =
      "0x" + parseInt(import.meta.env.VITE_DEFAULT_CHAIN_ID).toString(16);
    networkCorrect.value = chainId === expectedChainId;
    if (!networkCorrect.value)
      alert("Incorrect network! Please connect to Sepolia.");
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      account.value = accounts[0];
      isConnected.value = true;
      if (account.value) {
        localStorage.setItem("walletAccount", account.value);
      }
      await checkNetwork();
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    account.value = null;
    isConnected.value = false;
    networkCorrect.value = true;
    localStorage.removeItem("walletAccount");
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        account.value = accounts[0];
        if (account.value) {
          localStorage.setItem("walletAccount", account.value);
        }
      } else disconnectWallet();
    });
    window.ethereum.on("chainChanged", () => checkNetwork());
  }

  return {
    account,
    isConnected,
    networkCorrect,
    connectWallet,
    disconnectWallet,
    checkNetwork,
  };
});
