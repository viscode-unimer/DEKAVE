<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDateShort } from '../utils/formatDate';
import { FileText } from 'lucide-vue-next';

const { t } = useI18n();
const blogs = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/blogs');
    blogs.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <PublicLayout>
    <section class="py-24 bg-gradient-to-br from-primary to-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('blog.title') }}</h1>
        <p class="text-gray-300 text-xl">{{ t('blog.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-white dark:bg-primary">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="blog in blogs"
            :key="blog._id"
            :to="`/blog/${blog.slug}`"
            class="group bg-gray-50 dark:bg-secondary rounded-2xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                v-if="blog.thumbnail"
                :src="blog.thumbnail"
                :alt="blog.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <FileText :size="40" class="opacity-40" />
              </div>
            </div>
            <div class="p-6">
              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  v-for="tag in blog.tags?.slice(0, 2)"
                  :key="tag"
                  class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                >
                  #{{ tag }}
                </span>
              </div>
              <h3 class="font-heading text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {{ blog.title }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ t('blog.by') }} {{ blog.author }} · {{ formatDateShort(blog.createdAt) }}
              </p>
              <span class="inline-block text-accent text-sm font-semibold mt-3">
                {{ t('blog.read_more') }} →
              </span>
            </div>
          </RouterLink>
          <div v-if="blogs.length === 0" class="col-span-full text-center text-gray-400 py-12">
            {{ t('blog.no_data') }}
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
