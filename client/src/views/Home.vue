<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { formatDateShort } from '../utils/formatDate';
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Palette,
  Layers,
  Video,
  Camera,
  Award,
  Users,
  Calendar,
  FileText,
  Compass,
  CheckCircle2,
  Flame,
  LayoutGrid
} from 'lucide-vue-next';

const { t } = useI18n();
const featuredPortfolios = ref([]);
const latestEvents = ref([]);
const latestBlogs = ref([]);
const loading = ref(true);
const activeFilter = ref('All');

const categories = ['All', 'Branding', 'Illustration', 'UI/UX', 'Photography', 'Motion'];

const activeHeroTab = ref(0);
const heroFeatures = [
  {
    tag: 'Branding',
    title: 'Visual Identity System',
    desc: 'Perancangan identitas visual kohesif, filosofis, dan berdaya saing industri.',
    colors: ['#0A1329', '#0284C7', '#38BDF8', '#F0F9FF'],
    badge: 'Logo & Typography',
  },
  {
    tag: 'UI/UX',
    title: 'Digital Experience',
    desc: 'Arsitektur informasi, wireframing interaktif, dan prototyping antarmuka modern.',
    colors: ['#030712', '#2563EB', '#60A5FA', '#DBEAFE'],
    badge: 'Figma & Prototype',
  },
  {
    tag: 'Motion',
    title: 'Motion & 3D Story',
    desc: 'Animasi kinetik, visual storytelling dinamis, dan komposisi 3D photorealistic.',
    colors: ['#0F172A', '#818CF8', '#C084FC', '#FAF5FF'],
    badge: '60 FPS · Cinema 4D',
  },
  {
    tag: 'Editorial',
    title: 'Photography & Art',
    desc: 'Eksplorasi visual framing, pencahayaan dramatis, dan komposisi editorial magazine.',
    colors: ['#18181B', '#F59E0B', '#FDE68A', '#FEF3C7'],
    badge: 'RAW · Editorial',
  }
];

onMounted(async () => {
  try {
    const [portfolioRes, eventRes, blogRes] = await Promise.all([
      api.get('/portfolios?featured=true&limit=6'),
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

const filteredPortfolios = computed(() => {
  if (activeFilter.value === 'All') return featuredPortfolios.value;
  return featuredPortfolios.value.filter(item => item.category === activeFilter.value);
});

// Color palettes for showcase cards (Inspomcp signature detail)
const samplePalettes = [
  ['#0284C7', '#38BDF8', '#0A1329', '#E0F2FE'],
  ['#8B5CF6', '#C084FC', '#1E1B4B', '#F3E8FF'],
  ['#06B6D4', '#22D3EE', '#083344', '#ECFEFF'],
  ['#F43F5E', '#FB7185', '#4C0519', '#FFE4E6'],
  ['#10B981', '#34D399', '#064E3B', '#D1FAE5'],
  ['#F59E0B', '#FBBF24', '#451A03', '#FEF3C7'],
];
</script>

<template>
  <PublicLayout>
    <!-- ======================================================== -->
    <!-- 1. HERO SECTION (GSAP / Inspomcp Style)                   -->
    <!-- ======================================================== -->
    <section class="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
      <!-- Background Ambient Dots Grid with Radial Mask -->
      <div class="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"></div>

      <!-- Glowing Light Orbs -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky/20 via-accent/25 to-royal/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Hero Header Center Column -->
        <div class="max-w-4xl mx-auto text-center">
          <!-- Live Admission Pill Badge -->
          <RouterLink
            to="/camavis"
            class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky/40 backdrop-blur-xl mb-8 group transition-all duration-300"
          >
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-sky"></span>
            </span>
            <span class="text-xs font-mono text-gray-300 tracking-wide">Penerimaan Anggota Baru (CAMAVIS)</span>
            <span class="text-xs text-sky font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Daftar <ArrowRight :size="12" />
            </span>
          </RouterLink>

          <!-- Massive Editorial Display Typography -->
          <h1 class="font-heading font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.03] text-white mb-6">
            Ideas Become
            <span class="font-serif italic font-normal text-gradient-cyan block sm:inline">Reality</span>,<br />
            Visuals Become
            <span class="relative inline-block text-white">
              Stories
              <span class="absolute -bottom-1.5 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-accent via-sky to-royal rounded-full"></span>
            </span>
          </h1>

          <!-- High Contrast Subtitle -->
          <p class="text-gray-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
            Unit Kegiatan Mahasiswa Desain Komunikasi Visual Universitas Merangin.
            Ruang eksplorasi tanpa batas untuk kreator visual, desainer identitas, dan perancang masa depan.
          </p>

          <!-- Dual Call to Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RouterLink to="/portfolio" class="btn-accent px-8 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-sky-500/20 group">
              <span>Eksplorasi Portofolio</span>
              <ArrowUpRight :size="18" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </RouterLink>

            <RouterLink to="/camavis" class="btn-glass px-8 py-3.5 text-sm sm:text-base font-semibold group">
              <Sparkles :size="16" class="text-sky" />
              <span>Gabung CAMAVIS</span>
              <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- Interactive 4-Pillars Creative Showcase Deck (Inspomcp)  -->
        <!-- ======================================================== -->
        <div class="mt-16 sm:mt-24 max-w-5xl mx-auto">
          <!-- Showcase Header Tabs -->
          <div class="flex items-center justify-between gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
            <div class="flex items-center gap-2 mx-auto bg-[#070E22]/90 border border-white/10 rounded-full p-1.5 backdrop-blur-xl">
              <button
                v-for="(feat, idx) in heroFeatures"
                :key="feat.tag"
                @click="activeHeroTab = idx"
                class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5"
                :class="activeHeroTab === idx
                  ? 'bg-gradient-to-r from-accent to-sky text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'"
              >
                <span>{{ feat.tag }}</span>
              </button>
            </div>
          </div>

          <!-- Active Showcase Glass Display Card -->
          <div class="glass-card p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-[#09122A]/90 via-[#070D1E]/95 to-[#060A18]/90">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <!-- Left description (5 cols) -->
              <div class="lg:col-span-5 space-y-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-sky/15 text-sky border border-sky/30">
                  <Flame :size="13" />
                  <span>{{ heroFeatures[activeHeroTab].badge }}</span>
                </span>
                <h3 class="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {{ heroFeatures[activeHeroTab].title }}
                </h3>
                <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {{ heroFeatures[activeHeroTab].desc }}
                </p>

                <!-- Color Palette Swatches (Inspomcp Signature) -->
                <div class="pt-2">
                  <span class="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">Color DNA:</span>
                  <div class="flex items-center gap-2">
                    <span
                      v-for="(hex, ci) in heroFeatures[activeHeroTab].colors"
                      :key="ci"
                      class="h-6 w-12 rounded-lg border border-white/15 shadow-sm transition-transform hover:scale-110 flex items-center justify-center text-[9px] font-mono text-white/80"
                      :style="{ backgroundColor: hex }"
                      :title="hex"
                    >
                      {{ hex.slice(1, 4) }}
                    </span>
                  </div>
                </div>

                <div class="pt-2">
                  <RouterLink to="/portfolio" class="inline-flex items-center gap-1 text-xs font-semibold text-sky hover:underline">
                    <span>Lihat showcase kategori ini</span>
                    <ArrowRight :size="13" />
                  </RouterLink>
                </div>
              </div>

              <!-- Right Interactive Visual Preview (7 cols) -->
              <div class="lg:col-span-7">
                <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-[#050916] aspect-[16/10] p-6 flex flex-col justify-between group shadow-2xl">
                  <!-- Top Bar Mockup -->
                  <div class="flex items-center justify-between border-b border-white/10 pb-3">
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <span class="text-[11px] font-mono text-gray-500">dkv.merangin.ac.id/showcase/{{ heroFeatures[activeHeroTab].tag.toLowerCase() }}</span>
                    <span class="text-[11px] font-mono text-sky">ACTIVE</span>
                  </div>

                  <!-- Middle Visual Artwork Preview -->
                  <div class="my-auto py-6 flex flex-col items-center justify-center text-center">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-sky flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(56,189,248,0.5)] transform group-hover:scale-110 transition-transform duration-500">
                      <Palette v-if="activeHeroTab === 0" :size="30" />
                      <Layers v-else-if="activeHeroTab === 1" :size="30" />
                      <Video v-else-if="activeHeroTab === 2" :size="30" />
                      <Camera v-else :size="30" />
                    </div>
                    <h4 class="font-heading font-black text-xl text-white tracking-wide">
                      {{ heroFeatures[activeHeroTab].title }}
                    </h4>
                    <p class="text-xs text-gray-400 max-w-sm mt-1">
                      Karya original mahasiswa DKV Universitas Merangin berstandar kurasi industri visual.
                    </p>
                  </div>

                  <!-- Bottom Detail Ribbon -->
                  <div class="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-400 font-mono">
                    <span>STATUS: FEATURED</span>
                    <span class="text-sky font-semibold">UKM DKV CREATIVE DECK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- 2. STUDIO METRICS RIBBON (Inspomcp / GSAP Counter)       -->
        <!-- ======================================================== -->
        <div class="mt-16 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="glass-card p-5 text-center border-t-2 border-t-sky group">
            <div class="text-3xl sm:text-4xl font-black font-heading text-white group-hover:text-sky transition-colors">
              50+
            </div>
            <div class="text-xs text-gray-400 font-medium mt-1">Kreator & Desainer Aktif</div>
          </div>

          <div class="glass-card p-5 text-center border-t-2 border-t-accent group">
            <div class="text-3xl sm:text-4xl font-black font-heading text-white group-hover:text-sky transition-colors">
              100+
            </div>
            <div class="text-xs text-gray-400 font-medium mt-1">Portofolio Visual Terkurasi</div>
          </div>

          <div class="glass-card p-5 text-center border-t-2 border-t-royal group">
            <div class="text-3xl sm:text-4xl font-black font-heading text-white group-hover:text-sky transition-colors">
              20+
            </div>
            <div class="text-xs text-gray-400 font-medium mt-1">Workshop & Pameran Desain</div>
          </div>

          <div class="glass-card p-5 text-center border-t-2 border-t-cyan-400 group">
            <div class="text-3xl sm:text-4xl font-black font-heading text-white group-hover:text-sky transition-colors">
              5+
            </div>
            <div class="text-xs text-gray-400 font-medium mt-1">Penghargaan Karya Visual</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 3. BENTO GRID: 4 PILAR KREATIF (GSAP / NeedMCP style)    -->
    <!-- ======================================================== -->
    <section class="py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-12">
          <span class="text-xs font-mono uppercase tracking-widest text-sky font-semibold block mb-2">
            ✦ DISIPLIN VISUAL KREATIF
          </span>
          <h2 class="section-title">
            Fokus Eksplorasi Karya di DKV
          </h2>
          <p class="text-gray-400 text-base sm:text-lg mt-3">
            Setiap anggota diarahkan untuk menguasai kompetensi visual mendalam sesuai minat dan potensi industri masa depan.
          </p>
        </div>

        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Bento Card 1 (Wide 2 Cols) -->
          <div class="md:col-span-2 glass-card p-8 sm:p-10 flex flex-col justify-between group">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-sky/15 border border-sky/30 flex items-center justify-center text-sky mb-6 group-hover:scale-110 transition-transform">
                <Palette :size="24" />
              </div>
              <span class="text-xs font-mono text-sky uppercase tracking-wider">Identitas Visual</span>
              <h3 class="font-heading font-black text-2xl sm:text-3xl text-white mt-1 mb-3">
                Branding & Typography Design
              </h3>
              <p class="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Menciptakan narasi merek melalui sistem visual utuh: tipografi khusus, logo adaptif, panduan identitas (brand guideline), hingga kemasan produk yang memikat pasar.
              </p>
            </div>
            <div class="pt-8 flex items-center justify-between border-t border-white/[0.08] mt-6">
              <span class="text-xs font-mono text-gray-400">01 / BRAND IDENTITY</span>
              <RouterLink to="/portfolio" class="text-xs font-semibold text-sky hover:underline flex items-center gap-1">
                Eksplorasi Karya <ArrowUpRight :size="13" />
              </RouterLink>
            </div>
          </div>

          <!-- Bento Card 2 (1 Col) -->
          <div class="glass-card p-8 flex flex-col justify-between group">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-royal/20 border border-royal/40 flex items-center justify-center text-sky mb-6 group-hover:scale-110 transition-transform">
                <Layers :size="24" />
              </div>
              <span class="text-xs font-mono text-sky uppercase tracking-wider">Digital Product</span>
              <h3 class="font-heading font-black text-2xl text-white mt-1 mb-3">
                UI/UX Design
              </h3>
              <p class="text-gray-300 text-sm leading-relaxed">
                Riset perilaku pengguna, wireframing, dan desain antarmuka aplikasi web & mobile modern yang fungsional dan intuitif.
              </p>
            </div>
            <div class="pt-8 flex items-center justify-between border-t border-white/[0.08] mt-6">
              <span class="text-xs font-mono text-gray-400">02 / INTERACTION</span>
              <RouterLink to="/portfolio" class="text-xs font-semibold text-sky hover:underline flex items-center gap-1">
                Lihat UI <ArrowUpRight :size="13" />
              </RouterLink>
            </div>
          </div>

          <!-- Bento Card 3 (1 Col) -->
          <div class="glass-card p-8 flex flex-col justify-between group">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-sky mb-6 group-hover:scale-110 transition-transform">
                <Video :size="24" />
              </div>
              <span class="text-xs font-mono text-sky uppercase tracking-wider">Visual in Motion</span>
              <h3 class="font-heading font-black text-2xl text-white mt-1 mb-3">
                Motion & Videografi
              </h3>
              <p class="text-gray-300 text-sm leading-relaxed">
                Eksplorasi animasi 2D/3D, motion graphic untuk periklanan, sinematografi kampus, serta video pendek berstandar profesional.
              </p>
            </div>
            <div class="pt-8 flex items-center justify-between border-t border-white/[0.08] mt-6">
              <span class="text-xs font-mono text-gray-400">03 / MOTION</span>
              <RouterLink to="/portfolio" class="text-xs font-semibold text-sky hover:underline flex items-center gap-1">
                Lihat Motion <ArrowUpRight :size="13" />
              </RouterLink>
            </div>
          </div>

          <!-- Bento Card 4 (Wide 2 Cols) -->
          <div class="md:col-span-2 glass-card p-8 sm:p-10 flex flex-col justify-between group">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-sky mb-6 group-hover:scale-110 transition-transform">
                <Camera :size="24" />
              </div>
              <span class="text-xs font-mono text-sky uppercase tracking-wider">Art & Photography</span>
              <h3 class="font-heading font-black text-2xl sm:text-3xl text-white mt-1 mb-3">
                Creative Photography & Digital Illustration
              </h3>
              <p class="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Penguasaan framing lensa, portrait studio, jurnalistik visual, serta seni lukis digital (digital painting) untuk pameran tahunan.
              </p>
            </div>
            <div class="pt-8 flex items-center justify-between border-t border-white/[0.08] mt-6">
              <span class="text-xs font-mono text-gray-400">04 / ART & PHOTO</span>
              <RouterLink to="/portfolio" class="text-xs font-semibold text-sky hover:underline flex items-center gap-1">
                Eksplorasi Seni <ArrowUpRight :size="13" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 4. CURATED SHOWCASE (Inspomcp.dev Card Grid)             -->
    <!-- ======================================================== -->
    <section class="py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header with Category Tabs -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky font-semibold block mb-2">
              ✦ KARYA PILIHAN
            </span>
            <h2 class="section-title">{{ t('home.featured_portfolio') }}</h2>
          </div>

          <!-- Category Pill Filters (Inspomcp style) -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-[#070E22] p-1.5 rounded-full border border-white/10">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeFilter = cat"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap"
              :class="activeFilter === cat
                ? 'bg-sky/20 text-sky border border-sky/40 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'"
            >
              {{ cat === 'All' ? 'Semua' : cat }}
            </button>
          </div>
        </div>

        <LoadingSpinner v-if="loading" />

        <!-- Cards Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="(item, idx) in filteredPortfolios"
            :key="item._id"
            :to="`/portfolio/${item._id}`"
            class="group glass-card overflow-hidden hover:border-sky/50 transition-all duration-500"
          >
            <!-- 16:10 Aspect Ratio Image Container -->
            <div class="aspect-[16/10] bg-[#050916] overflow-hidden relative">
              <img
                v-if="item.images && item.images[0]"
                :src="item.images[0]"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                <Palette :size="40" class="opacity-40" />
              </div>

              <!-- Category Badge on Top-Right -->
              <div class="absolute top-3 right-3">
                <span class="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#070E22]/90 border border-white/15 text-sky font-semibold backdrop-blur-md">
                  {{ item.category }}
                </span>
              </div>
            </div>

            <!-- Card Bottom Bar with Swatch Palette (Inspomcp signature) -->
            <div class="p-5 flex items-center justify-between">
              <div class="space-y-1 min-w-0 pr-3">
                <h3 class="font-heading font-bold text-base text-white truncate group-hover:text-sky transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-gray-400 truncate">
                  Oleh <span class="text-gray-300 font-medium">{{ item.creator }}</span>
                </p>
              </div>

              <!-- Color Palette Dots Preview -->
              <div class="flex items-center gap-1 shrink-0 bg-white/[0.04] p-1.5 rounded-full border border-white/10">
                <span
                  v-for="(hex, pi) in samplePalettes[idx % samplePalettes.length]"
                  :key="pi"
                  class="w-2.5 h-2.5 rounded-full block border border-black/30"
                  :style="{ backgroundColor: hex }"
                ></span>
              </div>
            </div>
          </RouterLink>

          <!-- Empty State -->
          <div v-if="!loading && filteredPortfolios.length === 0" class="col-span-full glass-card p-12 text-center text-gray-400">
            <LayoutGrid :size="36" class="mx-auto text-gray-600 mb-3" />
            <p>{{ t('portfolio.no_data') }}</p>
          </div>
        </div>

        <!-- See All Link -->
        <div class="mt-12 text-center">
          <RouterLink to="/portfolio" class="btn-glass px-8 py-3 text-sm font-semibold">
            <span>Lihat Semua Koleksi Portofolio ({{ featuredPortfolios.length }}+)</span>
            <ArrowRight :size="15" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 5. WORKSHOP & EVENT PASSES                               -->
    <!-- ======================================================== -->
    <section class="py-20 relative border-t border-white/[0.06]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky font-semibold block mb-2">
              ✦ AGENDA & WORKSHOP
            </span>
            <h2 class="section-title">{{ t('home.latest_events') }}</h2>
          </div>
          <RouterLink to="/event" class="text-sky hover:underline text-sm font-semibold hidden sm:flex items-center gap-1">
            <span>{{ t('home.see_all') }}</span>
            <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="event in latestEvents"
            :key="event._id"
            :to="`/event/${event._id}`"
            class="group glass-card p-6 flex flex-col justify-between hover:border-sky/50 transition-all duration-300"
          >
            <div>
              <div class="aspect-video rounded-2xl overflow-hidden bg-[#050916] mb-5 border border-white/10 relative">
                <img
                  v-if="event.poster"
                  :src="event.poster"
                  :alt="event.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                  <Calendar :size="36" class="opacity-40" />
                </div>
                <div class="absolute top-2.5 left-2.5">
                  <span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#070E22]/90 border border-white/15 text-sky font-semibold backdrop-blur-md">
                    {{ event.type }}
                  </span>
                </div>
              </div>

              <h3 class="font-heading font-bold text-lg text-white group-hover:text-sky transition-colors mb-2 line-clamp-2">
                {{ event.title }}
              </h3>
              <p class="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                <Calendar :size="13" class="text-sky" />
                <span>{{ formatDateShort(event.date) }}</span>
              </p>
            </div>

            <div class="pt-5 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span class="text-gray-400 truncate max-w-[180px]">📍 {{ event.location }}</span>
              <span class="text-sky font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Detail <ArrowRight :size="12" />
              </span>
            </div>
          </RouterLink>

          <div v-if="!loading && latestEvents.length === 0" class="col-span-3 glass-card p-12 text-center text-gray-400">
            {{ t('event.no_data') }}
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 6. EDITORIAL JOURNAL / BLOG                              -->
    <!-- ======================================================== -->
    <section class="py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky font-semibold block mb-2">
              ✦ JURNAL & INSPIRASI
            </span>
            <h2 class="section-title">{{ t('home.latest_blogs') }}</h2>
          </div>
          <RouterLink to="/blog" class="text-sky hover:underline text-sm font-semibold hidden sm:flex items-center gap-1">
            <span>{{ t('home.see_all') }}</span>
            <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="blog in latestBlogs"
            :key="blog._id"
            :to="`/blog/${blog.slug}`"
            class="group glass-card p-6 flex flex-col justify-between hover:border-sky/50 transition-all duration-300"
          >
            <div>
              <div class="aspect-video rounded-2xl overflow-hidden bg-[#050916] mb-5 border border-white/10">
                <img
                  v-if="blog.thumbnail"
                  :src="blog.thumbnail"
                  :alt="blog.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                  <FileText :size="36" class="opacity-40" />
                </div>
              </div>

              <h3 class="font-heading font-bold text-lg text-white group-hover:text-sky transition-colors line-clamp-2 mb-2">
                {{ blog.title }}
              </h3>
              <p class="text-xs text-gray-400">
                Oleh <strong class="text-gray-300">{{ blog.author }}</strong> · {{ formatDateShort(blog.createdAt) }}
              </p>
            </div>

            <div class="pt-5 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-sky font-semibold">
              <span>Baca Artikel</span>
              <ArrowRight :size="14" class="group-hover:translate-x-1 transition-transform" />
            </div>
          </RouterLink>

          <div v-if="!loading && latestBlogs.length === 0" class="col-span-3 glass-card p-12 text-center text-gray-400">
            {{ t('blog.no_data') }}
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 7. JOIN CAMAVIS HIGH-ENERGY CTA BANNER (Inspomcp / GSAP) -->
    <!-- ======================================================== -->
    <section class="py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-sky-400/30 bg-gradient-to-r from-sky-950/70 via-[#0A1329] to-indigo-950/70 backdrop-blur-2xl shadow-[0_0_60px_rgba(2,132,199,0.2)]">
          <!-- Background ambient light inside card -->
          <div class="absolute -top-20 -right-20 w-80 h-80 bg-sky/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative max-w-3xl space-y-6">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky/20 text-sky text-xs font-mono font-semibold border border-sky/40">
              <Sparkles :size="13" />
              <span>REGISTRASI ANGGOTA BARU</span>
            </span>

            <h2 class="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Siap Melangkah Menjadi Kreator Visual Berdampak?
            </h2>

            <p class="text-gray-300 text-base sm:text-lg leading-relaxed">
              Bergabunglah dengan keluarga besar DKV Universitas Merangin. Dapatkan mentorship langsung, akses workshop eksklusif, dan wujudkan portofolio kreatif kelas industri.
            </p>

            <div class="flex flex-wrap items-center gap-4 pt-2">
              <RouterLink
                to="/camavis"
                class="btn-accent px-8 py-3.5 text-base font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] group"
              >
                <span>Daftar Sekarang — Formulir Terbuka</span>
                <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
              </RouterLink>

              <RouterLink
                to="/about"
                class="btn-glass px-6 py-3.5 text-sm font-semibold"
              >
                <span>Pelajari Visi & Misi DKV</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
