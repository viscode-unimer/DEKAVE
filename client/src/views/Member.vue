<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { User, Users, Instagram, Sparkles, Crown } from 'lucide-vue-next';

const { t } = useI18n();
const members = ref([]);
const loading = ref(true);
const activeDivision = ref('Semua');

const divisions = ['Semua', 'Desain', 'Photography', 'Videography', 'Public Relation'];

// Verified real member data from UKM DEKAVE
const defaultMembers = [
  {
    _id: 'leader-mutia-chandra',
    name: 'Mutia Chandra',
    position: 'Ketua',
    division: 'Desain',
    photo: '',
    year: 2024,
    instagram: 'muchann__',
    isActive: true,
  },
];

onMounted(async () => {
  try {
    const res = await api.get('/members');
    if (res.data?.data && res.data.data.length > 0) {
      // Check if Mutia Chandra already in database
      const hasMutia = res.data.data.some(
        m => m.name.toLowerCase().includes('mutia') || m.position.toLowerCase().includes('ketua')
      );
      if (!hasMutia) {
        members.value = [...defaultMembers, ...res.data.data];
      } else {
        members.value = res.data.data;
      }
    } else {
      members.value = defaultMembers;
    }
  } catch (e) {
    console.error(e);
    members.value = defaultMembers;
  } finally {
    loading.value = false;
  }
});

const filteredMembers = computed(() => {
  if (activeDivision.value === 'Semua') return members.value;
  return members.value.filter(member => {
    const div = (member.division || '').toLowerCase();
    const target = activeDivision.value.toLowerCase();
    if (target === 'public relation') {
      return div.includes('public') || div.includes('pr') || div.includes('humas');
    }
    return div.includes(target);
  });
});
</script>

<template>
  <PublicLayout>
    <!-- Hero Header -->
    <section class="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <Users :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>CREATIVE COLLECTIVE</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('member.title') }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('member.subtitle') }}
        </p>

        <!-- Division Filter Pills -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            v-for="div in divisions"
            :key="div"
            @click="activeDivision = div"
            class="px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 border"
            :class="activeDivision === div
              ? 'bg-sky-500/20 text-sky-700 dark:text-sky border-sky-500/40 dark:border-sky/40 shadow-sm'
              : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'"
          >
            {{ div === 'Semua' ? 'Semua Divisi' : div }}
          </button>
        </div>
      </div>
    </section>

    <!-- Member Grid -->
    <section class="py-12 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div
            v-for="member in filteredMembers"
            :key="member._id"
            class="group glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-white/[0.08] hover:border-sky-500/50 dark:hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center justify-between relative overflow-hidden"
            :class="member.position?.toLowerCase().includes('ketua') ? 'ring-1 ring-amber-400/40 bg-amber-500/[0.02]' : ''"
          >
            <!-- Leader Crown Indicator -->
            <div
              v-if="member.position?.toLowerCase().includes('ketua')"
              class="absolute top-3 right-3 text-amber-500"
              title="Ketua UKM DEKAVE"
            >
              <Crown :size="16" />
            </div>

            <div>
              <div
                class="w-24 h-24 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 transition-colors duration-300 mb-4 shadow-md dark:shadow-lg dark:shadow-black/40"
                :class="member.position?.toLowerCase().includes('ketua') ? 'border-amber-400' : 'border-slate-200 dark:border-white/10 group-hover:border-sky-500 dark:group-hover:border-cyan-400'"
              >
                <img
                  v-if="member.photo"
                  :src="member.photo"
                  :alt="member.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-500 font-bold text-xl">
                  {{ member.name.charAt(0) }}
                </div>
              </div>

              <h3 class="font-heading font-bold text-slate-900 dark:text-white text-base group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors">
                {{ member.name }}
              </h3>

              <div class="mt-1 flex flex-col items-center gap-0.5">
                <span
                  v-if="member.position?.toLowerCase().includes('ketua')"
                  class="inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold"
                >
                  {{ member.position }}
                </span>
                <span
                  v-else
                  class="text-xs font-mono text-sky-600 dark:text-cyan-400 font-medium"
                >
                  {{ member.position }}
                </span>

                <span class="text-[11px] font-mono text-slate-500 dark:text-gray-400">
                  Divisi {{ member.division }}
                </span>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-200 dark:border-white/[0.06] w-full">
              <a
                v-if="member.instagram"
                :href="`https://instagram.com/${member.instagram.replace('@', '')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors"
              >
                <Instagram :size="12" />
                <span>@{{ member.instagram.replace('@', '') }}</span>
              </a>
              <span v-else class="text-[11px] font-mono text-slate-400 dark:text-gray-600">
                DEKAVE Member
              </span>
            </div>
          </div>

          <div v-if="filteredMembers.length === 0" class="col-span-full text-center text-slate-500 dark:text-gray-400 py-16">
            <Users :size="48" class="mx-auto mb-3 opacity-30 text-sky-600 dark:text-cyan-400" />
            <p class="text-lg font-medium">Belum ada anggota di divisi ini.</p>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
