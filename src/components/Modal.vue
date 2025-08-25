<script setup lang="ts">
const emit = defineEmits<{ close: () => void }>()

const closeModal = () => emit('close') // иногда помогает TS-плагину

</script>


<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96 relative">
      <button class="absolute top-2 right-2 text-gray-500" @click="closeModal">✖</button>
      <slot />
    </div>
  </div>
</template>

