<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-primary text-gray-900 dark:text-gray-100">
    <Navbar />
    <main class="flex-1 pt-16">
      <slot />
    </main>
    <Footer />
  </div>
</template>
