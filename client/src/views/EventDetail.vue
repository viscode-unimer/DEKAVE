<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDate } from '../utils/formatDate';
import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-vue-next';

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
    <div class="relative pt-36 pb-20 md:pt-40 md:pb-24 min-h-screen">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterLink
          to="/event"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 mb-8"
        >
          <ArrowLeft :size="14" />
          <span>{{ t('common.back') }} to Events</span>
        </RouterLink>

        <LoadingSpinner v-if="loading" />

        <div v-else-if="event" class="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
          <div class="rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-white/[0.05]">
            <img
              v-if="event.poster"
              :src="event.poster"
              :alt="event.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-8xl text-gray-500">
              <Calendar :size="80" class="opacity-40" />
            </div>
          </div>

          <div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 mb-4">
              <Tag :size="12" />
              {{ event.type }}
            </span>
            <h1 class="font-heading text-3xl sm:text-5xl font-bold text-white mb-6">
              {{ event.title }}
            </h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 shrink-0">
                  <Calendar :size="20" />
                </div>
                <div>
                  <span class="text-xs font-mono text-gray-400 uppercase tracking-wider block">{{ t('event.date') }}</span>
                  <p class="font-semibold text-white text-sm sm:text-base">{{ formatDate(event.date) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-royal/20 border border-sky/20 flex items-center justify-center text-sky shrink-0">
                  <MapPin :size="20" />
                </div>
                <div>
                  <span class="text-xs font-mono text-gray-400 uppercase tracking-wider block">{{ t('event.location') }}</span>
                  <p class="font-semibold text-white text-sm sm:text-base">{{ event.location }}</p>
                </div>
              </div>
            </div>

            <div class="text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {{ event.description }}
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-20">
          <p class="text-lg">Event tidak ditemukan.</p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>
