<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../stores/auth';
import { RouterLink } from 'vue-router';
import api from '../../utils/api';

const { t } = useI18n();
const auth = useAuthStore();

const isSuperadmin = computed(() => auth.user?.role === 'superadmin');

const stats = ref({
  portfolios: 0,
  events: 0,
  blogs: 0,
  members: 0,
  camavis: 0,
  pending: 0,
  contributors: 0,
});

onMounted(async () => {
  try {
    const promises = [
      api.get('/portfolios?limit=1'),
      api.get('/events?limit=1'),
      api.get('/blogs/admin/all'),
      api.get('/members'),
      api.get('/camavis'),
    ];

    if (isSuperadmin.value) {
      promises.push(api.get('/users'));
    }

    const [p, e, b, m, c, u] = await Promise.all(promises);

    stats.value = {
      portfolios: p.data.total || p.data.data?.length || 0,
      events: e.data.total || e.data.data?.length || 0,
      blogs: b.data.data?.length || 0,
      members: m.data.data?.length || 0,
      camavis: c.data.total || c.data.data?.length || 0,
      pending: c.data.data?.filter((x) => x.status === 'pending').length || 0,
      contributors: u?.data?.data?.filter((x) => x.role === 'contributor').length || 0,
    };
  } catch (err) {
    console.error(err);
  }
});

const cards = computed(() => {
  const base = [
    { key: 'portfolios', label: 'admin.total_portfolios', icon: '🎨', color: 'from-accent to-pink-700' },
    { key: 'events', label: 'admin.total_events', icon: '📅', color: 'from-blue-500 to-blue-700' },
    { key: 'blogs', label: 'admin.total_blogs', icon: '✍️', color: 'from-green-500 to-green-700' },
    { key: 'members', label: 'admin.total_members', icon: '👥', color: 'from-purple-500 to-purple-700' },
    { key: 'camavis', label: 'admin.total_camavis', icon: '🎓', color: 'from-yellow-400 to-yellow-600' },
    { key: 'pending', label: 'admin.pending_camavis', icon: '⏳', color: 'from-orange-400 to-orange-600' },
  ];

  return base;
});
</script>

<template>
  <div>
    <!-- Title & Role Badge -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('admin.dashboard') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ringkasan sistem dan status kegiatan UKM DKV Universitas Merangin.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          :class="isSuperadmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800'"
        >
          <span>{{ isSuperadmin ? '👑' : '✏️' }}</span>
          <span>{{ isSuperadmin ? 'Level: Superadmin' : 'Level: Contributor' }}</span>
        </span>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div
        v-for="card in cards"
        :key="card.key"
        :class="`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow`"
      >
        <div class="text-3xl mb-2">{{ card.icon }}</div>
        <div class="text-3xl font-bold font-heading">{{ stats[card.key] }}</div>
        <div class="text-xs opacity-80 mt-1">{{ t(card.label) }}</div>
      </div>
    </div>

    <!-- Welcome & Quick Action Card -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-secondary rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-700">
        <h2 class="font-heading text-lg font-bold text-gray-900 dark:text-white mb-2">
          Selamat datang, {{ auth.user?.username || 'Pengurus' }} 👋
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
          Anda login sebagai <strong class="text-accent">{{ isSuperadmin ? 'Superadmin' : 'Contributor' }}</strong>.
          {{ isSuperadmin 
              ? 'Anda memiliki wewenang penuh untuk mengatur akun Contributor, menyetujui pendaftaran CAMAVIS, dan mengelola seluruh portofolio serta publikasi DKV.'
              : 'Anda memiliki hak akses untuk menambahkan dan mengedit karya portofolio, kegiatan event, artikel blog, dan profil anggota DKV.'
          }}
        </p>

        <div v-if="isSuperadmin" class="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3">
          <RouterLink
            to="/admin/users"
            class="text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>🛡️</span>
            <span>Kelola Tim & Contributor ({{ stats.contributors }})</span>
          </RouterLink>
          <RouterLink
            to="/admin/camavis"
            class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>🎓</span>
            <span>Review CAMAVIS ({{ stats.pending }} Pending)</span>
          </RouterLink>
        </div>
      </div>

      <div class="bg-gradient-to-br from-secondary to-primary rounded-2xl p-6 text-white shadow border border-gray-800">
        <h3 class="font-heading text-base font-bold text-accent mb-2">Hierarki Hak Akses</h3>
        <ul class="text-xs space-y-3 text-gray-300">
          <li class="flex items-start gap-2">
            <span>👑</span>
            <div>
              <strong class="text-white block">Superadmin</strong>
              <span>Akses penuh + manajemen akun contributor</span>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span>✏️</span>
            <div>
              <strong class="text-white block">Contributor</strong>
              <span>Dibuat superadmin, mengelola konten</span>
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span>🌐</span>
            <div>
              <strong class="text-white block">User / Pengunjung</strong>
              <span>Tanpa login, registrasi CAMAVIS publik</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
