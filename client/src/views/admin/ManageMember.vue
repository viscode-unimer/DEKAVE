<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { User } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const members = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const form = reactive({
  name: '',
  position: '',
  division: '',
  year: new Date().getFullYear(),
  instagram: '',
  isActive: true,
  photo: null,
});

const fetchMembers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/members');
    members.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editing.value = null;
  Object.assign(form, {
    name: '',
    position: '',
    division: '',
    year: new Date().getFullYear(),
    instagram: '',
    isActive: true,
    photo: null,
  });
  showForm.value = true;
};

const openEdit = (m) => {
  editing.value = m;
  Object.assign(form, {
    name: m.name,
    position: m.position,
    division: m.division,
    year: m.year,
    instagram: m.instagram || '',
    isActive: m.isActive,
    photo: null,
  });
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('position', form.position);
    fd.append('division', form.division);
    fd.append('year', form.year);
    fd.append('instagram', form.instagram);
    fd.append('isActive', form.isActive);
    if (form.photo) fd.append('photo', form.photo);

    if (editing.value) {
      await api.put(`/members/${editing.value._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Anggota diperbarui!');
    } else {
      await api.post('/members', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Anggota ditambahkan!');
    }
    showForm.value = false;
    fetchMembers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm(t('common.confirm_delete'))) return;
  try {
    await api.delete(`/members/${id}`);
    toast.success('Dihapus!');
    fetchMembers();
  } catch {
    toast.error('Gagal menghapus');
  }
};

onMounted(fetchMembers);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelola Anggota</h1>
      <button @click="openCreate" class="btn-accent">+ Tambah Anggota</button>
    </div>

    <!-- Create / Edit Form -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow mb-6">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-5">
        {{ editing ? 'Edit Anggota' : 'Anggota Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama *</label>
          <input v-model="form.name" required class="input-field" placeholder="Nama lengkap" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jabatan *</label>
          <input
            v-model="form.position"
            required
            class="input-field"
            placeholder="Ketua, Wakil, Sekretaris, Anggota..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Divisi *</label>
          <input
            v-model="form.division"
            required
            list="division-options"
            class="input-field"
            placeholder="Pilih atau ketik divisi..."
          />
          <datalist id="division-options">
            <option value="Desain" />
            <option value="Photography" />
            <option value="Videography" />
            <option value="Public Relation" />
            <option value="Badan Pengurus Harian" />
          </datalist>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Angkatan *</label>
          <input
            v-model.number="form.year"
            type="number"
            required
            class="input-field"
            placeholder="2024"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
          <input v-model="form.instagram" class="input-field" placeholder="@username" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Foto {{ editing ? '(kosongkan jika tidak ingin mengganti)' : '' }}
          </label>
          <input
            type="file"
            accept="image/*"
            @change="(e) => (form.photo = e.target.files[0])"
            class="input-field"
          />
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="form.isActive" id="mactive" class="w-4 h-4 accent-accent" />
          <label for="mactive" class="text-sm text-gray-700 dark:text-gray-300">Anggota aktif</label>
        </div>
        <div class="md:col-span-2 flex gap-3">
          <button type="submit" :disabled="saving" class="btn-accent disabled:opacity-60">
            {{ saving ? 'Menyimpan...' : t('common.save') }}
          </button>
          <button
            type="button"
            @click="showForm = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Member Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <LoadingSpinner v-if="loading" class="col-span-full" />
      <div
        v-for="m in members"
        :key="m._id"
        class="bg-white dark:bg-secondary rounded-2xl p-4 shadow text-center"
      >
        <div class="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2">
          <img v-if="m.photo" :src="m.photo" :alt="m.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <User :size="24" class="opacity-40" />
          </div>
        </div>
        <p class="font-semibold text-xs text-gray-900 dark:text-white truncate">{{ m.name }}</p>
        <p class="text-xs text-accent">{{ m.position }}</p>
        <p class="text-xs text-gray-400">{{ m.division }}</p>
        <div class="flex gap-1 mt-3">
          <button
            @click="openEdit(m)"
            class="flex-1 text-xs border border-blue-400 text-blue-400 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Edit
          </button>
          <button
            @click="handleDelete(m._id)"
            class="flex-1 text-xs border border-red-400 text-red-400 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
      <div
        v-if="!loading && members.length === 0"
        class="col-span-full text-center text-gray-400 py-12"
      >
        Belum ada anggota.
      </div>
    </div>
  </div>
</template>
