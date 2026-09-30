<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#050A18] text-gray-100 selection:bg-accent selection:text-white relative overflow-x-hidden">
    <!-- Ambient Global Glow Spotlights -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky/15 via-royal/10 to-transparent rounded-full blur-3xl opacity-70"></div>
      <div class="absolute top-[35%] -right-40 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[140px]"></div>
      <div class="absolute top-[65%] -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
    </div>

    <Navbar />

    <main class="flex-1 relative z-10">
      <slot />
    </main>

    <Footer />
  </div>
</template>
