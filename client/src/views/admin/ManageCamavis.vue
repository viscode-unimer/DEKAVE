<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/formatDate';

const { t } = useI18n();
const toast = useToast();
const camavisList = ref([]);
const loading = ref(true);
const selected = ref(null);
const statusFilter = ref('');

const fetchCamavis = async () => {
  loading.value = true;
  try {
    const params = statusFilter.value ? `?status=${statusFilter.value}` : '';
    const res = await api.get(`/camavis${params}`);
    camavisList.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await api.patch(`/camavis/${id}/status`, { status });
    toast.success('Status diperbarui!');
    // Update locally
    const item = camavisList.value.find((c) => c._id === id);
    if (item) item.status = status;
    if (selected.value?._id === id) selected.value.status = status;
  } catch {
    toast.error('Gagal update status');
  }
};

const handleDelete = async (id) => {
  if (!confirm(t('common.confirm_delete'))) return;
  try {
    await api.delete(`/camavis/${id}`);
    toast.success('Data dihapus!');
    fetchCamavis();
    if (selected.value?._id === id) selected.value = null;
  } catch {
    toast.error('Gagal menghapus');
  }
};

const statusColor = (s) =>
  ({
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }[s] || 'bg-gray-100 text-gray-500');

onMounted(fetchCamavis);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelola CAMAVIS</h1>
      <select
        v-model="statusFilter"
        @change="fetchCamavis"
        class="input-field w-44 py-2 text-sm"
      >
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="accepted">Diterima</option>
        <option value="rejected">Ditolak</option>
      </select>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Table -->
      <div class="lg:col-span-2 bg-white dark:bg-secondary rounded-2xl shadow overflow-hidden">
        <LoadingSpinner v-if="loading" />
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Nama</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">NIM</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
                <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                v-for="c in camavisList"
                :key="c._id"
                @click="selected = c"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                :class="selected?._id === c._id ? 'bg-accent/5' : ''"
              >
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900 dark:text-white">{{ c.fullName }}</p>
                  <p class="text-xs text-gray-400">{{ c.instagram }}</p>
                </td>
                <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ c.nim }}</td>
                <td class="px-4 py-3">
                  <span :class="['px-2 py-1 rounded-full text-xs font-bold', statusColor(c.status)]">
                    {{ c.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">
                  {{ formatDateShort(c.submittedAt || c.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <button
                    @click.stop="handleDelete(c._id)"
                    class="text-red-500 hover:underline text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="camavisList.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-400">Belum ada pendaftar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail Panel -->
      <div>
        <div v-if="selected" class="bg-white dark:bg-secondary rounded-2xl shadow p-6">
          <h2 class="font-heading text-lg font-bold text-gray-900 dark:text-white mb-4">Detail Pendaftar</h2>
          <div class="space-y-3 text-sm">
            <div>
              <span class="text-gray-400">Nama Lengkap:</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selected.fullName }}</p>
            </div>
            <div>
              <span class="text-gray-400">Panggilan:</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selected.nickname }}</p>
            </div>
            <div>
              <span class="text-gray-400">NIM:</span>
              <code class="text-accent font-mono">{{ selected.nim }}</code>
            </div>
            <div>
              <span class="text-gray-400">Fakultas / Prodi:</span>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ selected.faculty }} / {{ selected.major }}
              </p>
            </div>
            <div>
              <span class="text-gray-400">Email:</span>
              <a :href="`mailto:${selected.email}`" class="text-accent block">{{ selected.email }}</a>
            </div>
            <div>
              <span class="text-gray-400">HP / WA:</span>
              <a :href="`tel:${selected.phone}`" class="text-accent block">{{ selected.phone }}</a>
            </div>
            <div>
              <span class="text-gray-400">Instagram:</span>
              <p class="text-gray-900 dark:text-white">{{ selected.instagram }}</p>
            </div>
            <div v-if="selected.portfolioLink">
              <span class="text-gray-400">Portfolio:</span>
              <a :href="selected.portfolioLink" target="_blank" class="text-accent break-all block">
                Lihat Portfolio ↗
              </a>
            </div>
            <div>
              <span class="text-gray-400">Motivasi:</span>
              <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-sm">
                {{ selected.motivation }}
              </p>
            </div>
          </div>

          <!-- Status Actions -->
          <div class="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
            <p class="text-xs text-gray-400 mb-3">Update Status:</p>
            <div class="flex gap-2">
              <button
                @click="updateStatus(selected._id, 'accepted')"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                ✓ Terima
              </button>
              <button
                @click="updateStatus(selected._id, 'rejected')"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                ✗ Tolak
              </button>
              <button
                @click="updateStatus(selected._id, 'pending')"
                class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
              >
                ⏳
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="bg-white dark:bg-secondary rounded-2xl shadow p-6 flex items-center justify-center text-gray-400 text-sm min-h-[200px]"
        >
          Klik baris untuk melihat detail
        </div>
      </div>
    </div>
  </div>
</template>
