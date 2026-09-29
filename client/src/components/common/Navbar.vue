<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '../../stores/theme';
import { useAuthStore } from '../../stores/auth';
import { Sun, Moon, LayoutDashboard, Lock, Menu, X } from 'lucide-vue-next';

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

const isActive = (path) => route.path === path;
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-primary/90 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="font-heading text-2xl font-bold text-accent tracking-wider">DKV</span>
          <span class="hidden sm:block text-xs text-gray-500 dark:text-gray-400 leading-tight">Univ. Merangin</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium transition-colors"
            :class="isActive(link.to) ? 'text-accent font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent'"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-2.5">
          <!-- Language Toggle -->
          <button
            @click="toggleLang"
            class="px-2.5 py-1 text-xs font-bold rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent transition-colors"
            title="Ganti Bahasa / Switch Language"
          >
            {{ locale === 'id' ? 'EN' : 'ID' }}
          </button>

          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggle"
            class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent transition-colors"
            title="Toggle Mode Gelap / Terang"
          >
            <Sun v-if="themeStore.isDark" :size="16" />
            <Moon v-else :size="16" />
          </button>

          <!-- Admin Button (Authenticated vs Guest) -->
          <div v-if="authStore.isAuthenticated()" class="hidden sm:flex items-center gap-2">
            <RouterLink
              to="/admin/dashboard"
              class="text-xs bg-accent text-white font-semibold px-3 py-1.5 rounded-full hover:bg-accent-hover transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard :size="14" />
              <span>Dashboard</span>
            </RouterLink>
            <button
              @click="handleLogout"
              class="text-xs text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
              title="Keluar dari Admin"
            >
              Keluar
            </button>
          </div>
          <RouterLink
            v-else
            to="/admin/login"
            class="hidden sm:flex items-center gap-1.5 text-xs text-accent font-semibold border border-accent hover:bg-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200"
            title="Halaman Login Admin"
          >
            <Lock :size="13" />
            <span>Login Admin</span>
          </RouterLink>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="lg:hidden w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            aria-label="Menu"
          >
            <X v-if="mobileOpen" :size="18" />
            <Menu v-else :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="mobileOpen"
      class="lg:hidden bg-white dark:bg-primary border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-1"
    >
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        @click="mobileOpen = false"
        class="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-accent"
      >
        {{ link.label }}
      </RouterLink>

      <!-- Admin Link on Mobile -->
      <div class="pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
        <RouterLink
          v-if="authStore.isAuthenticated()"
          to="/admin/dashboard"
          @click="mobileOpen = false"
          class="flex items-center gap-2 py-2 text-sm font-semibold text-accent"
        >
          <LayoutDashboard :size="16" />
          <span>Dashboard Admin</span>
        </RouterLink>
        <RouterLink
          v-else
          to="/admin/login"
          @click="mobileOpen = false"
          class="flex items-center gap-2 py-2 text-sm font-semibold text-accent"
        >
          <Lock :size="16" />
          <span>Login Admin</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
