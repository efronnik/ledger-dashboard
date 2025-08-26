<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useWalletStore } from "../stores/wallet";
import Modal from "../components/Modal.vue";
import EmptyState from "../components/EmptyState.vue";
import { fetchTransactions, Transaction as RpcTransaction } from "../services/rpc";
import { formatDate } from "../utils/formatDate";

interface Transaction {
  txID: string;
  type: string;
  timestamp: number;
  status: "Validated" | "Pending" | "Invalid";
  block: number;  // <-- число
  chaincode: string;
  creator: string;
  endorsements?: string[];
}

const wallet = useWalletStore();

const transactions = ref<Transaction[]>([]);
const isLoading = ref(false);
const isError = ref(false);

const search = ref("");
const filterStatus = ref("");

const currentPage = ref(1);
const itemsPerPage = 10;

const filteredTransactions = computed(() => {
  return transactions.value
    .filter((tx) => !filterStatus.value || tx.status === filterStatus.value)
    .filter((tx) =>
      !search.value || tx.txID.toLowerCase().includes(search.value.toLowerCase())
    );
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage));

const showModal = ref(false);
const selectedTx = ref<Transaction | null>(null);

const openModal = (tx: Transaction) => {
  selectedTx.value = tx;
  showModal.value = true;
};

const loadTransactions = async () => {
  if (!wallet.isConnected || !wallet.account) return;

  isLoading.value = true;
  isError.value = false;

  try {
    const txs: RpcTransaction[] = await fetchTransactions(wallet.account);

    if (!txs || txs.length === 0) {
      transactions.value = [];
      isError.value = true; // покажем EmptyState
      return;
    }

    // Преобразуем к нашему типу Transaction
    transactions.value = txs.map((tx) => ({
      ...tx,
      block: typeof tx.block === "string" ? parseInt(tx.block, 16) : tx.block,
    }));

    currentPage.value = 1; // сброс пагинации при обновлении
  } catch (err) {
    console.error("Network error:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTransactions();
});
</script>

<template>
  <div class="p-4 mt-24">
    <h2 class="text-xl font-bold mb-4">Recent Transactions</h2>

    <div class="flex gap-2 mb-4">
      <input
        v-model="search"
        placeholder="Search by TxID"
        class="border px-2 py-1 rounded"
      />
      <select v-model="filterStatus" class="border px-2 py-1 rounded">
        <option value="">All</option>
        <option value="Validated">Validated</option>
        <option value="Pending">Pending</option>
        <option value="Invalid">Invalid</option>
      </select>
      <button
        @click="loadTransactions"
        class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>

    <EmptyState
      v-else-if="isError || filteredTransactions.length === 0"
      message="No transactions found"
    />

    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">TxID</th>
          <th class="p-2 border">Type</th>
          <th class="p-2 border">Timestamp</th>
          <th class="p-2 border">Status</th>
          <th class="p-2 border">Block</th>
          <th class="p-2 border">Chaincode</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tx in paginatedTransactions"
          :key="tx.txID"
          class="hover:bg-gray-100"
        >
          <td
            class="p-2 border text-blue-600 cursor-pointer"
            @click="openModal(tx)"
          >
            {{ tx.txID.slice(0, 6) + "..." + tx.txID.slice(-4) }}
          </td>
          <td class="p-2 border">{{ tx.type }}</td>
          <td class="p-2 border">{{ formatDate(tx.timestamp) }}</td>
          <td class="p-2 border">
            <span
              :class="{
                'text-green-600': tx.status === 'Validated',
                'text-yellow-500': tx.status === 'Pending',
                'text-red-600': tx.status === 'Invalid',
              }"
            >
              {{ tx.status }}
            </span>
          </td>
          <td class="p-2 border">{{ tx.block }}</td>
          <td class="p-2 border">{{ tx.chaincode }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Пагинация -->
    <div class="flex justify-end gap-2 mt-4" v-if="filteredTransactions.length > itemsPerPage">
      <button
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Prev
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
    </div>

    <Modal v-if="showModal" @close="showModal = false">
      <div>
        <h3 class="text-lg font-bold mb-2">Transaction Details</h3>
        <p><strong>TxID:</strong> {{ selectedTx?.txID }}</p>
        <p><strong>From:</strong> {{ selectedTx?.creator }}</p>
        <p><strong>To / Contract:</strong> {{ selectedTx?.chaincode }}</p>
      </div>
    </Modal>
  </div>
</template>
