<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDateShort } from '../utils/formatDate';
import { BookOpen, ArrowUpRight } from 'lucide-vue-next';
import { defaultBlogs } from '../data/defaultBlogs';

const { t } = useI18n();
const blogs = ref([]);
const loading = ref(true);

const getExcerpt = (blog) => {
  if (blog.excerpt) return blog.excerpt;
  const match = defaultBlogs.find(d => 
    d.slug === blog.slug || 
    d.title.toLowerCase() === blog.title?.toLowerCase()
  );
  if (match?.excerpt) return match.excerpt;
  if (blog.content) {
    const text = blog.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.slice(0, 140) + '...';
  }
  return 'Eksplorasi wawasan, karya, dan dinamika kreatif dari UKM DKV Universitas Merangin.';
};

onMounted(async () => {
  try {
    const res = await api.get('/blogs');
    if (res.data?.data && res.data.data.length > 0) {
      const dbBlogs = res.data.data;
      const enriched = dbBlogs.map(b => {
        const found = defaultBlogs.find(d => 
          d.slug === b.slug || 
          d.title.toLowerCase() === b.title?.toLowerCase()
        );
        return {
          ...b,
          excerpt: b.excerpt || found?.excerpt || '',
        };
      });

      // Ensure all 6 articles are included
      for (const def of defaultBlogs) {
        if (!enriched.some(b => b.slug === def.slug || b.title.toLowerCase() === def.title.toLowerCase())) {
          enriched.unshift(def);
        }
      }

      blogs.value = enriched;
    } else {
      blogs.value = defaultBlogs;
    }
  } catch (e) {
    console.error('Error fetching blogs from API, using default blogs:', e);
    blogs.value = defaultBlogs;
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
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <BookOpen :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>DKV EDITORIAL JOURNAL & STORIES</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('blog.title') }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Kumpulan wawasan, perspektif berkarya 4 divisi utama, serta kisah inspiratif di balik layar UKM DKV Universitas Merangin.
        </p>
      </div>
    </section>

    <!-- Blog Posts Grid -->
    <section class="py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="flex flex-wrap justify-center gap-6">
          <RouterLink
            v-for="blog in blogs"
            :key="blog._id"
            :to="`/blog/${blog.slug}`"
            class="group glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] hover:border-sky-500/50 dark:hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
          >
            <div class="aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
              <img
                v-if="blog.thumbnail"
                :src="blog.thumbnail"
                :alt="blog.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-500">
                <BookOpen :size="40" class="opacity-40" />
              </div>

              <!-- Arrow Hover Indicator -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                <ArrowUpRight :size="16" />
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span
                    v-for="tag in blog.tags?.slice(0, 3)"
                    :key="tag"
                    class="text-[10px] font-mono uppercase tracking-wider bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-sky-700 dark:text-cyan-300 px-2.5 py-0.5 rounded-full"
                  >
                    #{{ tag }}
                  </span>
                </div>
                <h3 class="font-heading text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {{ blog.title }}
                </h3>
                <p class="text-xs font-mono text-slate-500 dark:text-gray-400">
                  {{ t('blog.by') }} {{ blog.author }} &bull; {{ formatDateShort(blog.createdAt) }}
                </p>

                <!-- Article Excerpt Preview -->
                <p class="text-xs sm:text-sm text-slate-600 dark:text-gray-300 line-clamp-3 mt-3 leading-relaxed font-light text-justify">
                  {{ getExcerpt(blog) }}
                </p>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <span class="text-xs font-mono text-sky-600 dark:text-cyan-400 font-semibold group-hover:underline">
                  {{ t('blog.read_more') }} &rarr;
                </span>
                <span class="text-[11px] font-mono text-slate-400 dark:text-gray-500">
                  DKV Journal
                </span>
              </div>
            </div>
          </RouterLink>

          <div v-if="blogs.length === 0" class="w-full text-center text-slate-500 dark:text-gray-400 py-16">
            <BookOpen :size="48" class="mx-auto mb-3 opacity-30 text-sky-600 dark:text-cyan-400" />
            <p class="text-lg font-medium">Belum ada artikel yang dipublikasikan.</p>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
