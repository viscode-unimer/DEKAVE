<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { ArrowLeft, Tag, User, Calendar, BookOpen, Share2 } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import { getBlogBySlug } from '../data/defaultBlogs';

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const blog = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const slug = route.params.slug;
    const res = await api.get(`/blogs/${slug}`);
    const apiBlog = res.data?.data;
    const def = getBlogBySlug(slug) || defaultBlogs.find(d => d.title?.toLowerCase() === apiBlog?.title?.toLowerCase());

    if (apiBlog && apiBlog.content && apiBlog.content.trim().length > 10) {
      blog.value = {
        ...apiBlog,
        division: apiBlog.division || def?.division || '',
      };
    } else if (def) {
      blog.value = def;
    } else {
      blog.value = apiBlog;
    }
  } catch (e) {
    blog.value = getBlogBySlug(route.params.slug);
  } finally {
    loading.value = false;
  }
});

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: blog.value?.title || 'DKV Journal',
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link artikel disalin ke clipboard!');
  }
};
</script>

<template>
  <PublicLayout>
    <div class="relative pt-36 pb-20 md:pt-40 md:pb-24 min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <RouterLink
            to="/blog"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-sky-500/40 dark:hover:border-cyan-400/40 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft :size="14" />
            <span>{{ t('common.back') }} ke Journal</span>
          </RouterLink>

          <button
            v-if="blog"
            @click="handleShare"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-slate-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-cyan-400 bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] transition-colors"
          >
            <Share2 :size="13" />
            <span>Bagikan</span>
          </button>
        </div>

        <LoadingSpinner v-if="loading" />

        <article v-else-if="blog" class="glass-card rounded-3xl p-6 sm:p-12 border border-slate-200/80 dark:border-white/10 space-y-8">
          <!-- Thumbnail Header -->
          <div class="rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.05] relative">
            <img
              v-if="blog.thumbnail"
              :src="blog.thumbnail"
              :alt="blog.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
              <BookOpen :size="48" class="opacity-30" />
            </div>

            <!-- Division / Story Pill -->
            <div class="absolute top-4 left-4">
              <span
                v-if="blog.tags?.some(t => t.toLowerCase().includes('cerita')) || blog.slug?.includes('cerita')"
                class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-pink-500 text-white shadow-lg backdrop-blur-md"
              >
                📖 Cerita & Catatan Humas
              </span>
              <span
                v-else-if="blog.division"
                class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-lg backdrop-blur-md"
              >
                Divisi {{ blog.division }}
              </span>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in blog.tags"
              :key="tag"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-sky-500/10 dark:bg-cyan-500/10 border border-sky-500/30 dark:border-cyan-400/30 text-sky-700 dark:text-cyan-300"
            >
              <Tag :size="11" />
              #{{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="font-heading text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            {{ blog.title }}
          </h1>

          <!-- Meta Author & Date -->
          <div class="flex flex-wrap items-center gap-6 pb-6 border-b border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-500 dark:text-gray-400">
            <span class="flex items-center gap-2">
              <User :size="14" class="text-sky-600 dark:text-cyan-400" />
              <strong class="text-slate-900 dark:text-white">{{ blog.author }}</strong>
            </span>
            <span class="flex items-center gap-2">
              <Calendar :size="14" class="text-sky-600 dark:text-sky" />
              <span>{{ formatDate(blog.createdAt) }}</span>
            </span>
          </div>

          <!-- HTML Content -->
          <div
            class="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg prose-headings:font-heading prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-sky-600 dark:prose-a:text-cyan-400 prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-500/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-img:rounded-2xl"
            v-html="blog.content"
          />

          <!-- Footer Author Card -->
          <div class="pt-8 mt-12 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-sky-500/10 dark:bg-cyan-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-cyan-400 font-bold">
                DKV
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ blog.author }}</p>
                <p class="text-xs text-slate-500 dark:text-gray-400 font-mono">UKM DKV Universitas Merangin</p>
              </div>
            </div>

            <RouterLink
              to="/blog"
              class="text-xs font-mono text-sky-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Lihat Artikel Lainnya &rarr;
            </RouterLink>
          </div>
        </article>

        <div v-else class="text-center text-slate-500 dark:text-gray-400 py-20 glass-card rounded-3xl p-8">
          <BookOpen :size="48" class="mx-auto mb-3 opacity-30 text-sky-600 dark:text-cyan-400" />
          <p class="text-lg font-medium">Artikel tidak ditemukan.</p>
          <RouterLink to="/blog" class="btn-accent inline-block mt-4 text-xs font-semibold px-5 py-2.5 rounded-full">
            Kembali ke Semua Artikel
          </RouterLink>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
