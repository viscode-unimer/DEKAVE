<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';

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
    <div class="pt-20 pb-16 bg-white dark:bg-primary min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterLink to="/portfolio" class="inline-flex items-center gap-2 text-accent hover:underline mb-8 mt-4">
          ← {{ t('common.back') }}
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <div v-else-if="portfolio">
          <!-- Image Viewer -->
          <div class="mb-6">
            <div class="rounded-2xl overflow-hidden aspect-video bg-gray-100 dark:bg-secondary mb-4">
              <img
                :src="portfolio.images[activeImg]"
                :alt="portfolio.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-if="portfolio.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
              <button
                v-for="(img, i) in portfolio.images"
                :key="i"
                @click="activeImg = i"
                :class="[
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                  i === activeImg ? 'border-accent' : 'border-transparent'
                ]"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Tags & Category -->
          <div class="flex flex-wrap gap-3 mb-6">
            <span class="inline-block bg-accent/10 text-accent text-sm font-bold px-3 py-1 rounded-full">
              {{ portfolio.category }}
            </span>
            <span
              v-for="tag in portfolio.tags"
              :key="tag"
              class="inline-block bg-gray-100 dark:bg-secondary text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-full"
            >
              #{{ tag }}
            </span>
          </div>

          <h1 class="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {{ portfolio.title }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mb-6">by {{ portfolio.creator }}</p>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {{ portfolio.description }}
          </p>
        </div>

        <div v-else class="text-center text-gray-400 py-20">Portfolio tidak ditemukan.</div>
      </div>
    </div>
  </PublicLayout>
</template>
