<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import MemberCard from '../components/member/MemberCard.vue';
import api from '../utils/api';
import {
  Users,
  Crown,
  ShieldCheck,
  PenTool,
  Coins,
  Clock,
  Sparkles,
  GitBranch,
} from 'lucide-vue-next';

const { t } = useI18n();
const members = ref([]);
const loading = ref(true);
const activeDivision = ref('Semua');

const divisions = ['Semua', 'Desain', 'Photography', 'Videography', 'Public Relation'];

// Verified real member data from UKM DKV Universitas Merangin
const defaultMembers = [
  {
    _id: 'mutia-chandra',
    name: 'Mutia Chandra',
    position: 'Ketua Umum',
    division: 'Desain',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: 'muchann__',
    isActive: true,
  },
  {
    _id: 'zhelicha-ayu-joya',
    name: 'Zhelicha Ayu Joya',
    position: 'Wakil Ketua',
    division: 'Photography',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'suci-nabiha',
    name: 'Suci Nabiha',
    position: 'Sekretaris I',
    division: 'Videography',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'jugio-adeksa',
    name: 'Jugio Adeksa',
    position: 'Sekretaris II',
    division: 'Photography',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'desri-yanti-safitri',
    name: 'Desri Yanti Safitri',
    position: 'Bendahara I',
    division: 'Public Relation',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'citra-dunanti',
    name: 'Citra Dunanti',
    position: 'Bendahara II',
    division: 'Public Relation',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'anggun-sanjaya',
    name: 'Anggun Sanjaya',
    position: 'Anggota',
    division: 'Desain',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'nurul-dwi-ariyani',
    name: 'Nurul Dwi Ariyani',
    position: 'Anggota',
    division: 'Videography',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2024,
    instagram: '',
    isActive: true,
  },
  {
    _id: 'niko-romansyah',
    name: 'Niko Romansyah',
    position: 'Founder',
    division: 'Videography',
    photo: '',
    major: 'Teknologi Informasi',
    year: 2023,
    instagram: '',
    isActive: false,
  },
];

const sortPositions = (a, b) => {
  const pA = (a.position || '').toLowerCase();
  const pB = (b.position || '').toLowerCase();
  const rank = (p) => {
    if (p.includes(' i ') || p.endsWith(' i') || p.includes(' 1') || p.includes('pertama') || p.includes('utama')) return 1;
    if (p.includes(' ii') || p.includes(' 2') || p.includes('kedua')) return 2;
    return 3;
  };
  const diff = rank(pA) - rank(pB);
  if (diff !== 0) return diff;
  return (a.name || '').localeCompare(b.name || '');
};

onMounted(async () => {
  try {
    const res = await api.get('/members?active=all');
    if (res.data?.data && res.data.data.length > 0) {
      members.value = res.data.data;
    } else {
      members.value = defaultMembers;
    }
  } catch (e) {
    console.error('Error fetching members:', e);
    members.value = defaultMembers;
  } finally {
    loading.value = false;
  }
});

// Level 1: Ketua Umum
const ketuaList = computed(() => {
  return members.value.filter((m) => {
    const pos = (m.position || '').toLowerCase();
    return pos.includes('ketua') && !pos.includes('wakil') && m.isActive !== false;
  });
});

// Level 2: Wakil Ketua
const wakilList = computed(() => {
  return members.value.filter((m) => {
    const pos = (m.position || '').toLowerCase();
    return pos.includes('wakil') && m.isActive !== false;
  });
});

// Level 3 Left: Sekretaris
const sekretarisList = computed(() => {
  return members.value
    .filter((m) => {
      const pos = (m.position || '').toLowerCase();
      return pos.includes('sekretaris') && m.isActive !== false;
    })
    .sort(sortPositions);
});

// Level 3 Right: Bendahara
const bendaharaList = computed(() => {
  return members.value
    .filter((m) => {
      const pos = (m.position || '').toLowerCase();
      return pos.includes('bendahara') && m.isActive !== false;
    })
    .sort(sortPositions);
});

// Level 5: Anggota Non Aktif / Demisioner / Founder
const anggotaNonAktifList = computed(() => {
  return members.value.filter((m) => {
    const pos = (m.position || '').toLowerCase();
    return (
      m.isActive === false ||
      pos.includes('non aktif') ||
      pos.includes('nonaktif') ||
      pos.includes('demisioner') ||
      pos.includes('alumni')
    );
  });
});

// Level 4: Anggota Aktif (Excluding core officers & non-active)
const allAnggotaAktif = computed(() => {
  return members.value.filter((m) => {
    const pos = (m.position || '').toLowerCase();
    // Exclude non-active
    if (
      m.isActive === false ||
      pos.includes('non aktif') ||
      pos.includes('nonaktif') ||
      pos.includes('demisioner') ||
      pos.includes('alumni')
    ) {
      return false;
    }
    // Exclude core leadership
    if (
      pos.includes('ketua') ||
      pos.includes('wakil') ||
      pos.includes('sekretaris') ||
      pos.includes('bendahara')
    ) {
      return false;
    }
    return true;
  });
});

// Level 4 filtered by active division
const filteredAnggotaAktif = computed(() => {
  if (activeDivision.value === 'Semua') return allAnggotaAktif.value;
  return allAnggotaAktif.value.filter((m) => {
    const div = (m.division || '').toLowerCase();
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
    <section class="relative pt-36 pb-12 md:pt-44 md:pb-16 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <GitBranch :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>STRUKTUR ORGANISASI</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('member.title') }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('member.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Main Hierarchy Tree Section -->
    <section class="py-8 pb-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />

        <div v-else class="flex flex-col items-center">
          <!-- ============================================== -->
          <!-- LEVEL 1: KETUA UMUM                            -->
          <!-- ============================================== -->
          <div class="flex flex-col items-center relative z-20">
            <!-- Header Label -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 mb-3 shadow-sm">
              <Crown :size="13" class="text-amber-500" />
              <span>KETUA UMUM</span>
            </div>

            <div class="flex flex-wrap justify-center gap-6">
              <MemberCard
                v-for="m in ketuaList"
                :key="m._id"
                :member="m"
                size="lg"
              />
            </div>
          </div>

          <!-- CONNECTOR: LEVEL 1 -> LEVEL 2 -->
          <div class="flex flex-col items-center my-1 pointer-events-none">
            <div class="w-0.5 h-10 sm:h-12 bg-slate-300 dark:bg-slate-700"></div>
          </div>

          <!-- ============================================== -->
          <!-- LEVEL 2: WAKIL KETUA                           -->
          <!-- ============================================== -->
          <div class="flex flex-col items-center relative z-20">
            <!-- Header Label -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-700 dark:text-cyan-300 border border-sky-500/30 mb-3 shadow-sm">
              <ShieldCheck :size="13" class="text-sky-500 dark:text-cyan-400" />
              <span>WAKIL KETUA</span>
            </div>

            <div class="flex flex-wrap justify-center gap-6">
              <MemberCard
                v-for="m in wakilList"
                :key="m._id"
                :member="m"
                size="lg"
              />
            </div>
          </div>

          <!-- CONNECTOR: LEVEL 2 -> LEVEL 3 -->
          <div class="flex flex-col items-center my-1 pointer-events-none">
            <div class="w-0.5 h-10 sm:h-12 bg-slate-300 dark:bg-slate-700"></div>
          </div>

          <!-- ============================================== -->
          <!-- LEVEL 3: PENGURUS INTI (SEKRETARIS & BENDAHARA) -->
          <!-- ============================================== -->
          <div class="relative w-full max-w-5xl mx-auto z-10 pt-2 pb-6">
            <!-- Desktop Tree Horizontal Crossbar -->
            <div class="hidden md:block absolute top-2 left-[25%] right-[25%] h-0.5 bg-slate-300 dark:bg-slate-700"></div>

            <!-- Central Line Passing Straight Down to Level 4 -->
            <div class="hidden md:block absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300 dark:bg-slate-700 pointer-events-none"></div>

            <!-- Two Branches Container (Sekretaris on Left, Bendahara on Right) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 relative z-10">
              <!-- Left Branch: SEKRETARIS -->
              <div class="flex flex-col items-center">
                <!-- Drop line from crossbar on desktop -->
                <div class="hidden md:block w-0.5 h-6 bg-slate-300 dark:bg-slate-700 -mt-2 mb-2"></div>

                <!-- Group Label -->
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 mb-3 shadow-sm">
                  <PenTool :size="12" class="text-emerald-500" />
                  <span>SEKRETARIAT</span>
                </div>

                <!-- Sub-branch lines if multiple Sekretaris -->
                <div v-if="sekretarisList.length > 1" class="hidden sm:block w-full max-w-xs relative mb-2">
                  <div class="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                  <div class="flex justify-around">
                    <div class="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                    <div class="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                  </div>
                </div>

                <!-- Sekretaris Cards -->
                <div class="flex flex-wrap justify-center gap-4 w-full">
                  <MemberCard
                    v-for="m in sekretarisList"
                    :key="m._id"
                    :member="m"
                    size="md"
                  />
                  <div v-if="sekretarisList.length === 0" class="text-xs font-mono text-slate-400 py-4">
                    Belum ada data sekretaris
                  </div>
                </div>
              </div>

              <!-- Right Branch: BENDAHARA -->
              <div class="flex flex-col items-center">
                <!-- Drop line from crossbar on desktop -->
                <div class="hidden md:block w-0.5 h-6 bg-slate-300 dark:bg-slate-700 -mt-2 mb-2"></div>

                <!-- Group Label -->
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 mb-3 shadow-sm">
                  <Coins :size="12" class="text-rose-500" />
                  <span>BENDAHARA</span>
                </div>

                <!-- Sub-branch lines if multiple Bendahara -->
                <div v-if="bendaharaList.length > 1" class="hidden sm:block w-full max-w-xs relative mb-2">
                  <div class="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                  <div class="flex justify-around">
                    <div class="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                    <div class="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
                  </div>
                </div>

                <!-- Bendahara Cards -->
                <div class="flex flex-wrap justify-center gap-4 w-full">
                  <MemberCard
                    v-for="m in bendaharaList"
                    :key="m._id"
                    :member="m"
                    size="md"
                  />
                  <div v-if="bendaharaList.length === 0" class="text-xs font-mono text-slate-400 py-4">
                    Belum ada data bendahara
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CONNECTOR: LEVEL 3 -> LEVEL 4 -->
          <div class="flex flex-col items-center my-1 pointer-events-none">
            <div class="w-0.5 h-12 sm:h-14 bg-slate-300 dark:bg-slate-700"></div>
          </div>

          <!-- ============================================== -->
          <!-- LEVEL 4: ANGGOTA AKTIF (DIVISI)                 -->
          <!-- ============================================== -->
          <div class="w-full relative z-20 flex flex-col items-center">
            <!-- Header Label -->
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-sky-500/10 text-sky-700 dark:text-cyan-300 border border-sky-500/30 mb-4 shadow-sm">
              <Users :size="14" class="text-sky-500 dark:text-cyan-400" />
              <span>DIVISI & ANGGOTA AKTIF</span>
            </div>

            <!-- Division Filter Pills -->
            <div class="mb-8 flex flex-wrap items-center justify-center gap-2 max-w-2xl px-2">
              <button
                v-for="div in divisions"
                :key="div"
                @click="activeDivision = div"
                class="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 border"
                :class="activeDivision === div
                  ? 'bg-sky-500/20 text-sky-700 dark:text-cyan-300 border-sky-500/50 shadow-sm font-semibold'
                  : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'"
              >
                {{ div === 'Semua' ? 'Semua Divisi' : div }}
              </button>
            </div>

            <!-- Tree Distributor Bar Above Active Members Grid (on large screens) -->
            <div class="hidden lg:block relative w-full max-w-6xl mx-auto mb-6">
              <div class="h-0.5 bg-slate-300 dark:bg-slate-700 w-full"></div>
              <div class="w-0.5 h-4 bg-slate-300 dark:bg-slate-700 mx-auto -mt-0.5"></div>
            </div>

            <!-- Active Members Grid (Responsive 2 to 6 columns) -->
            <div class="w-full max-w-6xl">
              <div
                v-if="filteredAnggotaAktif.length > 0"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              >
                <MemberCard
                  v-for="m in filteredAnggotaAktif"
                  :key="m._id"
                  :member="m"
                  size="sm"
                />
              </div>

              <!-- Empty state for division filter -->
              <div
                v-else
                class="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8"
              >
                <Sparkles :size="36" class="mx-auto mb-2 opacity-30 text-sky-500 dark:text-cyan-400" />
                <p class="text-sm font-mono text-slate-500 dark:text-gray-400">
                  Belum ada anggota aktif di divisi "{{ activeDivision }}".
                </p>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- LEVEL 5: ANGGOTA NON AKTIF & DEMISIONER        -->
          <!-- ============================================== -->
          <div v-if="anggotaNonAktifList.length > 0" class="w-full relative z-10 flex flex-col items-center mt-12">
            <!-- DOTTED VERTICAL CONNECTOR LINE (Matching Diagram) -->
            <div class="w-0 h-16 border-l-2 border-dashed border-slate-400 dark:border-slate-600 mb-2 pointer-events-none"></div>

            <!-- Header Label with Dotted Style -->
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-dashed border-slate-400 dark:border-slate-600 mb-6 shadow-sm">
              <Clock :size="13" class="text-slate-500 dark:text-slate-400" />
              <span>ANGGOTA NON AKTIF & DEMISIONER</span>
            </div>

            <!-- Dotted Horizontal Distributor Bar (on sm and up) -->
            <div class="hidden sm:block relative w-full max-w-3xl mx-auto mb-6">
              <div class="border-t-2 border-dashed border-slate-400 dark:border-slate-600 w-full"></div>
              <div class="flex justify-around">
                <div
                  v-for="(_, i) in anggotaNonAktifList.slice(0, 4)"
                  :key="i"
                  class="w-0 h-3 border-l-2 border-dashed border-slate-400 dark:border-slate-600"
                ></div>
              </div>
            </div>

            <!-- Non-Active Cards (Flex / Centered Grid) -->
            <div class="flex flex-wrap justify-center gap-4 max-w-4xl w-full">
              <div
                v-for="m in anggotaNonAktifList"
                :key="m._id"
                class="w-44 sm:w-48"
              >
                <MemberCard
                  :member="m"
                  size="sm"
                  :is-inactive="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
