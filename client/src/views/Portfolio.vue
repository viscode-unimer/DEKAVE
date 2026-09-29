<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { Image } from 'lucide-vue-next';

const { t } = useI18n();
const portfolios = ref([]);
const loading = ref(true);
const activeFilter = ref('');
const categories = ['Branding', 'Illustration', 'UI/UX', 'Photography', 'Motion'];

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
    <section class="py-24 bg-gradient-to-br from-primary to-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('portfolio.title') }}</h1>
        <p class="text-gray-300 text-xl">{{ t('portfolio.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-white dark:bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Filter Buttons -->
        <div class="flex flex-wrap gap-3 mb-10">
          <button
            @click="activeFilter = ''"
            :class="[
              'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
              activeFilter === ''
                ? 'bg-accent border-accent text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent'
            ]"
          >
            {{ t('portfolio.filter_all') }}
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeFilter = cat"
            :class="[
              'px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
              activeFilter === cat
                ? 'bg-accent border-accent text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RouterLink
            v-for="item in portfolios"
            :key="item._id"
            :to="`/portfolio/${item._id}`"
            class="group bg-gray-50 dark:bg-secondary rounded-2xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                v-if="item.images?.[0]"
                :src="item.images[0]"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <Image :size="36" class="opacity-40" />
              </div>
            </div>
            <div class="p-4">
              <span class="text-xs text-accent font-bold uppercase">{{ item.category }}</span>
              <h3 class="font-heading font-bold text-gray-900 dark:text-white mt-1">{{ item.title }}</h3>
              <p class="text-sm text-gray-500">by {{ item.creator }}</p>
            </div>
          </RouterLink>
          <div v-if="portfolios.length === 0" class="col-span-full text-center text-gray-400 py-12">
            {{ t('portfolio.no_data') }}
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
