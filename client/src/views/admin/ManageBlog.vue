<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import TiptapEditor from '../../components/blog/TiptapEditor.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/formatDate';

const { t } = useI18n();
const toast = useToast();
const blogs = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const form = reactive({
  title: '',
  content: '',
  author: '',
  tags: '',
  isPublished: false,
  thumbnail: null,
});

const fetchBlogs = async () => {
  loading.value = true;
  try {
    const res = await api.get('/blogs/admin/all');
    blogs.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editing.value = null;
  form.title = '';
  form.content = '';
  form.author = '';
  form.tags = '';
  form.isPublished = false;
  form.thumbnail = null;
  showForm.value = true;
};

const openEdit = async (blog) => {
  editing.value = blog;
  try {
    const res = await api.get(`/blogs/id/${blog._id}`);
    const b = res.data.data;
    form.title = b.title;
    form.content = b.content;
    form.author = b.author;
    form.tags = b.tags?.join(', ') || '';
    form.isPublished = b.isPublished;
    form.thumbnail = null;
  } catch {
    // fallback to list data
    form.title = blog.title;
    form.author = blog.author;
    form.tags = blog.tags?.join(', ') || '';
    form.isPublished = blog.isPublished;
    form.content = '';
    form.thumbnail = null;
  }
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('content', form.content);
    fd.append('author', form.author);
    fd.append('tags', form.tags);
    fd.append('isPublished', form.isPublished);
    if (form.thumbnail) fd.append('thumbnail', form.thumbnail);

    if (editing.value) {
      await api.put(`/blogs/${editing.value._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Blog diperbarui!');
    } else {
      await api.post('/blogs', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Blog dibuat!');
    }
    showForm.value = false;
    fetchBlogs();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm(t('common.confirm_delete'))) return;
  try {
    await api.delete(`/blogs/${id}`);
    toast.success('Blog dihapus!');
    fetchBlogs();
  } catch {
    toast.error('Gagal menghapus');
  }
};

onMounted(fetchBlogs);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelola Blog</h1>
      <button @click="openCreate" class="btn-accent">+ Artikel Baru</button>
    </div>

    <!-- Create / Edit Form -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow mb-6">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-6">
        {{ editing ? 'Edit Artikel' : 'Artikel Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul *</label>
            <input v-model="form.title" required class="input-field" placeholder="Judul artikel" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Penulis *</label>
            <input v-model="form.author" required class="input-field" placeholder="Nama penulis" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <input
              v-model="form.tags"
              class="input-field"
              placeholder="desain, tips, branding (pisah dengan koma)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              @change="(e) => (form.thumbnail = e.target.files[0])"
              class="input-field"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konten *</label>
          <TiptapEditor v-model="form.content" />
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" id="published" v-model="form.isPublished" class="w-4 h-4 accent-accent" />
          <label for="published" class="text-sm text-gray-700 dark:text-gray-300">Publikasikan artikel ini</label>
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

    <!-- Blog Table -->
    <div class="bg-white dark:bg-secondary rounded-2xl shadow overflow-hidden">
      <LoadingSpinner v-if="loading" />
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Judul</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Penulis</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Status</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Tanggal</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="blog in blogs"
            :key="blog._id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-xs truncate">
              {{ blog.title }}
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ blog.author }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-bold',
                  blog.isPublished
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                ]"
              >
                {{ blog.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDateShort(blog.createdAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  @click="openEdit(blog)"
                  class="text-blue-500 hover:underline text-xs font-medium"
                >
                  {{ t('common.edit') }}
                </button>
                <button
                  @click="handleDelete(blog._id)"
                  class="text-red-500 hover:underline text-xs font-medium"
                >
                  {{ t('common.delete') }}
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="blogs.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-400">Belum ada artikel.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
