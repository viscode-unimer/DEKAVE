<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { ArrowLeft, Tag, User, Layers, Sparkles } from 'lucide-vue-next';

const { t } = useI18n();
const route = useRoute();
const portfolio = ref(null);
const loading = ref(true);
const activeImg = ref(0);

onMounted(async () => {
  try {
    const res = await api.get(`/portfolios/${route.params.id}`);
    portfolio.value = res.data.data;
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
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 mb-8"
        >
          <ArrowLeft :size="14" />
          <span>{{ t('common.back') }} to Portfolio</span>
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <div v-else-if="portfolio" class="space-y-8">
          <!-- Main Showcase View -->
          <div class="glass-card rounded-3xl p-4 sm:p-6 border border-white/10 relative overflow-hidden">
            <div class="rounded-2xl overflow-hidden aspect-video bg-slate-900 mb-4 border border-white/[0.05]">
              <img
                :src="portfolio.images[activeImg]"
                :alt="portfolio.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Thumbnail Reel -->
            <div v-if="portfolio.images && portfolio.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
              <button
                v-for="(img, i) in portfolio.images"
                :key="i"
                @click="activeImg = i"
                :class="[
                  'shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300',
                  i === activeImg ? 'border-cyan-400 shadow-md shadow-cyan-500/20 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                ]"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Metadata Box -->
          <div class="glass-card rounded-3xl p-6 sm:p-10 border border-white/10">
            <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div class="flex flex-wrap items-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                  <Layers :size="12" />
                  {{ portfolio.category }}
                </span>
                <span
                  v-for="tag in portfolio.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-gray-300 bg-white/[0.04] border border-white/[0.08]"
                >
                  <Tag :size="11" class="text-cyan-400/60" />
                  #{{ tag }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-xs font-mono text-gray-400">
                <User :size="14" class="text-cyan-400" />
                <span>Created by <strong class="text-white">{{ portfolio.creator }}</strong></span>
              </div>
            </div>

            <!-- Title & Description -->
            <div class="mt-8">
              <h1 class="font-heading text-3xl sm:text-5xl font-bold text-white mb-6">
                {{ portfolio.title }}
              </h1>
              <p class="text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {{ portfolio.description }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-20">
          <p class="text-lg">Portfolio tidak ditemukan.</p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
