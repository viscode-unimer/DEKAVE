<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { ArrowLeft, Tag, User, Calendar } from 'lucide-vue-next';

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
    <div class="relative pt-36 pb-20 md:pt-40 md:pb-24 min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 mb-8"
        >
          <ArrowLeft :size="14" />
          <span>{{ t('common.back') }} to Journal</span>
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <article v-else-if="blog" class="glass-card rounded-3xl p-6 sm:p-12 border border-white/10 space-y-8">
          <div class="rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-white/[0.05]">
            <img
              v-if="blog.thumbnail"
              :src="blog.thumbnail"
              :alt="blog.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in blog.tags"
              :key="tag"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-400/30 text-cyan-300"
            >
              <Tag :size="11" />
              #{{ tag }}
            </span>
          </div>

          <h1 class="font-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
            {{ blog.title }}
          </h1>

          <div class="flex items-center gap-6 pb-6 border-b border-white/[0.08] text-xs font-mono text-gray-400">
            <span class="flex items-center gap-2">
              <User :size="14" class="text-cyan-400" />
              <strong class="text-white">{{ blog.author }}</strong>
            </span>
            <span class="flex items-center gap-2">
              <Calendar :size="14" class="text-sky" />
              <span>{{ formatDate(blog.createdAt) }}</span>
            </span>
          </div>

          <!-- HTML Content -->
          <div
            class="prose prose-invert max-w-none text-gray-300 leading-relaxed text-base sm:text-lg prose-headings:font-heading prose-headings:text-white prose-a:text-cyan-400 prose-img:rounded-2xl"
            v-html="blog.content"
          />
        </article>

        <div v-else class="text-center text-gray-400 py-20">
          <p class="text-lg">Artikel tidak ditemukan.</p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
