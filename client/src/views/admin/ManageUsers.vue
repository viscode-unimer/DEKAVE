<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../stores/auth';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/formatDate';
import { Plus, ShieldCheck, PenTool } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const auth = useAuthStore();

const users = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const form = reactive({
  username: '',
  email: '',
  password: '',
  role: 'contributor',
});

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

const openCreate = () => {
  editing.value = null;
  form.username = '';
  form.email = '';
  form.password = '';
  form.role = 'contributor';
  showForm.value = true;
};

const openEdit = (u) => {
  editing.value = u;
  form.username = u.username;
  form.email = u.email;
  form.password = ''; // Blank = do not change
  form.role = u.role;
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const payload = {
      username: form.username,
      email: form.email,
      role: form.role,
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
      toast.success(`Akun Contributor ${form.username} berhasil dibuat!`);
    }
    showForm.value = false;
    fetchUsers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
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
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">
          Kelola Tim & Contributor
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Superadmin dapat membuat dan mengatur hak akses akun Contributor untuk mengelola konten website.
        </p>
      </div>
      <button @click="openCreate" class="btn-accent flex items-center gap-2 self-start sm:self-auto">
        <Plus :size="16" />
        <span>Tambah Contributor</span>
      </button>
    </div>

    <!-- Role Info Card -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 rounded-2xl p-4 flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
          <ShieldCheck :size="20" />
        </div>
        <div class="text-xs">
          <strong class="text-purple-900 dark:text-purple-200 block text-sm mb-1">Superadmin (Tingkat Tertinggi)</strong>
          <span class="text-purple-700 dark:text-purple-300">
            Akses tak terbatas: Bisa mengelola seluruh konten, menyetujui/menolak CAMAVIS, dan menambah atau menghapus akun Contributor.
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
            Akun dibuat oleh Superadmin: Dapat menambahkan/mengedit portfolio, event, artikel blog, dan data anggota. Tidak bisa mengelola akun pengurus.
          </span>
        </div>
      </div>
    </div>

    <!-- Form Create / Edit Modal -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-6">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-4">
        {{ editing ? `Edit Akun: ${editing.username}` : 'Buat Akun Contributor Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap / Username *
            </label>
            <input
              v-model="form.username"
              type="text"
              required
              class="input-field"
              placeholder="Contoh: Rian Pratama (Div. Media)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="contributor@dkv.id"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password {{ editing ? '(Kosongkan jika tidak ingin mengubah)' : '*' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!editing"
              class="input-field"
              placeholder="Min. 6 karakter"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Peran / Role *
            </label>
            <select v-model="form.role" class="input-field">
              <option value="contributor">Contributor (Pengelola Konten)</option>
              <option value="superadmin">Superadmin (Akses Penuh)</option>
            </select>
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

    <!-- Users Table -->
    <div class="bg-white dark:bg-secondary rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
      <LoadingSpinner v-if="loading" />
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th class="text-left px-5 py-3 text-gray-600 dark:text-gray-300 font-semibold">Pengguna</th>
            <th class="text-left px-5 py-3 text-gray-600 dark:text-gray-300 font-semibold">Email</th>
            <th class="text-left px-5 py-3 text-gray-600 dark:text-gray-300 font-semibold">Peran (Role)</th>
            <th class="text-left px-5 py-3 text-gray-600 dark:text-gray-300 font-semibold">Terdaftar</th>
            <th class="text-left px-5 py-3 text-gray-600 dark:text-gray-300 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr v-for="u in users" :key="u._id" class="hover:bg-gray-50 dark:hover:bg-gray-700/40">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  :class="u.role === 'superadmin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'"
                >
                  {{ u.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>{{ u.username }}</span>
                    <span v-if="u._id === auth.user?.id" class="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold">
                      Anda
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-5 py-3.5 text-gray-600 dark:text-gray-300 font-mono text-xs">
              {{ u.email }}
            </td>
            <td class="px-5 py-3.5">
              <span
                v-if="u.role === 'superadmin'"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              >
                <ShieldCheck :size="12" />
                <span>Superadmin</span>
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                <PenTool :size="12" />
                <span>Contributor</span>
              </span>
            </td>
            <td class="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
              {{ formatDateShort(u.createdAt) }}
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <button
                  @click="openEdit(u)"
                  class="text-blue-500 hover:text-blue-600 hover:underline text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  v-if="u._id !== auth.user?.id"
                  @click="handleDelete(u)"
                  class="text-red-500 hover:text-red-600 hover:underline text-xs font-semibold"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="5" class="px-5 py-8 text-center text-gray-400">
              Belum ada data pengguna.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
