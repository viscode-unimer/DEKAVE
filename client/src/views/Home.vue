<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDateShort } from '../utils/formatDate';
import { Image, Calendar, FileText } from 'lucide-vue-next';

const { t } = useI18n();
const featuredPortfolios = ref([]);
const latestEvents = ref([]);
const latestBlogs = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [portfolioRes, eventRes, blogRes] = await Promise.all([
      api.get('/portfolios?featured=true&limit=3'),
      api.get('/events?limit=3'),
      api.get('/blogs?limit=3'),
    ]);
    featuredPortfolios.value = portfolioRes.data.data;
    latestEvents.value = eventRes.data.data;
    latestBlogs.value = blogRes.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <PublicLayout>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center bg-gradient-to-br from-primary via-secondary to-surface overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full filter blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full filter blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-3xl">
          <span class="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-4 border border-accent px-3 py-1 rounded-full">
            UKM DKV — Universitas Merangin
          </span>
          <h1 class="font-heading text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            {{ t('home.hero_title') }}
          </h1>
          <h2 class="font-heading text-4xl md:text-6xl font-bold text-accent italic mb-6">
            {{ t('home.hero_subtitle') }}
          </h2>
          <p class="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            {{ t('home.hero_desc') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <RouterLink to="/portfolio" class="btn-accent text-center">
              {{ t('home.hero_cta') }}
            </RouterLink>
            <RouterLink
              to="/camavis"
              class="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 text-center"
            >
              {{ t('home.hero_join') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Portfolio -->
    <section class="py-20 bg-gray-50 dark:bg-secondary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <h2 class="section-title">{{ t('home.featured_portfolio') }}</h2>
          <RouterLink to="/portfolio" class="text-accent hover:underline text-sm font-semibold">
            {{ t('home.see_all') }} →
          </RouterLink>
        </div>
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="item in featuredPortfolios"
            :key="item._id"
            :to="`/portfolio/${item._id}`"
            class="group bg-white dark:bg-primary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                v-if="item.images && item.images[0]"
                :src="item.images[0]"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <Image :size="36" class="opacity-40" />
              </div>
            </div>
            <div class="p-5">
              <span class="text-xs text-accent font-semibold uppercase tracking-wide">{{ item.category }}</span>
              <h3 class="font-heading text-lg font-bold mt-1 text-gray-900 dark:text-white">{{ item.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">by {{ item.creator }}</p>
            </div>
          </RouterLink>
          <div v-if="!loading && featuredPortfolios.length === 0" class="col-span-3 text-center text-gray-400 py-12">
            {{ t('portfolio.no_data') }}
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Events -->
    <section class="py-20 bg-white dark:bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <h2 class="section-title">{{ t('home.latest_events') }}</h2>
          <RouterLink to="/event" class="text-accent hover:underline text-sm font-semibold">
            {{ t('home.see_all') }} →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="event in latestEvents"
            :key="event._id"
            :to="`/event/${event._id}`"
            class="group bg-gray-50 dark:bg-secondary rounded-2xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                v-if="event.poster"
                :src="event.poster"
                :alt="event.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <Calendar :size="36" class="opacity-40" />
              </div>
            </div>
            <div class="p-5">
              <span class="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-semibold mb-2">
                {{ event.type }}
              </span>
              <h3 class="font-heading text-lg font-bold text-gray-900 dark:text-white">{{ event.title }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ formatDateShort(event.date) }}</p>
            </div>
          </RouterLink>
          <div v-if="!loading && latestEvents.length === 0" class="col-span-3 text-center text-gray-400 py-12">
            {{ t('event.no_data') }}
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Blog -->
    <section class="py-20 bg-gray-50 dark:bg-secondary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <h2 class="section-title">{{ t('home.latest_blogs') }}</h2>
          <RouterLink to="/blog" class="text-accent hover:underline text-sm font-semibold">
            {{ t('home.see_all') }} →
          </RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="blog in latestBlogs"
            :key="blog._id"
            :to="`/blog/${blog.slug}`"
            class="group bg-white dark:bg-primary rounded-2xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                v-if="blog.thumbnail"
                :src="blog.thumbnail"
                :alt="blog.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <FileText :size="36" class="opacity-40" />
              </div>
            </div>
            <div class="p-5">
              <h3 class="font-heading text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                {{ blog.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ t('blog.by') }} {{ blog.author }} · {{ formatDateShort(blog.createdAt) }}
              </p>
              <span class="text-accent text-sm font-semibold mt-2 inline-block">
                {{ t('blog.read_more') }} →
              </span>
            </div>
          </RouterLink>
          <div v-if="!loading && latestBlogs.length === 0" class="col-span-3 text-center text-gray-400 py-12">
            {{ t('blog.no_data') }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Join CAMAVIS -->
    <section class="py-20 bg-gradient-to-r from-accent to-pink-700 text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="font-heading text-4xl md:text-5xl font-bold mb-4">Bergabung sebagai CAMAVIS?</h2>
        <p class="text-lg opacity-90 mb-8">
          Jadilah bagian dari komunitas kreatif terbaik di Universitas Merangin. Daftarkan dirimu sekarang!
        </p>
        <RouterLink
          to="/camavis"
          class="bg-white text-accent font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-lg"
        >
          Daftar Sekarang
        </RouterLink>
      </div>
    </section>
  </PublicLayout>
</template>
