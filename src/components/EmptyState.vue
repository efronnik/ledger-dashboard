<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 text-gray-500 font-medium">
    <p class="text-lg text-center">{{ message }}</p>
  </div>
</template>
