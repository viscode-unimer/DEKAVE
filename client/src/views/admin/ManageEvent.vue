<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/formatDate';

const { t } = useI18n();
const toast = useToast();
const events = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const types = ['Workshop', 'Kompetisi', 'Pameran', 'Seminar', 'Webinar', 'Lainnya'];

const form = reactive({
  title: '',
  description: '',
  type: 'Workshop',
  date: '',
  location: '',
  isActive: true,
  poster: null,
});

const fetchEvents = async () => {
  loading.value = true;
  try {
    const res = await api.get('/events');
    events.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editing.value = null;
  Object.assign(form, {
    title: '',
    description: '',
    type: 'Workshop',
    date: '',
    location: '',
    isActive: true,
    poster: null,
  });
  showForm.value = true;
};

const openEdit = (ev) => {
  editing.value = ev;
  Object.assign(form, {
    title: ev.title,
    description: ev.description,
    type: ev.type,
    date: ev.date ? ev.date.split('T')[0] : '',
    location: ev.location,
    isActive: ev.isActive,
    poster: null,
  });
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('type', form.type);
    fd.append('date', form.date);
    fd.append('location', form.location);
    fd.append('isActive', form.isActive);
    if (form.poster) fd.append('poster', form.poster);

    if (editing.value) {
      await api.put(`/events/${editing.value._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Event diperbarui!');
    } else {
      await api.post('/events', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Event ditambahkan!');
    }
    showForm.value = false;
    fetchEvents();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm(t('common.confirm_delete'))) return;
  try {
    await api.delete(`/events/${id}`);
    toast.success('Dihapus!');
    fetchEvents();
  } catch {
    toast.error('Gagal menghapus');
  }
};

onMounted(fetchEvents);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelola Event</h1>
      <button @click="openCreate" class="btn-accent">+ Event Baru</button>
    </div>

    <!-- Create / Edit Form -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow mb-6">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-5">
        {{ editing ? 'Edit Event' : 'Event Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul *</label>
            <input v-model="form.title" required class="input-field" placeholder="Judul event" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe *</label>
            <select v-model="form.type" class="input-field">
              <option v-for="tp in types" :key="tp" :value="tp">{{ tp }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal *</label>
            <input v-model="form.date" type="date" required class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi *</label>
            <input v-model="form.location" required class="input-field" placeholder="Nama tempat" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Poster {{ editing ? '(kosongkan jika tidak ingin mengganti)' : '' }}
            </label>
            <input
              type="file"
              accept="image/*"
              @change="(e) => (form.poster = e.target.files[0])"
              class="input-field"
            />
          </div>
          <div class="flex items-center gap-2 pt-6">
            <input type="checkbox" v-model="form.isActive" id="active" class="w-4 h-4 accent-accent" />
            <label for="active" class="text-sm text-gray-700 dark:text-gray-300">Event aktif</label>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi *</label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="input-field resize-none"
              placeholder="Deskripsi event..."
            />
          </div>
        </div>
        <div class="flex gap-3">
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

    <!-- Event Table -->
    <div class="bg-white dark:bg-secondary rounded-2xl shadow overflow-hidden">
      <LoadingSpinner v-if="loading" />
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Judul</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Tipe</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Lokasi</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="ev in events"
            :key="ev._id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs truncate">
              {{ ev.title }}
            </td>
            <td class="px-4 py-3">
              <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                {{ ev.type }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDateShort(ev.date) }}</td>
            <td class="px-4 py-3 text-gray-500 max-w-xs truncate">{{ ev.location }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="openEdit(ev)" class="text-blue-500 text-xs hover:underline font-medium">
                  Edit
                </button>
                <button @click="handleDelete(ev._id)" class="text-red-500 text-xs hover:underline font-medium">
                  Hapus
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="events.length === 0">
            <td colspan="5" class="text-center py-8 text-gray-400">Belum ada event.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
