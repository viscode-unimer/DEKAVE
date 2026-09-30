<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { Calendar, MapPin, Sparkles, ArrowUpRight } from 'lucide-vue-next';

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
    <!-- Hero Header -->
    <section class="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <Calendar :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>DKV WORKSHOPS & EXHIBITIONS</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('event.title') }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('event.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Events List -->
    <section class="py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="event in events"
            :key="event._id"
            :to="`/event/${event._id}`"
            class="group glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] hover:border-sky-500/50 dark:hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div class="aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
              <img
                v-if="event.poster"
                :src="event.poster"
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-500">
                <Calendar :size="40" class="opacity-40" />
              </div>

              <!-- Event Type Pill -->
              <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/90 dark:bg-slate-950/70 border border-slate-200 dark:border-white/20 text-sky-700 dark:text-cyan-300 backdrop-blur-md shadow-sm">
                  {{ event.type }}
                </span>
              </div>

              <!-- Arrow -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowUpRight :size="16" />
              </div>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-heading text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors mb-3">
                  {{ event.title }}
                </h3>
                <div class="space-y-2 text-xs font-mono text-slate-500 dark:text-gray-400">
                  <p class="flex items-center gap-2">
                    <Calendar :size="14" class="text-sky-600 dark:text-cyan-400" />
                    <span>{{ formatDate(event.date) }}</span>
                  </p>
                  <p class="flex items-center gap-2">
                    <MapPin :size="14" class="text-sky-600 dark:text-sky" />
                    <span>{{ event.location }}</span>
                  </p>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <span class="text-xs font-mono text-sky-600 dark:text-cyan-400 font-semibold group-hover:underline">
                  Lihat Detail Event &rarr;
                </span>
              </div>
            </div>
          </RouterLink>

          <div v-if="events.length === 0" class="col-span-full text-center text-slate-500 dark:text-gray-400 py-16">
            <Calendar :size="48" class="mx-auto mb-3 opacity-30 text-sky-600 dark:text-cyan-400" />
            <p class="text-lg font-medium">{{ t('event.no_data') }}</p>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
