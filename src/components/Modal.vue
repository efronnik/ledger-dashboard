<script setup lang="ts">
const emit = defineEmits(["close"]);

const closeModal = () => emit("close");
</script>

<template>
  <transition name="fade">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          @click="closeModal"
          title="Close"
        >
          ✖
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
