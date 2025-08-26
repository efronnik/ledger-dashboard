<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

interface Tab {
  name: string;
  path: string;
}

const tabs: Tab[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Send Transaction", path: "/send" },
];

// Активная вкладка учитывает вложенные маршруты
const isActive = (path: string) => route.path.startsWith(path);
</script>

<template>
  <div class="fixed top-16 left-0 w-full p-4 flex space-x-4">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      @click="router.push(tab.path)"
      :class="[
        'px-4 py-2 rounded hover:bg-gray-300',
        isActive(tab.path) ? 'bg-blue-500 text-white' : 'bg-gray-200',
      ]"
    >
      {{ tab.name }}
    </button>
  </div>
</template>
