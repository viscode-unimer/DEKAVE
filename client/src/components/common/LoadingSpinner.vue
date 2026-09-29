<script setup>
defineProps({ size: { type: String, default: 'md' } });
</script>

<template>
  <div class="flex justify-center items-center py-12">
    <div
      class="animate-spin rounded-full border-4 border-gray-200 border-t-accent"
      :class="size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10'"
    />
  </div>
</template>
