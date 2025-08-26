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
  <div class="fixed top-20 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white p-1 rounded-full shadow-sm z-40">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      @click="router.push(tab.path)"
      :class="[
        'px-4 py-1 rounded-full transition-colors text-sm',
        isActive(tab.path)
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
      ]"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

