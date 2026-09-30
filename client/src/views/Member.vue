<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { User, Users, Instagram, Sparkles } from 'lucide-vue-next';

const { t } = useI18n();
const members = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/members');
    members.value = res.data.data;
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
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 mb-6 backdrop-blur-md">
          <Users :size="14" class="text-cyan-400" />
          <span>CREATIVE COLLECTIVE</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
          {{ t('member.title') }}
        </h1>
        <p class="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('member.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Member Grid -->
    <section class="py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div
            v-for="member in members"
            :key="member._id"
            class="group glass-card rounded-2xl p-5 border border-white/[0.08] hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center justify-between"
          >
            <div>
              <div class="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-900 border-2 border-white/10 group-hover:border-cyan-400 transition-colors duration-300 mb-4 shadow-lg shadow-black/40">
                <img
                  v-if="member.photo"
                  :src="member.photo"
                  :alt="member.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                  <User :size="32" class="opacity-40" />
                </div>
              </div>

              <h3 class="font-heading font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                {{ member.name }}
              </h3>
              <p class="text-xs font-mono text-cyan-400 font-medium mt-1">
                {{ member.position }}
              </p>
              <p class="text-[11px] font-mono text-gray-400 mt-0.5">
                {{ member.division }}
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-white/[0.06] w-full">
              <a
                v-if="member.instagram"
                :href="`https://instagram.com/${member.instagram.replace('@', '')}`"
                target="_blank"
                class="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-300 transition-colors"
              >
                <Instagram :size="12" />
                <span>{{ member.instagram }}</span>
              </a>
              <span v-else class="text-[11px] font-mono text-gray-600">
                DEKAVE Member
              </span>
            </div>
          </div>

          <div v-if="members.length === 0" class="col-span-full text-center text-gray-400 py-16">
            <Users :size="48" class="mx-auto mb-3 opacity-30 text-cyan-400" />
            <p class="text-lg font-medium">{{ t('member.no_data') }}</p>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
