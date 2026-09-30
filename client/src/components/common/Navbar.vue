<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '../../stores/theme';
import { useAuthStore } from '../../stores/auth';
import { Sun, Moon, LayoutDashboard, Menu, X } from 'lucide-vue-next';

const { t, locale } = useI18n();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const mobileOpen = ref(false);

const navLinks = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/about', label: t('nav.about') },
  { to: '/portfolio', label: t('nav.portfolio') },
  { to: '/event', label: t('nav.event') },
  { to: '/blog', label: t('nav.blog') },
  { to: '/member', label: t('nav.member') },
  { to: '/camavis', label: t('nav.camavis') },
  { to: '/contact', label: t('nav.contact') },
]);

const toggleLang = () => {
  locale.value = locale.value === 'id' ? 'en' : 'id';
  localStorage.setItem('dekave_lang', locale.value);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<template>
  <header class="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
    <div
      class="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto rounded-full border border-slate-200/80 dark:border-white/[0.12] bg-white/85 dark:bg-[#070E22]/85 backdrop-blur-2xl px-3 sm:px-5 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <!-- Brand Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group pl-1">
        <div class="relative flex items-center justify-center">
          <img
            src="/logo-dkv-biru.png"
            alt="Logo DKV Universitas Merangin"
            class="h-7 sm:h-8 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform"
          />
          <img
            src="/logo-dkv-putih.png"
            alt="Logo DKV Universitas Merangin"
            class="h-7 sm:h-8 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
          />
        </div>
        <div class="flex flex-col">
          <span class="font-heading font-extrabold text-base tracking-wider text-slate-900 dark:text-white leading-none group-hover:text-sky transition-colors flex items-center gap-1">
            DKV
            <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/15 dark:bg-sky/20 text-sky-700 dark:text-sky border border-sky-500/30 dark:border-sky/30">v0.6</span>
          </span>
          <span class="text-[10px] text-slate-500 dark:text-gray-400 tracking-tight leading-none mt-0.5 hidden sm:block">Univ. Merangin</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <nav class="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.05]">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200"
          :class="isActive(link.to)
            ? 'bg-sky-500/10 dark:bg-sky/15 text-sky-600 dark:text-sky font-semibold border border-sky-500/30 dark:border-sky/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
            : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.06]'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Action Controls -->
      <div class="flex items-center gap-2">
        <!-- Language Switcher -->
        <button
          @click="toggleLang"
          class="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:border-sky-500/40 dark:hover:border-sky/40 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          title="Ganti Bahasa (ID / EN)"
        >
          {{ locale === 'id' ? 'EN' : 'ID' }}
        </button>

        <!-- Theme Toggle -->
        <button
          @click="themeStore.toggle"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:border-sky-500/40 dark:hover:border-sky/40 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          title="Mode Tampilan (Terang / Gelap)"
        >
          <Sun v-if="themeStore.isDark" :size="15" class="text-amber-400" />
          <Moon v-else :size="15" class="text-sky-600" />
        </button>


        <!-- Admin Logged In Quick Access -->
        <div v-if="authStore.isAuthenticated()" class="hidden sm:flex items-center gap-1.5 bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-500/30 px-2.5 py-1 rounded-full">
          <RouterLink
            to="/admin/dashboard"
            class="text-[11px] text-sky-700 dark:text-sky font-semibold hover:underline flex items-center gap-1"
          >
            <LayoutDashboard :size="13" />
            <span>Dashboard</span>
          </RouterLink>
          <span class="text-slate-400 dark:text-gray-600">|</span>
          <button
            @click="handleLogout"
            class="text-[11px] text-slate-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            Keluar
          </button>
        </div>

        <!-- Mobile Menu Hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          <X v-if="mobileOpen" :size="16" />
          <Menu v-else :size="16" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-if="mobileOpen"
        class="lg:hidden pointer-events-auto max-w-6xl mx-auto mt-2 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#070E22]/95 backdrop-blur-2xl p-4 shadow-xl dark:shadow-2xl space-y-1"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="mobileOpen = false"
          class="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="isActive(link.to)
            ? 'bg-sky-500/10 dark:bg-sky/15 text-sky-600 dark:text-sky font-semibold border border-sky-500/20 dark:border-sky/20'
            : 'text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'"
        >
          <span>{{ link.label }}</span>
          <span v-if="isActive(link.to)" class="w-1.5 h-1.5 rounded-full bg-sky"></span>
        </RouterLink>

        <!-- Admin Link on Mobile (if logged in) -->
        <div v-if="authStore.isAuthenticated()" class="pt-3 border-t border-slate-200 dark:border-white/10 mt-2">
          <RouterLink
            to="/admin/dashboard"
            @click="mobileOpen = false"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-600 dark:text-sky"
          >
            <LayoutDashboard :size="16" />
            <span>Dashboard Admin</span>
          </RouterLink>
        </div>
      </div>
    </transition>
  </header>
</template>
