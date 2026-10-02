<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import FluidHeroGradient from '../components/common/FluidHeroGradient.vue';
import api from '../utils/api';
import { formatDateShort } from '../utils/formatDate';
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Palette,
  Camera,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Lightbulb,
  Laptop,
  Coffee,
  Compass,
  Video,
  Megaphone,
  Play
} from 'lucide-vue-next';
import { defaultBlogs } from '../data/defaultBlogs';

const { t } = useI18n();
const featuredPortfolios = ref([]);
const latestEvents = ref([]);
const latestBlogs = ref([]);
const loading = ref(true);

const getCoverImage = (item) => {
  if (item.images && item.images[0]) return item.images[0];
  if (item.videoUrl) {
    const ytMatch = item.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  return '';
};

onMounted(async () => {
  try {
    const [portfolioRes, eventRes, blogRes] = await Promise.all([
      api.get('/portfolios?featured=true&limit=6'),
      api.get('/events?limit=3'),
      api.get('/blogs?limit=3'),
    ]);
    featuredPortfolios.value = portfolioRes.data.data;
    latestEvents.value = eventRes.data.data;
    if (blogRes.data?.data && blogRes.data.data.length > 0) {
      latestBlogs.value = blogRes.data.data;
    } else {
      latestBlogs.value = defaultBlogs.slice(0, 3);
    }
  } catch (e) {
    console.error(e);
    if (!latestBlogs.value || latestBlogs.value.length === 0) {
      latestBlogs.value = defaultBlogs.slice(0, 3);
    }
  } finally {
    loading.value = false;
  }
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
      <!-- Animated Fluid Wave Gradient (Neat / WebGL Flow) -->
      <FluidHeroGradient />

      <!-- Background Ambient Dots Grid with Radial Mask -->
      <div class="absolute inset-0 bg-grid-dots opacity-20 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"></div>

      <!-- Glowing Light Orbs -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-400/20 via-accent/20 to-royal/15 dark:from-sky/15 dark:via-accent/20 dark:to-royal/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Hero Header Center Column -->
        <div class="max-w-4xl mx-auto text-center">
          <!-- Massive Editorial Display Typography -->
          <h1 class="font-heading font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.1] sm:leading-[1.12] text-slate-900 dark:text-white mb-8 sm:mb-10">
            <span class="block sm:inline">Ideas Become</span>
            <span class="font-serif italic font-normal text-gradient-cyan inline-block pr-2.5 pl-0.5 sm:ml-2 sm:pr-4 sm:pl-1 sm:pb-2.5 sm:pt-0.5">Reality,</span><br class="hidden sm:inline" />
            <span class="block sm:inline mt-1 sm:mt-0">Visuals Become</span>
            <span class="relative inline-block text-slate-900 dark:text-white ml-2 sm:ml-3">
              Stories
              <span class="absolute -bottom-1.5 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-accent via-sky to-royal rounded-full"></span>
            </span>
          </h1>

          <!-- Call to Action Button -->
          <div class="flex items-center justify-center">
            <RouterLink to="/portfolio" class="btn-accent px-8 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-sky-500/20 group">
              <span>Eksplorasi Portofolio</span>
              <ArrowUpRight :size="18" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </RouterLink>
          </div>

          <!-- 4 Divisi Utama Quick Ribbon (Clean typography, no emojis) -->
          <div class="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-2 text-xs font-mono">
            <span class="text-slate-500 dark:text-gray-400 font-semibold sm:mr-1">4 Divisi Utama:</span>
            <div class="flex flex-wrap items-center justify-center gap-2 max-w-xs sm:max-w-none">
              <span class="px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium">
                Desain
              </span>
              <span class="px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium">
                Photography
              </span>
              <span class="px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium">
                Videography
              </span>
              <span class="px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium">
                Public Relation (PR)
              </span>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- 2. KENAPA HARUS GABUNG DKV? (Ramah Pemula & Santai)      -->
        <!-- ======================================================== -->
        <div class="mt-20 sm:mt-28 max-w-5xl mx-auto">
          <div class="text-center mb-10">
            <span class="inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1 rounded-full bg-sky-500/15 dark:bg-sky/15 text-sky-700 dark:text-sky border border-sky-500/30 dark:border-sky/30 uppercase tracking-widest font-semibold mb-3">
              <Lightbulb :size="13" />
              <span>Ramah Pemula & Anti-Minder</span>
            </span>
            <h2 class="font-heading font-black text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Kenapa Harus Gabung DKV?
            </h2>
            <p class="text-slate-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
              Kamu nggak perlu jago dulu buat gabung. Di sini tempatnya kita sama-sama mulai dari nol, saling bantu, dan berkembang bareng.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Card 1: Laptop -->
            <div class="glass-card p-6 sm:p-7 flex flex-col justify-between border-t-2 border-t-amber-400 hover:border-amber-400/60 transition-all duration-300 group">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                  <Laptop :size="24" />
                </div>
                <span class="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                  Nggak Punya Laptop Bagus?
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
                  Bisa Mulai dari Mana Saja
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                  Nggak masalah sama sekali! Banyak karya visual bisa dirintis pakai HP, atau belajar bareng gantian memakai laptop di sekretariat.
                </p>
              </div>
              <div class="pt-5 mt-5 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-gray-400">
                <span>Alat Bukan Halangan</span>
                <span class="text-amber-600 dark:text-amber-400 font-semibold">100% Terbuka</span>
              </div>
            </div>

            <!-- Card 2: Gambar -->
            <div class="glass-card p-6 sm:p-7 flex flex-col justify-between border-t-2 border-t-sky hover:border-sky/60 transition-all duration-300 group">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-sky-500/15 dark:bg-sky/15 border border-sky-500/30 dark:border-sky/30 flex items-center justify-center text-sky-600 dark:text-sky mb-5 group-hover:scale-110 transition-transform">
                  <Palette :size="24" />
                </div>
                <span class="text-xs font-mono text-sky-600 dark:text-sky font-semibold uppercase tracking-wider block mb-1">
                  Nggak Bisa Gambar?
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
                  DKV Itu Luas Banget
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                  Tenang! Desain komunikasi visual bukan cuma soal jago menggambar manual. Ada fotografi, tata letak tulisan (layout), susun paduan warna, dan ide cerita kreatif.
                </p>
              </div>
              <div class="pt-5 mt-5 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-gray-400">
                <span>Eksplorasi Minat</span>
                <span class="text-sky-600 dark:text-sky font-semibold">Bebas Berkarya</span>
              </div>
            </div>

            <!-- Card 3: Mentor Teman Sebaya -->
            <div class="glass-card p-6 sm:p-7 flex flex-col justify-between border-t-2 border-t-emerald-400 hover:border-emerald-400/60 transition-all duration-300 group">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                  <Users :size="24" />
                </div>
                <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  Mentor Teman Sebaya
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
                  Belajar Santai Bareng Teman
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                  Didampingi teman sebaya dan senior yang ramah tanpa takut dihakimi atau minder. Tanyakan apa saja, kita belajar bareng selangkah demi selangkah.
                </p>
              </div>
              <div class="pt-5 mt-5 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-gray-400">
                <span>Lingkungan Positif</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-semibold">Saling Rangkul</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 3. AKTIVITAS SERU DI DKV (Aktivitas Nyata Mahasiswa)     -->
    <!-- ======================================================== -->
    <section class="py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-12">
          <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky font-semibold block mb-2">
            ✦ KEGIATAN KITA SEHARI-HARI
          </span>
          <h2 class="section-title">
            Aktivitas Seru di DKV
          </h2>
          <p class="text-slate-600 dark:text-gray-400 text-base sm:text-lg mt-3">
            Bukan teori yang kaku atau tugas yang bikin pusing — ini kegiatan nyata dan santai yang biasa kami lakukan bareng teman-teman di kampus.
          </p>
        </div>

        <!-- 4 Grid Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Item 1: Belajar Bareng dari Nol -->
          <div class="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:border-sky-500/50 dark:hover:border-sky/50 transition-all duration-300">
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-12 h-12 rounded-2xl bg-sky-500/15 dark:bg-sky/15 border border-sky-500/30 dark:border-sky/30 flex items-center justify-center text-sky-600 dark:text-sky group-hover:scale-110 transition-transform">
                  <Laptop :size="24" />
                </div>
                <span class="text-xs font-mono text-slate-400 dark:text-gray-500 font-bold">01</span>
              </div>
              <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                Belajar Bareng dari Nol
              </h3>
              <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                Tidak perlu jago menggambar atau desain dulu, yang penting mau belajar bareng pakai laptop atau HP (Canva, Photoshop, Corel, dll).
              </p>
            </div>
            <div class="pt-5 mt-6 border-t border-slate-200 dark:border-white/[0.08]">
              <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 dark:bg-sky/10 text-sky-700 dark:text-sky border border-sky-500/20 dark:border-sky/20">
                Canva · Photoshop · Corel
              </span>
            </div>
          </div>

          <!-- Item 2: Hunting Foto & Dokumentasi -->
          <div class="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-300">
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Camera :size="24" />
                </div>
                <span class="text-xs font-mono text-slate-400 dark:text-gray-500 font-bold">02</span>
              </div>
              <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                Hunting Foto & Dokumentasi
              </h3>
              <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                Hunting foto santai di sekitar kampus dan keindahan alam Merangin, serta belajar mengabadikan momen kegiatan mahasiswa dengan sudut pandang menarik.
              </p>
            </div>
            <div class="pt-5 mt-6 border-t border-slate-200 dark:border-white/[0.08]">
              <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30">
                Outdoor · Alam Merangin
              </span>
            </div>
          </div>

          <!-- Item 3: Bikin Konten & Acara Kampus -->
          <div class="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300">
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 dark:bg-indigo-500/20 border border-indigo-500/30 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Palette :size="24" />
                </div>
                <span class="text-xs font-mono text-slate-400 dark:text-gray-500 font-bold">03</span>
              </div>
              <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                Bikin Konten & Acara Kampus
              </h3>
              <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                Membantu desain poster, spanduk, banner, dan materi visual untuk event kampus serta media sosial. Karyamu langsung dilihat banyak orang!
              </p>
            </div>
            <div class="pt-5 mt-6 border-t border-slate-200 dark:border-white/[0.08]">
              <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30">
                Poster Event · Feeds Medsos
              </span>
            </div>
          </div>

          <!-- Item 4: Teman Nongkrong Positif -->
          <div class="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:border-rose-500/50 dark:hover:border-rose-400/50 transition-all duration-300">
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-12 h-12 rounded-2xl bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30 dark:border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <Coffee :size="24" />
                </div>
                <span class="text-xs font-mono text-slate-400 dark:text-gray-500 font-bold">04</span>
              </div>
              <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                Teman Nongkrong Positif
              </h3>
              <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                Wadah kumpul santai yang produktif untuk saling tukar ilmu, ngobrol santai sambil ngopi, dan nambah teman akrab lintas fakultas.
              </p>
            </div>
            <div class="pt-5 mt-6 border-t border-slate-200 dark:border-white/[0.08]">
              <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30">
                Kumpul Santai · Lintas Fakultas
              </span>
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
        <!-- Section Header -->
        <div class="max-w-3xl mb-12">
          <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky font-semibold block mb-2">
            ✦ KARYA PILIHAN
          </span>
          <h2 class="section-title">{{ t('home.featured_portfolio') }}</h2>
          <p class="text-slate-600 dark:text-gray-400 text-base sm:text-lg mt-3">
            Kumpulan karya pilihan dan eksplorasi visual terbaik yang lahir dari kreativitas serta kolaborasi anggota DKV Universitas Merangin.
          </p>
        </div>

        <LoadingSpinner v-if="loading" />

        <!-- Cards Grid (Center-aligned) -->
        <div v-else class="flex flex-wrap justify-center gap-6">
          <RouterLink
            v-for="(item, idx) in featuredPortfolios"
            :key="item._id"
            :to="`/portfolio/${item._id}`"
            class="group glass-card overflow-hidden hover:border-sky-500/50 dark:hover:border-sky/50 transition-all duration-500 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm flex flex-col"
          >
            <!-- 16:10 Aspect Ratio Image Container -->
            <div class="aspect-[16/10] w-full bg-slate-100 dark:bg-[#050916] overflow-hidden relative shrink-0">
              <img
                v-if="getCoverImage(item)"
                :src="getCoverImage(item)"
                :alt="item.title"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-gray-500">
                <Palette :size="40" class="opacity-40" />
              </div>

              <!-- Video Badge on Top-Left if videoUrl -->
              <div v-if="item.videoUrl" class="absolute top-3 left-3 z-10">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/85 text-white border border-white/20 backdrop-blur-md shadow-md">
                  <Play :size="10" class="fill-sky-400 text-sky-400" />
                  <span>Video</span>
                </span>
              </div>

              <!-- Category Badge on Top-Right -->
              <div class="absolute top-3 right-3 z-10">
                <span class="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#070E22]/90 border border-slate-200 dark:border-white/15 text-sky-700 dark:text-sky font-semibold backdrop-blur-md shadow-sm">
                  {{ item.category }}
                </span>
              </div>
            </div>

            <!-- Card Bottom Bar with Swatch Palette (Inspomcp signature) -->
            <div class="p-5 flex items-center justify-between">
              <div class="space-y-1 min-w-0 pr-3">
                <h3 class="font-heading font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-gray-400 truncate">
                  Oleh <span class="text-slate-700 dark:text-gray-300 font-medium">{{ item.creator }}</span>
                </p>
              </div>

              <!-- Color Palette Dots Preview -->
              <div class="flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-white/[0.04] p-1.5 rounded-full border border-slate-200 dark:border-white/10">
                <span
                  v-for="(hex, pi) in samplePalettes[idx % samplePalettes.length]"
                  :key="pi"
                  class="w-2.5 h-2.5 rounded-full block border border-slate-300 dark:border-black/30"
                  :style="{ backgroundColor: hex }"
                ></span>
              </div>
            </div>
          </RouterLink>

          <!-- Empty State -->
          <div v-if="!loading && featuredPortfolios.length === 0" class="w-full glass-card p-12 text-center text-slate-500 dark:text-gray-400">
            <LayoutGrid :size="36" class="mx-auto text-slate-400 dark:text-gray-600 mb-3" />
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
    <section class="py-20 relative border-t border-slate-200 dark:border-white/[0.06]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky font-semibold block mb-2">
              ✦ AGENDA & ACARA
            </span>
            <h2 class="section-title">{{ t('home.latest_events') }}</h2>
          </div>
          <RouterLink to="/event" class="text-sky-600 dark:text-sky hover:underline text-sm font-semibold hidden sm:flex items-center gap-1">
            <span>{{ t('home.see_all') }}</span>
            <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <RouterLink
            v-for="event in latestEvents"
            :key="event._id"
            :to="`/event/${event._id}`"
            class="group glass-card p-6 flex flex-col justify-between hover:border-sky-500/50 dark:hover:border-sky/50 transition-all duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
          >
            <div>
              <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#050916] mb-5 border border-slate-200 dark:border-white/10 relative shrink-0">
                <img
                  v-if="event.poster"
                  :src="event.poster"
                  :alt="event.title"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-gray-600">
                  <Calendar :size="36" class="opacity-40" />
                </div>
                <div class="absolute top-2.5 left-2.5 z-10">
                  <span class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-[#070E22]/90 border border-slate-200 dark:border-white/15 text-sky-700 dark:text-sky font-semibold backdrop-blur-md shadow-sm">
                    {{ event.type }}
                  </span>
                </div>
              </div>

              <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky transition-colors mb-2 line-clamp-2">
                {{ event.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-gray-400 font-mono flex items-center gap-1.5">
                <Calendar :size="13" class="text-sky-600 dark:text-sky" />
                <span>{{ formatDateShort(event.date) }}</span>
              </p>
            </div>

            <div class="pt-5 mt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs">
              <span class="text-slate-500 dark:text-gray-400 truncate max-w-[180px]">📍 {{ event.location }}</span>
              <span class="text-sky-600 dark:text-sky font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Detail <ArrowRight :size="12" />
              </span>
            </div>
          </RouterLink>

          <div v-if="!loading && latestEvents.length === 0" class="w-full glass-card p-12 text-center text-slate-500 dark:text-gray-400">
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
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky font-semibold block mb-2">
              ✦ CATATAN & CERITA ANGGOTA
            </span>
            <h2 class="section-title">{{ t('home.latest_blogs') }}</h2>
            <p class="text-slate-600 dark:text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
              Tulisan santai, liputan kegiatan hunting, cerita seru kumpul bareng, dan pengalaman teman-teman DKV Merangin.
            </p>
          </div>
          <RouterLink to="/blog" class="text-sky-600 dark:text-sky hover:underline text-sm font-semibold flex items-center gap-1 self-start sm:self-auto">
            <span>{{ t('home.see_all') }}</span>
            <ArrowRight :size="14" />
          </RouterLink>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <RouterLink
            v-for="blog in latestBlogs"
            :key="blog._id"
            :to="`/blog/${blog.slug}`"
            class="group glass-card p-6 flex flex-col justify-between hover:border-sky-500/50 dark:hover:border-sky/50 transition-all duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
          >
            <div>
              <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#050916] mb-5 border border-slate-200 dark:border-white/10 relative shrink-0">
                <img
                  v-if="blog.thumbnail"
                  :src="blog.thumbnail"
                  :alt="blog.title"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-gray-600">
                  <FileText :size="36" class="opacity-40" />
                </div>
              </div>

              <h3 class="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky transition-colors line-clamp-2 mb-2">
                {{ blog.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-gray-400">
                Oleh <strong class="text-slate-700 dark:text-gray-300">{{ blog.author }}</strong> · {{ formatDateShort(blog.createdAt) }}
              </p>
            </div>

            <div class="pt-5 mt-4 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-xs text-sky-600 dark:text-sky font-semibold">
              <span>Baca Artikel</span>
              <ArrowRight :size="14" class="group-hover:translate-x-1 transition-transform" />
            </div>
          </RouterLink>

          <div v-if="!loading && latestBlogs.length === 0" class="w-full glass-card p-12 text-center text-slate-500 dark:text-gray-400">
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
        <div class="relative overflow-hidden rounded-3xl p-8 sm:p-14 border border-sky-400/30 bg-gradient-to-r from-sky-100/90 via-sky-50 to-indigo-100/90 dark:from-sky-950/70 dark:via-[#0A1329] dark:to-indigo-950/70 backdrop-blur-2xl shadow-lg dark:shadow-[0_0_60px_rgba(2,132,199,0.2)]">
          <!-- Background ambient light inside card -->
          <div class="absolute -top-20 -right-20 w-80 h-80 bg-sky/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative max-w-3xl space-y-6">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-800 dark:text-sky text-xs font-mono font-semibold border border-sky-500/40 dark:border-sky/40">
              <Sparkles :size="13" />
              <span>REGISTRASI ANGGOTA BARU</span>
            </span>

            <h2 class="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
              Siap Melangkah Menjadi Kreator Visual Berdampak?
            </h2>

            <p class="text-slate-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
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
