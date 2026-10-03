<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import MemberCard from '../components/member/MemberCard.vue';
import api from '../utils/api';
import { GitBranch } from 'lucide-vue-next';

const { t } = useI18n();
const members = ref([]);
const loading = ref(true);

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

// Level 4: Anggota Aktif (Semua Anggota yang aktif selain pengurus inti)
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

// Chunk active members into rows of up to 5 cards (to prevent 6-card cutoff)
const CHUNK_SIZE = 5;
const anggotaAktifRows = computed(() => {
  const rows = [];
  const list = allAnggotaAktif.value;
  for (let i = 0; i < list.length; i += CHUNK_SIZE) {
    rows.push(list.slice(i, i + CHUNK_SIZE));
  }
  return rows;
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
</script>

<template>
  <PublicLayout>
    <!-- Hero Header -->
    <section class="relative pt-36 pb-10 md:pt-44 md:pb-14 overflow-hidden">
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

    <!-- Main Hierarchy Tree Section (Pure connected tree layout) -->
    <section class="py-6 pb-32 relative">
      <div class="max-w-7xl mx-auto px-2 sm:px-4">
        <LoadingSpinner v-if="loading" />

        <!-- Scrollable Tree Container for responsive horizontal panning without layout breakage -->
        <div v-else class="w-full overflow-x-auto pb-12 pt-2 px-4 scrollbar-thin">
          <div class="min-w-fit mx-auto flex flex-col items-center">

            <!-- ============================================== -->
            <!-- SECTION DIVIDER: ANGGOTA AKTIF                 -->
            <!-- ============================================== -->
            <div class="w-full max-w-3xl sm:max-w-4xl flex items-center gap-4 my-6 px-4">
              <div class="h-px bg-slate-300 dark:bg-slate-700/80 flex-1"></div>
              <span class="text-[11px] sm:text-xs font-mono font-semibold tracking-widest text-slate-500 dark:text-gray-400 uppercase whitespace-nowrap">
                ANGGOTA AKTIF
              </span>
              <div class="h-px bg-slate-300 dark:bg-slate-700/80 flex-1"></div>
            </div>

            <!-- Vertical line dropping from divider to top of Ketua Umum -->
            <div class="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>

            <!-- ============================================== -->
            <!-- LEVEL 1: KETUA UMUM                            -->
            <!-- ============================================== -->
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center">
                <MemberCard
                  v-for="m in ketuaList"
                  :key="m._id"
                  :member="m"
                />
              </div>

              <!-- Direct solid line connecting bottom of Ketua to top of Wakil -->
              <div class="w-0.5 h-12 bg-slate-300 dark:bg-slate-600"></div>
            </div>

            <!-- ============================================== -->
            <!-- LEVEL 2: WAKIL KETUA                           -->
            <!-- ============================================== -->
            <div class="flex flex-col items-center">
              <div class="flex items-center justify-center">
                <MemberCard
                  v-for="m in wakilList"
                  :key="m._id"
                  :member="m"
                />
              </div>

              <!-- Direct solid line connecting bottom of Wakil to Level 3 Branch -->
              <div class="w-0.5 h-12 bg-slate-300 dark:bg-slate-600"></div>
            </div>

            <!-- ============================================== -->
            <!-- LEVEL 3: PENGURUS INTI (SEKRETARIAT & BENDAHARA)-->
            <!-- ============================================== -->
            <div class="relative flex items-start justify-center gap-16 lg:gap-20">
              <!-- Central Trunk Line passing through the gap to Level 4 -->
              <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300 dark:bg-slate-600 pointer-events-none"></div>

              <!-- LEFT BRANCH: SEKRETARIAT -->
              <div class="flex flex-col items-center relative">
                <!-- Crossbar segment connecting Left Branch center to Container Center -->
                <div class="absolute top-0 left-1/2 -right-8 lg:-right-10 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                <!-- Vertical drop into Sekretaris sub-tree -->
                <div class="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>

                <!-- Sekretaris Sub-Tree -->
                <div class="flex items-start justify-center">
                  <div
                    v-for="(m, idx) in sekretarisList"
                    :key="m._id"
                    class="flex flex-col items-center relative px-3"
                  >
                    <!-- Horizontal line over Sekretaris cards -->
                    <div
                      v-if="sekretarisList.length > 1"
                      class="absolute top-0 h-0.5 bg-slate-300 dark:bg-slate-600"
                      :class="[
                        idx === 0 ? 'left-1/2 right-0' : '',
                        idx === sekretarisList.length - 1 ? 'left-0 right-1/2' : '',
                        idx > 0 && idx < sekretarisList.length - 1 ? 'left-0 right-0' : ''
                      ]"
                    ></div>
                    <!-- Drop line touching top of card -->
                    <div class="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>
                    <MemberCard :member="m" />
                  </div>
                </div>
              </div>

              <!-- RIGHT BRANCH: BENDAHARA -->
              <div class="flex flex-col items-center relative">
                <!-- Crossbar segment connecting Container Center to Right Branch center -->
                <div class="absolute top-0 -left-8 lg:-left-10 right-1/2 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                <!-- Vertical drop into Bendahara sub-tree -->
                <div class="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>

                <!-- Bendahara Sub-Tree -->
                <div class="flex items-start justify-center">
                  <div
                    v-for="(m, idx) in bendaharaList"
                    :key="m._id"
                    class="flex flex-col items-center relative px-3"
                  >
                    <!-- Horizontal line over Bendahara cards -->
                    <div
                      v-if="bendaharaList.length > 1"
                      class="absolute top-0 h-0.5 bg-slate-300 dark:bg-slate-600"
                      :class="[
                        idx === 0 ? 'left-1/2 right-0' : '',
                        idx === bendaharaList.length - 1 ? 'left-0 right-1/2' : '',
                        idx > 0 && idx < bendaharaList.length - 1 ? 'left-0 right-0' : ''
                      ]"
                    ></div>
                    <!-- Drop line touching top of card -->
                    <div class="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>
                    <MemberCard :member="m" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Central vertical line continuing from Level 3 into Level 4 -->
            <div class="w-0.5 h-12 bg-slate-300 dark:bg-slate-600"></div>

            <!-- ============================================== -->
            <!-- LEVEL 4: ANGGOTA AKTIF                         -->
            <!-- ============================================== -->
            <div class="flex flex-col items-center">
              <template v-for="(row, rIdx) in anggotaAktifRows" :key="rIdx">
                <!-- Connector line between multiple rows of Anggota -->
                <div v-if="rIdx > 0" class="w-0.5 h-10 bg-slate-300 dark:bg-slate-600"></div>

                <!-- Row of Active Members (Max 5 cards per row) -->
                <div class="flex items-start justify-center">
                  <div
                    v-for="(m, idx) in row"
                    :key="m._id"
                    class="flex flex-col items-center relative px-2.5"
                  >
                    <!-- Top horizontal bar across Anggota cards in this row -->
                    <div
                      v-if="row.length > 1"
                      class="absolute top-0 h-0.5 bg-slate-300 dark:bg-slate-600"
                      :class="[
                        idx === 0 ? 'left-1/2 right-0' : '',
                        idx === row.length - 1 ? 'left-0 right-1/2' : '',
                        idx > 0 && idx < row.length - 1 ? 'left-0 right-0' : ''
                      ]"
                    ></div>
                    <!-- Drop line touching top of Anggota card -->
                    <div class="w-0.5 h-8 bg-slate-300 dark:bg-slate-600"></div>
                    <MemberCard :member="m" />
                  </div>
                </div>
              </template>
            </div>

            <!-- ============================================== -->
            <!-- LEVEL 5: ANGGOTA NON AKTIF & DEMISIONER        -->
            <!-- ============================================== -->
            <div v-if="anggotaNonAktifList.length > 0" class="flex flex-col items-center w-full mt-4">
              <!-- DOTTED VERTICAL CONNECTOR LINE (From Active members down to divider) -->
              <div class="w-0 h-10 border-l-2 border-dashed border-slate-400 dark:border-slate-500"></div>

              <!-- SECTION DIVIDER: ANGGOTA NON-AKTIF -->
              <div class="w-full max-w-3xl sm:max-w-4xl flex items-center gap-4 my-2 px-4">
                <div class="h-px bg-slate-300 dark:bg-slate-700/80 flex-1"></div>
                <span class="text-[11px] sm:text-xs font-mono font-semibold tracking-widest text-slate-500 dark:text-gray-400 uppercase whitespace-nowrap">
                  ANGGOTA NON-AKTIF
                </span>
                <div class="h-px bg-slate-300 dark:bg-slate-700/80 flex-1"></div>
              </div>

              <!-- DOTTED VERTICAL CONNECTOR LINE (From divider down to Non-Active cards) -->
              <div class="w-0 h-10 border-l-2 border-dashed border-slate-400 dark:border-slate-500"></div>

              <!-- DOTTED TREE SUB-BRANCH FOR NON-ACTIVE MEMBERS -->
              <div class="flex items-start justify-center">
                <div
                  v-for="(m, idx) in anggotaNonAktifList"
                  :key="m._id"
                  class="flex flex-col items-center relative px-3"
                >
                  <!-- Dotted horizontal line segment -->
                  <div
                    v-if="anggotaNonAktifList.length > 1"
                    class="absolute top-0 border-t-2 border-dashed border-slate-400 dark:border-slate-500"
                    :class="[
                      idx === 0 ? 'left-1/2 right-0' : '',
                      idx === anggotaNonAktifList.length - 1 ? 'left-0 right-1/2' : '',
                      idx > 0 && idx < anggotaNonAktifList.length - 1 ? 'left-0 right-0' : ''
                    ]"
                  ></div>
                  <!-- Dotted drop line touching top of non-active card -->
                  <div class="w-0 h-8 border-l-2 border-dashed border-slate-400 dark:border-slate-500"></div>
                  <MemberCard :member="m" :is-inactive="true" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
