<script setup>
import { ref, computed, watch } from 'vue';
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useThemeStore } from '../../stores/theme';
import { useI18n } from 'vue-i18n';
import {
  LayoutDashboard,
  Palette,
  Calendar,
  FileText,
  Users,
  GraduationCap,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Menu,
  X,
} from 'lucide-vue-next';

const { t } = useI18n();
const auth = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(true);
const mobileOpen = ref(false);

watch(() => route.path, () => {
  mobileOpen.value = false;
});

const isSuperadmin = computed(() => auth.user?.role === 'superadmin');

const navItems = computed(() => {
  const base = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/portfolio', label: 'Portofolio', icon: Palette },
    { to: '/admin/event', label: 'Event', icon: Calendar },
    { to: '/admin/blog', label: 'Blog', icon: FileText },
    { to: '/admin/member', label: 'Anggota', icon: Users },
    { to: '/admin/camavis', label: 'CAMAVIS', icon: GraduationCap },
  ];

  if (isSuperadmin.value) {
    base.push({ to: '/admin/users', label: 'Kelola Tim / Contributor', icon: ShieldCheck });
  }

  return base;
});

const handleLogout = () => {
  auth.logout();
  router.push('/admin/login');
};

const isActive = (path) => route.path.startsWith(path);
</script>

<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-primary">
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="mobileOpen"
      @click="mobileOpen = false"
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Mobile Slide-out Drawer Sidebar (lg:hidden) -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-secondary text-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Mobile Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700 min-h-[64px]">
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/logo-dkv-putih.png" alt="DKV" class="h-6 w-auto object-contain" />
          <span class="font-heading text-lg font-bold text-white tracking-wider">DKV</span>
          <span class="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full uppercase">
            {{ auth.user?.role || 'Admin' }}
          </span>
          <span class="text-[10px] text-gray-400 font-mono">v0.7</span>
        </RouterLink>
        <button
          @click="mobileOpen = false"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Tutup Menu"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Mobile Nav Items -->
      <nav class="p-3 space-y-1 flex-1 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          @click="mobileOpen = false"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-accent text-white font-semibold'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <component :is="item.icon" :size="18" class="flex-shrink-0" />
          <span class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Mobile Bottom: User Profile + Logout -->
      <div class="p-3 border-t border-gray-700">
        <div class="px-3 py-1 mb-2">
          <p class="text-xs font-semibold text-gray-200 truncate">
            {{ auth.user?.username }}
          </p>
          <p class="text-[11px] text-gray-400 truncate">
            {{ auth.user?.email }}
          </p>
          <span
            class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            :class="isSuperadmin ? 'bg-purple-900/60 text-purple-300' : 'bg-blue-900/60 text-blue-300'"
          >
            {{ isSuperadmin ? 'Superadmin' : 'Contributor' }}
          </span>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
        >
          <LogOut :size="18" class="flex-shrink-0" />
          <span>{{ t('admin.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Desktop Sidebar (hidden lg:flex - 100% untouched layout on desktop) -->
    <aside
      :class="[
        'hidden lg:flex flex-shrink-0 bg-secondary text-white transition-all duration-300 relative flex-col',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <!-- Logo / Toggle -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700 min-h-[64px]">
        <RouterLink to="/" v-if="sidebarOpen" class="flex items-center gap-2 group">
          <img src="/logo-dkv-putih.png" alt="DKV" class="h-6 w-auto object-contain group-hover:scale-105 transition-transform" />
          <span class="font-heading text-lg font-bold text-white tracking-wider group-hover:text-sky transition-colors">DKV</span>
          <span class="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full uppercase">
            {{ auth.user?.role || 'Admin' }}
          </span>
          <span class="text-[10px] text-gray-400 font-mono">v0.7</span>
        </RouterLink>
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="text-gray-400 hover:text-white p-1 ml-auto"
          :title="sidebarOpen ? 'Perkecil Sidebar' : 'Perluas Sidebar'"
        >
          {{ sidebarOpen ? '◀' : '▶' }}
        </button>
      </div>

      <!-- Nav Items -->
      <nav class="p-3 space-y-1 flex-1 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-accent text-white font-semibold'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <component :is="item.icon" :size="18" class="flex-shrink-0" />
          <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom: User Profile + Logout -->
      <div class="p-3 border-t border-gray-700">
        <div v-if="sidebarOpen" class="px-3 py-1 mb-2">
          <p class="text-xs font-semibold text-gray-200 truncate">
            {{ auth.user?.username }}
          </p>
          <p class="text-[11px] text-gray-400 truncate">
            {{ auth.user?.email }}
          </p>
          <span
            class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            :class="isSuperadmin ? 'bg-purple-900/60 text-purple-300' : 'bg-blue-900/60 text-blue-300'"
          >
            {{ isSuperadmin ? 'Superadmin' : 'Contributor' }}
          </span>
        </div>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
        >
          <LogOut :size="18" class="flex-shrink-0" />
          <span v-if="sidebarOpen">{{ t('admin.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between min-h-[64px] gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Mobile Hamburger Button -->
          <button
            @click="mobileOpen = true"
            class="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-gray-700 transition-colors flex-shrink-0"
            title="Buka Menu"
          >
            <Menu :size="18" />
          </button>
          <h2 class="font-heading text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {{ route.meta.title }}
          </h2>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            @click="themeStore.toggle"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:text-accent hover:border-accent transition-colors"
            title="Toggle Tema"
          >
            <Sun v-if="themeStore.isDark" :size="15" />
            <Moon v-else :size="15" />
          </button>
          <RouterLink
            to="/"
            target="_blank"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-accent border border-gray-300 dark:border-gray-600 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <span class="hidden sm:inline">Lihat Website</span>
            <span class="sm:hidden">Web</span>
            <ExternalLink :size="12" />
          </RouterLink>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-4 sm:p-6 bg-gray-100 dark:bg-primary">
        <RouterView />
      </main>
    </div>
  </div>
</template>
