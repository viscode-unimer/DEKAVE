<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';

const { t } = useI18n();
const toast = useToast();
const portfolios = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const categories = ['Branding', 'Illustration', 'UI/UX', 'Photography', 'Motion'];

const form = reactive({
  title: '',
  description: '',
  category: 'Branding',
  creator: '',
  tags: '',
  isFeatured: false,
  images: null,
});

const fetchPortfolios = async () => {
  loading.value = true;
  try {
    const res = await api.get('/portfolios');
    portfolios.value = res.data.data;
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
    category: 'Branding',
    creator: '',
    tags: '',
    isFeatured: false,
    images: null,
  });
  showForm.value = true;
};

const openEdit = (item) => {
  editing.value = item;
  Object.assign(form, {
    title: item.title,
    description: item.description,
    category: item.category,
    creator: item.creator,
    tags: item.tags?.join(', ') || '',
    isFeatured: item.isFeatured,
    images: null,
  });
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('creator', form.creator);
    fd.append('tags', form.tags);
    fd.append('isFeatured', form.isFeatured);
    if (form.images) {
      Array.from(form.images).forEach((f) => fd.append('images', f));
    }

    if (editing.value) {
      await api.put(`/portfolios/${editing.value._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Portfolio diperbarui!');
    } else {
      await api.post('/portfolios', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Portfolio ditambahkan!');
    }
    showForm.value = false;
    fetchPortfolios();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm(t('common.confirm_delete'))) return;
  try {
    await api.delete(`/portfolios/${id}`);
    toast.success('Dihapus!');
    fetchPortfolios();
  } catch {
    toast.error('Gagal menghapus');
  }
};

onMounted(fetchPortfolios);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelola Portfolio</h1>
      <button @click="openCreate" class="btn-accent">+ Tambah Portfolio</button>
    </div>

    <!-- Create / Edit Form -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow mb-6">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-5">
        {{ editing ? 'Edit Portfolio' : 'Portfolio Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul *</label>
            <input v-model="form.title" required class="input-field" placeholder="Judul portfolio" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pembuat *</label>
            <input v-model="form.creator" required class="input-field" placeholder="Nama pembuat" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
            <select v-model="form.category" class="input-field">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <input
              v-model="form.tags"
              class="input-field"
              placeholder="desain, branding (pisah dengan koma)"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gambar {{ editing ? '(biarkan kosong jika tidak ingin mengganti)' : '*' }}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              @change="(e) => (form.images = e.target.files)"
              class="input-field"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi *</label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="input-field resize-none"
              placeholder="Deskripsi portfolio..."
            />
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="form.isFeatured" id="feat" class="w-4 h-4 accent-accent" />
            <label for="feat" class="text-sm text-gray-700 dark:text-gray-300">
              Tampilkan sebagai Featured di halaman utama
            </label>
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

    <!-- Portfolio Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <LoadingSpinner v-if="loading" class="col-span-full" />
      <div
        v-for="item in portfolios"
        :key="item._id"
        class="bg-white dark:bg-secondary rounded-2xl overflow-hidden shadow"
      >
        <div class="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            v-if="item.images?.[0]"
            :src="item.images[0]"
            :alt="item.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎨</div>
        </div>
        <div class="p-3">
          <span class="text-xs text-accent font-bold uppercase">{{ item.category }}</span>
          <p class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ item.title }}</p>
          <p class="text-xs text-gray-400">{{ item.creator }}</p>
          <span v-if="item.isFeatured" class="text-xs text-gold font-semibold">★ Featured</span>
          <div class="flex gap-2 mt-3">
            <button
              @click="openEdit(item)"
              class="flex-1 text-xs border border-blue-400 text-blue-400 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Edit
            </button>
            <button
              @click="handleDelete(item._id)"
              class="flex-1 text-xs border border-red-400 text-red-400 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="!loading && portfolios.length === 0"
        class="col-span-full text-center text-gray-400 py-12"
      >
        Belum ada portfolio. Klik "+ Tambah Portfolio" untuk mulai.
      </div>
    </div>
  </div>
</template>
