<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDateShort } from '../utils/formatDate';
import { BookOpen, Sparkles, Tag, ArrowUpRight } from 'lucide-vue-next';

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
    <!-- Hero Header -->
    <section class="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 mb-6 backdrop-blur-md">
          <BookOpen :size="14" class="text-cyan-400" />
          <span>DKV EDITORIAL JOURNAL</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
          {{ t('blog.title') }}
        </h1>
        <p class="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('blog.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Blog Posts Grid -->
    <section class="py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="blog in blogs"
            :key="blog._id"
            :to="`/blog/${blog.slug}`"
            class="group glass-card rounded-2xl overflow-hidden border border-white/[0.08] hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div class="aspect-video bg-slate-900 overflow-hidden relative">
              <img
                v-if="blog.thumbnail"
                :src="blog.thumbnail"
                :alt="blog.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                <BookOpen :size="40" class="opacity-40" />
              </div>

              <!-- Arrow -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowUpRight :size="16" />
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="tag in blog.tags?.slice(0, 3)"
                    :key="tag"
                    class="text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-cyan-300 px-2.5 py-0.5 rounded-full"
                  >
                    #{{ tag }}
                  </span>
                </div>
                <h3 class="font-heading text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {{ blog.title }}
                </h3>
                <p class="text-xs font-mono text-gray-400">
                  {{ t('blog.by') }} {{ blog.author }} &bull; {{ formatDateShort(blog.createdAt) }}
                </p>
              </div>

              <div class="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span class="text-xs font-mono text-cyan-400 font-semibold group-hover:underline">
                  {{ t('blog.read_more') }} &rarr;
                </span>
              </div>
            </div>
          </RouterLink>

          <div v-if="blogs.length === 0" class="col-span-full text-center text-gray-400 py-16">
            <BookOpen :size="48" class="mx-auto mb-3 opacity-30 text-cyan-400" />
            <p class="text-lg font-medium">{{ t('blog.no_data') }}</p>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
