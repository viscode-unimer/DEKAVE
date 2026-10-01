<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import VideoPlayer from '../components/common/VideoPlayer.vue';
import api from '../utils/api';
import { ArrowLeft, Tag, User, Layers, Play, Image as ImageIcon } from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();
const portfolio = ref(null);
const loading = ref(true);
const activeImg = ref(0);
const activeMediaTab = ref('video'); // 'video' | 'gallery'

onMounted(async () => {
  try {
    const res = await api.get(`/portfolios/${route.params.id}`);
    portfolio.value = res.data.data;
    if (portfolio.value?.videoUrl) {
      activeMediaTab.value = 'video';
    } else {
      activeMediaTab.value = 'gallery';
    }
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
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Capsule -->
        <RouterLink
          to="/portfolio"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-sky-500/40 dark:hover:border-cyan-400/40 transition-all duration-300 mb-8 shadow-sm"
        >
          <ArrowLeft :size="14" />
          <span>{{ t('common.back') }} ke Portofolio</span>
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <div v-else-if="portfolio" class="space-y-8">
          <!-- Main Showcase View -->
          <div class="glass-card rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
            <!-- Tabs if both video and photos exist -->
            <div
              v-if="portfolio.videoUrl && portfolio.images && portfolio.images.length > 0"
              class="flex items-center justify-center gap-2 mb-6"
            >
              <button
                @click="activeMediaTab = 'video'"
                :class="[
                  'px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer',
                  activeMediaTab === 'video'
                    ? 'bg-sky-500 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md shadow-sky-500/30 dark:shadow-cyan-500/30'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-200/60 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
                ]"
              >
                <Play :size="12" class="fill-current" />
                <span>Video Player</span>
              </button>

              <button
                @click="activeMediaTab = 'gallery'"
                :class="[
                  'px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer',
                  activeMediaTab === 'gallery'
                    ? 'bg-sky-500 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md shadow-sky-500/30 dark:shadow-cyan-500/30'
                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-200/60 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10'
                ]"
              >
                <ImageIcon :size="12" />
                <span>Galeri Foto ({{ portfolio.images.length }})</span>
              </button>
            </div>

            <!-- Video Player Display -->
            <div v-if="portfolio.videoUrl && activeMediaTab === 'video'" class="w-full">
              <VideoPlayer :video-url="portfolio.videoUrl" :title="portfolio.title" />
            </div>

            <!-- Image Viewer Display -->
            <div v-else-if="portfolio.images && portfolio.images.length > 0">
              <div class="rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900 mb-4 border border-slate-200 dark:border-white/[0.05]">
                <img
                  :src="portfolio.images[activeImg]"
                  :alt="portfolio.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Thumbnail Reel -->
              <div v-if="portfolio.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
                <button
                  v-for="(img, i) in portfolio.images"
                  :key="i"
                  @click="activeImg = i"
                  :class="[
                    'shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer',
                    i === activeImg ? 'border-sky-500 dark:border-cyan-400 shadow-md scale-105' : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
                  ]"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Fallback if neither video nor images -->
            <div v-else class="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
              <ImageIcon :size="48" class="opacity-40" />
            </div>
          </div>

          <!-- Metadata Box -->
          <div class="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10">
            <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.08]">
              <div class="flex flex-wrap items-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold bg-sky-500/10 dark:bg-cyan-500/10 border border-sky-500/30 dark:border-cyan-400/30 text-sky-700 dark:text-cyan-300">
                  <Layers :size="12" />
                  {{ portfolio.category }}
                </span>
                <span
                  v-if="portfolio.videoUrl"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                >
                  <Play :size="11" class="fill-rose-500 text-rose-500" />
                  Video Media
                </span>
                <span
                  v-for="tag in portfolio.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]"
                >
                  <Tag :size="11" class="text-sky-500 dark:text-cyan-400/60" />
                  #{{ tag }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
                <User :size="14" class="text-sky-600 dark:text-cyan-400" />
                <span>Created by <strong class="text-slate-900 dark:text-white">{{ portfolio.creator }}</strong></span>
              </div>
            </div>

            <!-- Title & Description -->
            <div class="mt-8">
              <h1 class="font-heading text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                {{ portfolio.title }}
              </h1>
              <p class="text-slate-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {{ portfolio.description }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-slate-500 dark:text-gray-400 py-20">
          <p class="text-lg">Portofolio tidak ditemukan.</p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
