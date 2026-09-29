<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { FileText } from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();
const blog = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get(`/blogs/${route.params.slug}`);
    blog.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <PublicLayout>
    <div class="pt-20 pb-16 bg-white dark:bg-primary min-h-screen">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterLink to="/blog" class="inline-flex items-center gap-2 text-accent hover:underline mb-8 mt-4">
          ← {{ t('common.back') }}
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <article v-else-if="blog">
          <div class="rounded-3xl overflow-hidden aspect-video bg-gray-100 dark:bg-secondary mb-8">
            <img
              v-if="blog.thumbnail"
              :src="blog.thumbnail"
              :alt="blog.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <FileText :size="64" class="opacity-40" />
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in blog.tags"
              :key="tag"
              class="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-semibold"
            >
              #{{ tag }}
            </span>
          </div>

          <h1 class="font-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {{ blog.title }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
            {{ t('blog.by') }}
            <strong class="text-gray-700 dark:text-gray-200">{{ blog.author }}</strong>
            · {{ formatDate(blog.createdAt) }}
          </p>

          <!-- TipTap rendered HTML content -->
          <div
            class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-accent"
            v-html="blog.content"
          />
        </article>

        <div v-else class="text-center text-gray-400 py-20">Artikel tidak ditemukan.</div>
      </div>
    </div>
  </PublicLayout>
</template>
