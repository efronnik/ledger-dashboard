<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-gray-500">
    <p class="text-lg">{{ message }}</p>
  </div>
</template>
