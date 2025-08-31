<script setup lang="ts">
import { ref } from "vue";
import { ethers } from "ethers";
import { computed } from "vue";
import { useTransactionsStore } from '../stores/transactions';

const amount = ref(''); 
const amountError = ref('');
const walletAddress = ref('');
const walletError = ref('');


function validateNumber() {
    if (amount.value === '') {
        amountError.value = 'Amount is empty';
        return;
    }

    amount.value = amount.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); 
    
    const amountPattern = /^(0|[1-9]\d*)(\.\d{0,18})?$/;


if (!amountPattern.test(amount.value)) {
    amountError.value = 'Invalid format';
    return;
}  else {
    amountError.value = '';
}
}

function validateAddress() {
    if (walletAddress.value === '') {
        walletError.value = 'Address is empty';
        return;
    }

    if (!ethers.isAddress(walletAddress.value)) {
        walletError.value = 'Invalid address';
        return;
    } else {
        walletError.value = '';
    }
}

const sendToken = computed(() => {
    return amountError.value === '' 
    && walletError.value === '' 
    && amount.value !== '' 
    && walletAddress.value !== '';
});

async function transactionsSend() {
    validateNumber();
    validateAddress();

    if (amountError.value || walletError.value) return;

    if (!window.ethereum) {
        alert('MetaMask is not available');
        return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const fromAddress = accounts[0];


    const objTransaction = {
        from: fromAddress,
        to: walletAddress.value,
        value: ethers.parseEther(amount.value).toString()
    };

    try {
        const transactionsHesh = await window.ethereum!.request({
            method: 'eth_sendTransaction',
            params: [objTransaction]
        });
        alert(`Transaction sent! Hash: ${transactionsHesh}`);

        const transactionsStore = useTransactionsStore();
        transactionsStore.transactions.unshift({
            txID: transactionsHesh,       
            type: "Transfer",             
            timestamp: Date.now(),        
            status: "Pending",            
            block: 0,                     
            chaincode: walletAddress.value,
            creator: fromAddress,
            endorsements: []
        });

        localStorage.setItem('cachedTransactions', JSON.stringify(transactionsStore.transactions));

    } catch (error) {
        alert('Transaction failed!');
    }
}

</script>

<template>
  <div class="max-w-md mx-auto bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4">
    <!-- Заголовок -->
    <h2 class="text-xl font-semibold text-white text-center">
      Send Tokens
    </h2>

    <!-- Поле ввода суммы -->
    <div>
      <label class="block text-gray-300 text-sm mb-1">Amount</label>
      <input
        type="text"
        v-model="amount"
        @input="validateNumber"
        @blur="validateNumber"
        placeholder="0.0000"
        class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p v-if="amountError" class="text-red-500 text-sm mt-1"> {{ amountError }}</p>
    </div>

    <!-- Поле ввода адреса -->
    <div>
      <label class="block text-gray-300 text-sm mb-1">Recipient Address</label>
      <input
        type="text"
        v-model="walletAddress"
        @input="validateAddress"
        @blur="validateAddress"
        placeholder="0x..."
        class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p v-if="walletError" class="text-red-500 text-sm mt-1"> {{ walletError }}</p>
    </div>

    <!-- Кнопка -->
    <button
        :disabled="!sendToken"
        @click="transactionsSend"
      class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
    >
      Send
    </button>
  </div>
</template>
