<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { Calendar, MapPin } from 'lucide-vue-next';

const { t } = useI18n();
const events = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/events');
    events.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <PublicLayout>
    <section class="py-24 bg-gradient-to-br from-primary to-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('event.title') }}</h1>
        <p class="text-gray-300 text-xl">{{ t('event.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-white dark:bg-primary">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="event in events"
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
                <Calendar :size="40" class="opacity-40" />
              </div>
            </div>
            <div class="p-6">
              <span class="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-bold mb-3">
                {{ event.type }}
              </span>
              <h3 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-2">{{ event.title }}</h3>
              <div class="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                <p class="flex items-center gap-2">
                  <Calendar :size="14" class="text-accent flex-shrink-0" />
                  <span>{{ formatDate(event.date) }}</span>
                </p>
                <p class="flex items-center gap-2">
                  <MapPin :size="14" class="text-accent flex-shrink-0" />
                  <span>{{ event.location }}</span>
                </p>
              </div>
            </div>
          </RouterLink>
          <div v-if="events.length === 0" class="col-span-full text-center text-gray-400 py-12">
            {{ t('event.no_data') }}
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
