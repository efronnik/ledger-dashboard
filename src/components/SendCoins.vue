<script setup lang="ts">
import { ref } from "vue";
import { ethers } from "ethers";

const amount = ref('');
const error = ref('');
const isValidAmount = /^(0|[1-9][0-9]*)(\.[0-9]{1,18})?$/;
const weiValue = ethers.parseEther(amount.value);

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
        placeholder="0.0000"
        class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <!-- Поле ввода адреса -->
    <div>
      <label class="block text-gray-300 text-sm mb-1">Recipient Address</label>
      <input
        type="text"
        placeholder="0x..."
        class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <!-- Кнопка -->
    <button
      class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
    >
      Send
    </button>
  </div>
</template>
