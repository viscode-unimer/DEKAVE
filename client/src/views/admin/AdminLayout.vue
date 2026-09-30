<script setup>
import { ref, computed } from 'vue';
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
} from 'lucide-vue-next';

const { t } = useI18n();
const auth = useAuthStore();
const themeStore = useThemeStore();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(true);

const isSuperadmin = computed(() => auth.user?.role === 'superadmin');

const navItems = computed(() => {
  const base = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/portfolio', label: 'Portfolio', icon: Palette },
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
    <!-- Sidebar -->
    <aside
      :class="[
        'flex-shrink-0 bg-secondary text-white transition-all duration-300 relative flex flex-col',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <!-- Logo / Toggle -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700 min-h-[64px]">
        <div v-if="sidebarOpen" class="flex items-center gap-2">
          <span class="font-heading text-xl font-bold text-accent tracking-wider">DKV</span>
          <span class="text-[10px] bg-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full uppercase">
            {{ auth.user?.role || 'Admin' }}
          </span>
          <span class="text-[10px] text-gray-400 font-mono">v0.6</span>
        </div>
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
      <header class="bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between min-h-[64px]">
        <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white">
          {{ route.meta.title }}
        </h2>
        <div class="flex items-center gap-3">
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
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-accent border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <span>Lihat Website</span>
            <ExternalLink :size="12" />
          </RouterLink>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-primary">
        <RouterView />
      </main>
    </div>
  </div>
</template>
