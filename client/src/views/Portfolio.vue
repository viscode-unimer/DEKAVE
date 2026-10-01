<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { Image, Sparkles, ArrowUpRight, Palette } from 'lucide-vue-next';

const { t } = useI18n();
const portfolios = ref([]);
const loading = ref(true);
const activeFilter = ref('');
const categories = ['Desain Grafis & Poster', 'Fotografi & Dokumentasi', 'Videografi & Sinematik', 'Konten Media & Publikasi'];

// Color palettes for Inspomcp signature touch
const getPaletteForCategory = (cat) => {
  const map = {
    'Desain Grafis & Poster': ['#0284C7', '#38BDF8', '#0EA5E9', '#0369A1'],
    'Fotografi & Dokumentasi': ['#F59E0B', '#FBBF24', '#D97706', '#78350F'],
    'Videografi & Sinematik': ['#6366F1', '#818CF8', '#4F46E5', '#312E81'],
    'Konten Media & Publikasi': ['#10B981', '#34D399', '#059669', '#064E3B'],
    'Desain': ['#0284C7', '#38BDF8', '#0EA5E9', '#0369A1'],
    'Photography': ['#F59E0B', '#FBBF24', '#D97706', '#78350F'],
    'Videography': ['#6366F1', '#818CF8', '#4F46E5', '#312E81'],
    'Public Relation': ['#10B981', '#34D399', '#059669', '#064E3B'],
  };
  return map[cat] || ['#0284C7', '#38BDF8', '#67E8F9', '#1E40AF'];
};

const fetchPortfolios = async () => {
  loading.value = true;
  try {
    const params = activeFilter.value ? `?category=${activeFilter.value}` : '';
    const res = await api.get(`/portfolios${params}`);
    portfolios.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch(activeFilter, fetchPortfolios);
onMounted(fetchPortfolios);
</script>

<template>
  <PublicLayout>
    <!-- Hero Header -->
    <section class="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <Palette :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>CURATED CREATIVE INDEX</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('portfolio.title') }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('portfolio.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Filter Tabs -->
        <div class="flex items-center justify-center mb-12">
          <div class="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-slate-200/80 dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/[0.08] backdrop-blur-xl shadow-sm">
            <button
              @click="activeFilter = ''"
              :class="[
                'px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-300',
                activeFilter === ''
                  ? 'bg-sky-500 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md shadow-sky-500/30 dark:shadow-cyan-500/30'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
              ]"
            >
              {{ t('portfolio.filter_all') }}
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeFilter = cat"
              :class="[
                'px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-300',
                activeFilter === cat
                  ? 'bg-sky-500 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md shadow-sky-500/30 dark:shadow-cyan-500/30'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <LoadingSpinner v-if="loading" />

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RouterLink
            v-for="item in portfolios"
            :key="item._id"
            :to="`/portfolio/${item._id}`"
            class="group glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] hover:border-sky-500/50 dark:hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
          >
            <!-- Thumbnail Area (Locked 4:3 Aspect Ratio) -->
            <div class="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative shrink-0">
              <img
                v-if="item.images?.[0]"
                :src="item.images[0]"
                :alt="item.title"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-gray-500">
                <Image :size="36" class="opacity-40" />
              </div>

              <!-- Floating Category Pill -->
              <div class="absolute top-3 left-3 z-10">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/90 dark:bg-slate-950/70 border border-slate-200 dark:border-white/20 text-sky-700 dark:text-cyan-300 backdrop-blur-md shadow-sm">
                  {{ item.category }}
                </span>
              </div>

              <!-- Hover Arrow -->
              <div class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 shadow-md">
                <ArrowUpRight :size="16" />
              </div>
            </div>

            <!-- Card Content & Inspomcp Color Dots -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-heading font-bold text-slate-900 dark:text-white text-lg group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-gray-400 font-mono mt-1">by {{ item.creator }}</p>
              </div>

              <!-- Bottom Palette & Tags -->
              <div class="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div
                    v-for="(hex, idx) in getPaletteForCategory(item.category)"
                    :key="idx"
                    class="w-3 h-3 rounded-full border border-slate-300 dark:border-white/20"
                    :style="{ backgroundColor: hex }"
                    :title="hex"
                  ></div>
                </div>
                <span class="text-[11px] font-mono text-sky-600 dark:text-cyan-400/80 group-hover:text-sky-700 dark:group-hover:text-cyan-300 font-semibold">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          </RouterLink>

          <div v-if="portfolios.length === 0" class="col-span-full text-center text-slate-500 dark:text-gray-400 py-16">
            <Palette :size="48" class="mx-auto mb-3 opacity-30 text-sky-600 dark:text-cyan-400" />
            <p class="text-lg font-medium">{{ t('portfolio.no_data') }}</p>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
