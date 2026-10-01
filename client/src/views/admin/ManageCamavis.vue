<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/formatDate';
import {
  Check,
  X,
  Clock,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Save,
  Instagram,
  Phone,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const camavisList = ref([]);
const loading = ref(true);
const selected = ref(null);
const statusFilter = ref('');

// Registration Settings State
const settingsLoading = ref(true);
const savingSettings = ref(false);
const showSettingsEditor = ref(false);
const settings = reactive({
  isOpen: false,
  period: 'Semester Depan',
  announcement:
    'Pendaftaran Calon Mahasiswa Viscode (CAMAVIS) saat ini telah ditutup. Kami akan membuka pendaftaran kembali pada semester depan. Pantau terus linimasa media sosial kami agar tidak ketinggalan jadwal seleksi gelombang selanjutnya!',
  whatsappNumber: '6282289456789',
  instagramHandle: 'dkv.unimer',
});

const fetchSettings = async () => {
  settingsLoading.value = true;
  try {
    const res = await api.get('/camavis/settings');
    if (res.data?.data) {
      Object.assign(settings, res.data.data);
    }
  } catch (e) {
    console.error('Error fetching CAMAVIS settings:', e);
  } finally {
    settingsLoading.value = false;
  }
};

const handleSaveSettings = async (showSuccessToast = true) => {
  savingSettings.value = true;
  try {
    const res = await api.put('/camavis/settings', settings);
    if (res.data?.data) {
      Object.assign(settings, res.data.data);
    }
    if (showSuccessToast) {
      toast.success(res.data?.message || 'Pengaturan pendaftaran berhasil disimpan!');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal menyimpan pengaturan');
  } finally {
    savingSettings.value = false;
  }
};

const toggleRegistrationStatus = async () => {
  settings.isOpen = !settings.isOpen;
  await handleSaveSettings(false);
  if (settings.isOpen) {
    toast.success('Pendaftaran CAMAVIS sekarang DIBUKA!');
  } else {
    toast.info('Pendaftaran CAMAVIS sekarang DITUTUP (Tampilan Pengumuman aktif).');
  }
};

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

onMounted(() => {
  fetchSettings();
  fetchCamavis();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header Title & Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Kelola CAMAVIS
        </h1>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Kontrol penerimaan anggota baru & tinjau pendaftar Calon Mahasiswa Viscode
        </p>
      </div>

      <div class="flex items-center gap-3">
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
    </div>

    <!-- OPSI 2: CONTROL CARD STATUS PENDAFTARAN CAMAVIS -->
    <div
      class="bg-white dark:bg-secondary rounded-2xl shadow-sm border overflow-hidden transition-all duration-300"
      :class="settings.isOpen
        ? 'border-emerald-500/30 dark:border-emerald-500/20'
        : 'border-rose-500/30 dark:border-rose-500/20'"
    >
      <div class="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r"
        :class="settings.isOpen
          ? 'from-emerald-500/[0.04] to-transparent'
          : 'from-rose-500/[0.04] to-transparent'"
      >
        <!-- Status Indicator -->
        <div class="flex items-start sm:items-center gap-3.5">
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="settings.isOpen
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'"
          >
            <Clock v-if="!settings.isOpen" :size="22" />
            <Check v-else :size="22" />
          </div>

          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                STATUS SISTEM PENDAFTARAN
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border"
                :class="settings.isOpen
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="settings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                {{ settings.isOpen ? 'DIBUKA' : 'DITUTUP' }}
              </span>
            </div>

            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ settings.isOpen
                ? 'Formulir pendaftaran aktif & siap menerima calon pendaftar.'
                : 'Pendaftaran ditutup. Halaman publik menampilkan pengumuman & link narahubung.'
              }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
              Periode: <strong class="text-gray-700 dark:text-gray-200">{{ settings.period }}</strong>
            </p>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <!-- Toggle Button -->
          <button
            @click="toggleRegistrationStatus"
            :disabled="savingSettings"
            class="px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border disabled:opacity-50"
            :class="settings.isOpen
              ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm shadow-emerald-600/20'"
          >
            <ToggleRight v-if="settings.isOpen" :size="16" />
            <ToggleLeft v-else :size="16" />
            <span>{{ settings.isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran' }}</span>
          </button>

          <!-- Toggle Settings Drawer -->
          <button
            @click="showSettingsEditor = !showSettingsEditor"
            class="px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1.5"
          >
            <SettingsIcon :size="14" />
            <span>Pengaturan Info</span>
            <ChevronUp v-if="showSettingsEditor" :size="14" />
            <ChevronDown v-else :size="14" />
          </button>
        </div>
      </div>

      <!-- Expandable Settings Form -->
      <div
        v-if="showSettingsEditor"
        class="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-black/10"
      >
        <h3 class="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>Kustomisasi Pengumuman Penutupan & Kontak Narahubung</span>
        </h3>

        <form @submit.prevent="handleSaveSettings(true)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                Periode Pembukaan Berikutnya
              </label>
              <input
                v-model="settings.period"
                type="text"
                required
                class="input-field text-sm"
                placeholder="Contoh: Semester Depan / Gelombang 2"
              />
            </div>

            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                No. WhatsApp Narahubung
              </label>
              <input
                v-model="settings.whatsappNumber"
                type="text"
                required
                class="input-field text-sm"
                placeholder="Contoh: 6282289456789"
              />
            </div>

            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                Username Instagram DKV
              </label>
              <input
                v-model="settings.instagramHandle"
                type="text"
                required
                class="input-field text-sm"
                placeholder="Contoh: dkv.unimer"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Pesan Pengumuman di Halaman Publik
            </label>
            <textarea
              v-model="settings.announcement"
              rows="3"
              required
              class="input-field text-sm resize-none"
              placeholder="Tuliskan pesan penutupan pendaftaran..."
            />
          </div>

          <div class="flex justify-end pt-1">
            <button
              type="submit"
              :disabled="savingSettings"
              class="btn-accent px-6 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
            >
              <Save :size="14" />
              <span>{{ savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Applicants Grid: Table + Detail Panel -->
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
                <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Divisi</th>
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
                  <p class="text-xs text-gray-400">@{{ (c.instagram || '').replace('@', '') }}</p>
                </td>
                <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ c.nim }}</td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs font-mono">
                  {{ c.division || '-' }}
                </td>
                <td class="px-4 py-3">
                  <span :class="['px-2 py-1 rounded-full text-xs font-bold font-mono', statusColor(c.status)]">
                    {{ c.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">
                  {{ formatDateShort(c.submittedAt || c.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <button
                    @click.stop="handleDelete(c._id)"
                    class="text-red-500 hover:underline text-xs font-mono"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="camavisList.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400 font-mono text-xs">
                  Belum ada pendaftar CAMAVIS.
                </td>
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
              <span class="text-gray-400 text-xs">Nama Lengkap:</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selected.fullName }}</p>
            </div>
            <div>
              <span class="text-gray-400 text-xs">Panggilan:</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ selected.nickname }}</p>
            </div>
            <div>
              <span class="text-gray-400 text-xs">NIM:</span>
              <code class="text-accent font-mono block mt-0.5">{{ selected.nim }}</code>
            </div>
            <div>
              <span class="text-gray-400 text-xs">Fakultas / Prodi:</span>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ selected.faculty }} / {{ selected.major }}
              </p>
            </div>
            <div>
              <span class="text-gray-400 text-xs">Pilihan Divisi:</span>
              <p class="font-semibold text-sky-600 dark:text-cyan-400 font-mono text-xs">
                Divisi {{ selected.division || '-' }}
              </p>
            </div>
            <div>
              <span class="text-gray-400 text-xs">Email:</span>
              <a :href="`mailto:${selected.email}`" class="text-accent block font-mono text-xs">{{ selected.email }}</a>
            </div>
            <div>
              <span class="text-gray-400 text-xs">HP / WhatsApp:</span>
              <a :href="`tel:${selected.phone}`" class="text-accent block font-mono text-xs">{{ selected.phone }}</a>
            </div>
            <div>
              <span class="text-gray-400 text-xs">Instagram:</span>
              <p class="text-gray-900 dark:text-white font-mono text-xs">{{ selected.instagram }}</p>
            </div>
            <div v-if="selected.portfolioLink">
              <span class="text-gray-400 text-xs">Portfolio:</span>
              <a :href="selected.portfolioLink" target="_blank" class="text-accent break-all block text-xs underline mt-0.5">
                Buka Link Portfolio ↗
              </a>
            </div>
            <div>
              <span class="text-gray-400 text-xs">Motivasi:</span>
              <p class="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed text-sm bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                {{ selected.motivation }}
              </p>
            </div>
          </div>

          <!-- Status Actions -->
          <div class="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
            <p class="text-xs text-gray-400 mb-3 font-mono">Tindak Lanjut Status:</p>
            <div class="flex gap-2">
              <button
                @click="updateStatus(selected._id, 'accepted')"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
              >
                <Check :size="14" />
                <span>Terima</span>
              </button>
              <button
                @click="updateStatus(selected._id, 'rejected')"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
              >
                <X :size="14" />
                <span>Tolak</span>
              </button>
              <button
                @click="updateStatus(selected._id, 'pending')"
                class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
                title="Kembalikan ke Pending"
              >
                <Clock :size="14" />
                <span>Pending</span>
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="bg-white dark:bg-secondary rounded-2xl shadow p-6 flex flex-col items-center justify-center text-gray-400 text-sm min-h-[220px] text-center"
        >
          <AlertCircle :size="28" class="opacity-40 mb-2" />
          <p>Pilih salah satu baris di tabel untuk melihat data lengkap pendaftar</p>
        </div>
      </div>
    </div>
  </div>
</template>
