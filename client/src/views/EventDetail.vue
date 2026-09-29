<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';

const { t } = useI18n();
const route = useRoute();
const event = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get(`/events/${route.params.id}`);
    event.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <PublicLayout>
    <div class="pt-20 pb-16 min-h-screen bg-white dark:bg-primary">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterLink to="/event" class="inline-flex items-center gap-2 text-accent hover:underline mb-8 mt-4">
          ← {{ t('common.back') }}
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <div v-else-if="event">
          <div class="rounded-3xl overflow-hidden aspect-video bg-gray-100 dark:bg-secondary mb-8">
            <img
              v-if="event.poster"
              :src="event.poster"
              :alt="event.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-8xl">📅</div>
          </div>

          <span class="inline-block bg-accent/10 text-accent text-sm font-bold px-3 py-1 rounded-full mb-4">
            {{ event.type }}
          </span>
          <h1 class="font-heading text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {{ event.title }}
          </h1>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 dark:bg-secondary rounded-2xl">
            <div>
              <span class="text-sm text-gray-500">{{ t('event.date') }}</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ formatDate(event.date) }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-500">{{ t('event.location') }}</span>
              <p class="font-semibold text-gray-900 dark:text-white">{{ event.location }}</p>
            </div>
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{{ event.description }}</p>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-20">Event tidak ditemukan.</div>
      </div>
    </div>
  </PublicLayout>
</template>
