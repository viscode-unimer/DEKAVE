<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../stores/auth';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/formatDate';
import {
  Plus,
  ShieldCheck,
  PenTool,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  X,
  AlertCircle,
  UserCheck,
  UserX,
} from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const auth = useAuthStore();

const users = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const actionLoading = ref({});

const filterStatus = ref('all'); // 'all' | 'pending' | 'active' | 'rejected'

const form = reactive({
  username: '',
  fullName: '',
  email: '',
  password: '',
  role: 'contributor',
  status: 'active',
  division: 'Desain',
  notes: '',
});

const divisions = [
  'Desain',
  'Photography',
  'Videography',
  'Public Relation',
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/users');
    users.value = res.data.data;
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gagal memuat daftar pengguna');
  } finally {
    loading.value = false;
  }
};

const pendingUsers = computed(() => {
  return users.value.filter((u) => u.status === 'pending');
});

const filteredUsers = computed(() => {
  if (filterStatus.value === 'all') return users.value;
  if (filterStatus.value === 'active') {
    return users.value.filter((u) => !u.status || u.status === 'active');
  }
  return users.value.filter((u) => u.status === filterStatus.value);
});

const openCreate = () => {
  editing.value = null;
  form.username = '';
  form.fullName = '';
  form.email = '';
  form.password = '';
  form.role = 'contributor';
  form.status = 'active';
  form.division = 'Desain';
  form.notes = '';
  showForm.value = true;
};

const openEdit = (u) => {
  editing.value = u;
  form.username = u.username;
  form.fullName = u.fullName || '';
  form.email = u.email;
  form.password = ''; // Blank = do not change
  form.role = u.role;
  form.status = u.status || 'active';
  form.division = u.role === 'superadmin' ? '' : (u.division || 'Desain');
  form.notes = u.notes || '';
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const rawUsername = form.username;
    if (/\s/.test(rawUsername)) {
      toast.error('Username tidak boleh menggunakan spasi! Hanya boleh menggunakan simbol underscore (_)');
      saving.value = false;
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(rawUsername.trim())) {
      toast.error('Username hanya boleh menggunakan kombinasi huruf, angka, dan simbol underscore (_)');
      saving.value = false;
      return;
    }

    if (rawUsername.trim().length < 3) {
      toast.error('Username minimal 3 karakter');
      saving.value = false;
      return;
    }

    const isSuper = form.role === 'superadmin';
    const payload = {
      username: rawUsername.trim().toLowerCase(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
      division: isSuper ? '' : (form.division || 'Desain'),
      notes: form.notes.trim(),
    };
    if (form.password) {
      payload.password = form.password;
    }

    if (editing.value) {
      await api.put(`/users/${editing.value._id}`, payload);
      toast.success(`Akun ${form.username} berhasil diperbarui!`);
    } else {
      if (!form.password) {
        toast.error('Password wajib diisi untuk akun baru');
        saving.value = false;
        return;
      }
      await api.post('/users', payload);
      toast.success(`Akun ${form.role} (${form.username}) berhasil dibuat!`);
    }
    showForm.value = false;
    fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
  }
};

// Superadmin Approval (ACC)
const handleApprove = async (u) => {
  actionLoading.value[u._id] = true;
  try {
    await api.patch(`/users/${u._id}/status`, { status: 'active' });
    toast.success(`Akun @${u.username} berhasil di-ACC (Disetujui)! Pengguna sekarang dapat login.`);
    await fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gagal menyetujui akun');
  } finally {
    actionLoading.value[u._id] = false;
  }
};

// Superadmin Reject
const handleReject = async (u) => {
  if (!confirm(`Tolak pendaftaran kontributor @${u.username}?`)) {
    return;
  }
  actionLoading.value[u._id] = true;
  try {
    await api.patch(`/users/${u._id}/status`, { status: 'rejected' });
    toast.info(`Akun @${u.username} ditolak.`);
    await fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gagal menolak akun');
  } finally {
    actionLoading.value[u._id] = false;
  }
};

const handleDelete = async (u) => {
  if (u._id === auth.user?.id) {
    toast.error('Anda tidak dapat menghapus akun Anda sendiri');
    return;
  }
  if (!confirm(`Hapus akun ${u.username} (${u.role})? Tindakan ini tidak dapat dibatalkan.`)) {
    return;
  }

  try {
    await api.delete(`/users/${u._id}`);
    toast.success('Akun berhasil dihapus');
    fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Gagal menghapus akun');
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <span>Kelola Tim & Contributor</span>
          <span
            v-if="pendingUsers.length > 0"
            class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
          >
            {{ pendingUsers.length }} Menunggu ACC
          </span>
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Superadmin dapat menyetujui (ACC) pendaftaran kontributor, membuat akun baru, dan mengatur hak akses pengelola konten.
        </p>
      </div>
      <button @click="openCreate" class="btn-accent flex items-center gap-2 self-start sm:self-auto">
        <Plus :size="16" />
        <span>Tambah Akun Baru</span>
      </button>
    </div>

    <!-- PENDING APPROVALS NOTICE CARD (Shown if there are pending registrations) -->
    <div
      v-if="pendingUsers.length > 0"
      class="bg-amber-500/10 border-2 border-amber-500/30 dark:border-amber-400/25 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-lg shadow-amber-500/5"
    >
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
            <Clock :size="18" class="animate-pulse" />
          </div>
          <div>
            <h2 class="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <span>Permohonan Akun Kontributor Baru</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500 text-slate-900">
                {{ pendingUsers.length }} Menunggu ACC
              </span>
            </h2>
            <p class="text-xs text-gray-600 dark:text-gray-300">
              Calon kontributor telah mendaftar mandiri via halaman login dan menunggu persetujuan Anda agar akun aktif.
            </p>
          </div>
        </div>
      </div>

      <!-- Pending Users Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div
          v-for="pu in pendingUsers"
          :key="pu._id"
          class="bg-white dark:bg-secondary/90 p-4 rounded-2xl border border-amber-500/30 dark:border-amber-400/20 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 class="font-bold text-sm text-gray-900 dark:text-white">
                  {{ pu.fullName || pu.username }}
                </h3>
                <span class="text-xs font-mono text-sky-600 dark:text-cyan-400 font-semibold block">
                  @{{ pu.username }}
                </span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                PENDING
              </span>
            </div>

            <div class="text-xs space-y-1 text-gray-600 dark:text-gray-300 font-mono mb-3">
              <p class="truncate">✉️ {{ pu.email }}</p>
              <p>🎨 Divisi {{ pu.division || 'Desain' }}</p>
              <p v-if="pu.notes" class="text-[11px] text-gray-500 italic font-sans bg-gray-50 dark:bg-black/20 p-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                "{{ pu.notes }}"
              </p>
              <p class="text-[10px] text-gray-400">📅 {{ formatDateShort(pu.createdAt) }}</p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
            <button
              @click="handleApprove(pu)"
              :disabled="actionLoading[pu._id]"
              class="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
            >
              <Check :size="14" />
              <span>Setujui (ACC)</span>
            </button>
            <button
              @click="handleReject(pu)"
              :disabled="actionLoading[pu._id]"
              class="py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold font-mono transition-colors disabled:opacity-50"
              title="Tolak Permohonan"
            >
              <X :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Explanation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 rounded-2xl p-4 flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
          <ShieldCheck :size="20" />
        </div>
        <div class="text-xs">
          <strong class="text-purple-900 dark:text-purple-200 block text-sm mb-1">Superadmin (Tingkat Tertinggi)</strong>
          <span class="text-purple-700 dark:text-purple-300">
            Akses tak terbatas: Bisa mengelola seluruh konten, menyetujui (ACC) kontributor baru, dan mengatur seluruh akun pengurus.
          </span>
        </div>
      </div>
      <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-2xl p-4 flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
          <PenTool :size="20" />
        </div>
        <div class="text-xs">
          <strong class="text-blue-900 dark:text-blue-200 block text-sm mb-1">Contributor (Pengelola Konten)</strong>
          <span class="text-blue-700 dark:text-blue-300">
            Dapat mendaftar mandiri via login atau dibuatkan: Dapat mengelola portfolio, event, artikel blog, dan data anggota.
          </span>
        </div>
      </div>
    </div>

    <!-- Form Create / Edit Modal -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-4">
        {{ editing ? `Edit Akun: @${editing.username}` : 'Buat Akun Pengguna / Contributor Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Username *
            </label>
            <input
              v-model="form.username"
              @keydown.space.prevent
              type="text"
              required
              class="input-field text-sm font-mono"
              placeholder="nama_pengguna"
            />
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono">
              * Hanya boleh huruf, angka, dan simbol underscore (<strong class="text-sky-600 dark:text-cyan-400 font-bold">_</strong>). Tanpa spasi.
            </p>
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap *
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="input-field text-sm"
              placeholder="Contoh: Rian Pratama"
            />
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field text-sm"
              placeholder="contributor@dkv.id"
            />
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Password {{ editing ? '(Kosongkan jika tidak diubah)' : '*' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!editing"
              class="input-field text-sm"
              placeholder="Min. 6 karakter"
            />
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Peran (Role) *
            </label>
            <select v-model="form.role" class="input-field text-sm">
              <option value="contributor">Contributor (Pengelola Konten)</option>
              <option value="superadmin">Superadmin (Akses Penuh)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Status Akun *
            </label>
            <select v-model="form.status" class="input-field text-sm">
              <option value="active">Active (Disetujui / Aktif)</option>
              <option value="pending">Pending (Menunggu ACC)</option>
              <option value="rejected">Rejected (Ditolak)</option>
            </select>
          </div>

          <!-- Divisi field: Only visible/applicable for Contributor -->
          <div v-if="form.role === 'contributor'">
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Divisi Contributor *
            </label>
            <select v-model="form.division" class="input-field text-sm">
              <option v-for="d in divisions" :key="d" :value="d">
                Divisi {{ d }}
              </option>
            </select>
          </div>
          <div v-else>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
              Divisi
            </label>
            <div class="px-3.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <ShieldCheck :size="15" class="shrink-0 text-purple-600 dark:text-purple-400" />
              <span>Tidak Ada Divisi (Superadmin level tertinggi / Semua Hak Akses)</span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Catatan
            </label>
            <input
              v-model="form.notes"
              type="text"
              class="input-field text-sm"
              placeholder="Catatan pendaftar"
            />
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="submit" :disabled="saving" class="btn-accent disabled:opacity-60 flex items-center gap-2">
            <span v-if="saving">Menyimpan...</span>
            <span v-else>{{ editing ? 'Simpan Perubahan' : 'Buat Akun' }}</span>
          </button>
          <button
            type="button"
            @click="showForm = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Batal
          </button>
        </div>
      </form>
    </div>

    <!-- Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1">
      <button
        @click="filterStatus = 'all'"
        class="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all"
        :class="filterStatus === 'all'
          ? 'bg-sky-500/15 border-sky-500/40 text-sky-700 dark:text-cyan-300'
          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'"
      >
        Semua ({{ users.length }})
      </button>

      <button
        @click="filterStatus = 'pending'"
        class="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all flex items-center gap-1.5"
        :class="filterStatus === 'pending'
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        <span>Menunggu ACC ({{ pendingUsers.length }})</span>
      </button>

      <button
        @click="filterStatus = 'active'"
        class="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all"
        :class="filterStatus === 'active'
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'"
      >
        Aktif ({{ users.filter(u => !u.status || u.status === 'active').length }})
      </button>

      <button
        @click="filterStatus = 'rejected'"
        class="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all"
        :class="filterStatus === 'rejected'
          ? 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300'
          : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300'"
      >
        Ditolak ({{ users.filter(u => u.status === 'rejected').length }})
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-secondary rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
      <LoadingSpinner v-if="loading" />
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <tr>
              <th class="text-left px-5 py-3 font-semibold">Pengguna</th>
              <th class="text-left px-5 py-3 font-semibold">Kontak</th>
              <th class="text-left px-5 py-3 font-semibold">Divisi</th>
              <th class="text-left px-5 py-3 font-semibold">Peran</th>
              <th class="text-left px-5 py-3 font-semibold">Status Akun</th>
              <th class="text-left px-5 py-3 font-semibold">Terdaftar</th>
              <th class="text-right px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="u in filteredUsers" :key="u._id" class="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
              <!-- Pengguna Column -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                    :class="u.role === 'superadmin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-sky-500 to-blue-600'"
                  >
                    {{ (u.fullName || u.username).charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span>{{ u.fullName || u.username }}</span>
                      <span v-if="u._id === auth.user?.id" class="text-[10px] bg-accent/20 text-accent px-1.5 py-0.2 rounded font-bold font-mono">
                        Anda
                      </span>
                    </div>
                    <span class="text-xs font-mono text-gray-400 block">@{{ u.username }}</span>
                  </div>
                </div>
              </td>

              <!-- Email Column -->
              <td class="px-5 py-3.5 text-gray-600 dark:text-gray-300 font-mono text-xs">
                {{ u.email }}
              </td>

              <!-- Divisi Column -->
              <td class="px-5 py-3.5 text-xs">
                <span
                  v-if="u.role === 'superadmin'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40 font-mono text-[11px] font-semibold"
                >
                  <ShieldCheck :size="11" />
                  <span>— (Level Superadmin)</span>
                </span>
                <span
                  v-else
                  class="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-gray-700 dark:text-gray-300 font-medium"
                >
                  {{ u.division ? `Divisi ${u.division}` : 'Divisi Desain' }}
                </span>
              </td>

              <!-- Role Column -->
              <td class="px-5 py-3.5">
                <span
                  v-if="u.role === 'superadmin'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                >
                  <ShieldCheck :size="12" />
                  <span>Superadmin</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  <PenTool :size="12" />
                  <span>Contributor</span>
                </span>
              </td>

              <!-- Status Column -->
              <td class="px-5 py-3.5">
                <span
                  v-if="u.status === 'pending'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse"
                >
                  <Clock :size="11" />
                  <span>Menunggu ACC</span>
                </span>
                <span
                  v-else-if="u.status === 'rejected'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                >
                  <XCircle :size="11" />
                  <span>Ditolak</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                >
                  <CheckCircle2 :size="11" />
                  <span>Aktif</span>
                </span>
              </td>

              <!-- Date Column -->
              <td class="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-mono">
                {{ formatDateShort(u.createdAt) }}
              </td>

              <!-- Action Column -->
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- Quick ACC Button if pending -->
                  <button
                    v-if="u.status === 'pending'"
                    @click="handleApprove(u)"
                    class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1"
                    title="Setujui dan Aktifkan Akun"
                  >
                    <Check :size="12" />
                    <span>ACC</span>
                  </button>

                  <button
                    v-if="u.status === 'pending'"
                    @click="handleReject(u)"
                    class="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold font-mono transition-colors"
                    title="Tolak Pendaftaran"
                  >
                    <X :size="12" />
                  </button>

                  <button
                    @click="openEdit(u)"
                    class="text-sky-600 dark:text-cyan-400 hover:underline text-xs font-semibold font-mono"
                  >
                    Edit
                  </button>

                  <button
                    v-if="u._id !== auth.user?.id"
                    @click="handleDelete(u)"
                    class="text-rose-500 hover:text-rose-600 hover:underline text-xs font-semibold font-mono"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="px-5 py-8 text-center text-gray-400 text-xs font-mono">
                Tidak ada data pengguna dalam filter ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
