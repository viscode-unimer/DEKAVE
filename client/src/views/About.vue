<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import { Compass, Sparkles, Target, Rocket, Award, Users, Palette, Calendar, Camera, Video, Megaphone } from 'lucide-vue-next';

const { t, tm } = useI18n();

const missionItems = computed(() => {
  const items = tm('about.mission_items');
  if (Array.isArray(items) && items.length > 0) return items;
  return [
    'Membangun unit kegiatan yang aktif dan kolaboratif untuk saling berbagi ilmu serta pengalaman di bidang DKV.',
    'Meningkatkan kualitas serta daya saing anggota melalui kompetisi, pameran, dan proyek kreatif.',
    'Menjalin kerja sama dengan pihak eksternal, termasuk industri kreatif, untuk membuka peluang magang dan proyek bersama.',
    'Mendorong inovasi dan eksplorasi desain yang tidak hanya estetis, tetapi juga memiliki nilai komunikasi yang kuat.',
    'Menjadi wadah bagi mahasiswa untuk menyalurkan minat dan bakat di bidang desain grafis, animasi, fotografi, videografi dan media interaktif.'
  ];
});
</script>

<template>
  <PublicLayout>
    <!-- Hero Section -->
    <section class="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Logo Showcase -->
        <div class="flex justify-center mb-6">
          <div class="inline-flex items-center justify-center p-4 sm:p-5 rounded-3xl bg-slate-200/60 dark:bg-white/[0.04] border border-slate-300/80 dark:border-white/10 backdrop-blur-xl shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src="/logo-dkv-biru.png"
              alt="Logo DKV"
              class="h-16 sm:h-20 w-auto object-contain dark:hidden"
            />
            <img
              src="/logo-dkv-putih.png"
              alt="Logo DKV"
              class="h-16 sm:h-20 w-auto object-contain hidden dark:block drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]"
            />
          </div>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <Sparkles :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>DKV PHILOSOPHY & IDENTITY</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('about.title') }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('about.subtitle') }}
        </p>
      </div>
    </section>

    <!-- About Content -->
    <section class="py-16 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div class="lg:col-span-7">
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 font-semibold mb-2 block">
              // WHO WE ARE
            </span>
            <h2 class="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Mengenal DKV Universitas Merangin
            </h2>
            <p class="text-slate-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg mb-4">
              {{ t('about.desc') }}
            </p>
            <p class="text-slate-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base mb-8">
              Di UKM DKV, kami bergerak bersama dalam 4 divisi spesialisasi: <strong class="text-sky-600 dark:text-sky font-semibold">Desain</strong>, <strong class="text-amber-600 dark:text-amber-400 font-semibold">Photography</strong>, <strong class="text-indigo-600 dark:text-indigo-400 font-semibold">Videography</strong>, dan <strong class="text-emerald-600 dark:text-emerald-400 font-semibold">Public Relation (PR)</strong>. Setiap divisi saling berkolaborasi dari tahap ide, produksi visual, hingga publikasi ke audiens kampus dan masyarakat luas.
            </p>
            <div class="glass-card rounded-2xl p-6 border-l-4 border-l-cyan-500 relative overflow-hidden">
              <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
              <p class="italic text-cyan-800 dark:text-cyan-200 font-medium text-lg leading-snug">
                "Ideas Become Reality, Visuals Become Stories"
              </p>
              <span class="text-xs text-slate-500 dark:text-gray-400 font-mono mt-2 block">Creative Studio Motto — DKV</span>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="glass-card rounded-3xl p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-48 h-48 bg-royal/20 rounded-full blur-3xl pointer-events-none"></div>
              <h3 class="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                <Compass :size="14" class="text-cyan-600 dark:text-cyan-400" />
                <span>STUDIO ECOSYSTEM</span>
              </h3>
              <div class="grid grid-cols-2 gap-6">
                <div class="p-4 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                  <div class="text-3xl sm:text-4xl font-bold text-sky-600 dark:text-cyan-400 font-heading">50+</div>
                  <div class="text-xs sm:text-sm text-slate-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
                    <Users :size="14" class="text-sky-600 dark:text-cyan-400/80" />
                    <span>Anggota Aktif</span>
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                  <div class="text-3xl sm:text-4xl font-bold text-sky-600 dark:text-sky font-heading">100+</div>
                  <div class="text-xs sm:text-sm text-slate-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
                    <Palette :size="14" class="text-sky-600 dark:text-sky/80" />
                    <span>Karya Kreatif</span>
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                  <div class="text-3xl sm:text-4xl font-bold text-cyan-600 dark:text-cyan-300 font-heading">20+</div>
                  <div class="text-xs sm:text-sm text-slate-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
                    <Calendar :size="14" class="text-cyan-600 dark:text-cyan-300/80" />
                    <span>Workshop & Event</span>
                  </div>
                </div>
                <div class="p-4 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                  <div class="text-3xl sm:text-4xl font-bold text-amber-500 dark:text-amber-300 font-heading">5+</div>
                  <div class="text-xs sm:text-sm text-slate-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
                    <Award :size="14" class="text-amber-500 dark:text-amber-300/80" />
                    <span>Prestasi Visual</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vision & Mission Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <!-- Vision -->
          <div class="glass-card rounded-3xl p-8 border border-cyan-500/20 dark:border-cyan-400/20 relative group hover:border-cyan-500/40 dark:hover:border-cyan-400/40 transition-all duration-300">
            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-400/30 flex items-center justify-center text-cyan-700 dark:text-cyan-300 mb-6">
              <Target :size="24" />
            </div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 font-semibold mb-2 block">
              // DIRECTION
            </span>
            <h3 class="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">{{ t('about.vision') }}</h3>
            <p class="text-slate-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
              {{ t('about.vision_text') }}
            </p>
          </div>

          <!-- Mission -->
          <div class="glass-card rounded-3xl p-8 border border-royal/20 dark:border-royal/30 relative group hover:border-sky-500/40 dark:hover:border-sky/40 transition-all duration-300">
            <div class="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-royal/20 border border-royal/30 dark:border-sky/30 flex items-center justify-center text-royal dark:text-sky mb-6">
              <Rocket :size="24" />
            </div>
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-sky font-semibold mb-2 block">
              // PILLARS OF ACTION
            </span>
            <h3 class="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-4">{{ t('about.mission') }}</h3>
            <ul class="space-y-4">
              <li
                v-for="(item, i) in missionItems"
                :key="i"
                class="flex items-start gap-3.5 text-slate-700 dark:text-gray-300"
              >
                <span class="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-300 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  0{{ i + 1 }}
                </span>
                <span class="text-sm sm:text-base leading-relaxed">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- 4 DIVISI UTAMA DKV                                       -->
        <!-- ======================================================== -->
        <div class="pt-8 border-t border-slate-200 dark:border-white/10">
          <div class="text-center max-w-3xl mx-auto mb-12">
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 font-semibold mb-2 block">
              // STRUKTUR KREATIF & KELUARGA BESAR
            </span>
            <h2 class="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              4 Divisi Utama DKV
            </h2>
            <p class="text-slate-600 dark:text-gray-400 text-sm sm:text-base mt-3 leading-relaxed">
              Untuk mengasah minat dan bakat setiap anggota secara terarah, DKV terbagi ke dalam empat divisi utama yang saling bersinergi dalam setiap karya dan kegiatan.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Divisi Desain -->
            <div class="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between group hover:border-sky-500/50 dark:hover:border-sky-400/50 transition-all duration-300">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-sky-500/15 dark:bg-sky/15 border border-sky-500/30 dark:border-sky/30 flex items-center justify-center text-sky-600 dark:text-sky mb-5 group-hover:scale-110 transition-transform">
                  <Palette :size="24" />
                </div>
                <span class="text-xs font-mono text-sky-600 dark:text-sky font-semibold uppercase tracking-wider block mb-1">
                  Divisi 01
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                  Desain
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Wadah perancangan grafis, ilustrasi, pembuatan poster/spanduk acara kampus, feeds media sosial, hingga identitas visual dan tipografi.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 dark:bg-sky/10 text-sky-700 dark:text-sky border border-sky-500/20 dark:border-sky/20 block text-center">
                  Poster · Branding · Ilustrasi
                </span>
              </div>
            </div>

            <!-- Divisi Photography -->
            <div class="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between group hover:border-amber-500/50 dark:hover:border-amber-400/50 transition-all duration-300">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                  <Camera :size="24" />
                </div>
                <span class="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                  Divisi 02
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                  Photography
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Eksplorasi teknik kamera & lensa, komposisi framing, pencahayaan, hunting foto santai alam Merangin, serta dokumentasi visual momen berharga mahasiswa.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 block text-center">
                  Hunting Foto · Framing · Dokumentasi
                </span>
              </div>
            </div>

            <!-- Divisi Videography -->
            <div class="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between group hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 dark:bg-indigo-500/20 border border-indigo-500/30 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                  <Video :size="24" />
                </div>
                <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
                  Divisi 03
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                  Videography
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Produksi konten video kreatif, sinematografi kampus, pembuatan short video/reels, liputan aftermovie event, dan penguasaan teknik editing video dinamis.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 block text-center">
                  Sinematik · Reels · Editing Video
                </span>
              </div>
            </div>

            <!-- Divisi Public Relation (PR) -->
            <div class="glass-card rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between group hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-all duration-300">
              <div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                  <Megaphone :size="24" />
                </div>
                <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  Divisi 04
                </span>
                <h3 class="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5">
                  Public Relation (PR)
                </h3>
                <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  Jembatan komunikasi UKM ke pihak luar, pengelolaan media sosial, hubungan masyarakat, kemitraan acara, publikasi karya anggota, dan relasi lintas fakultas.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-200 dark:border-white/[0.08]">
                <span class="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 block text-center">
                  Humas · Media Sosial · Kemitraan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
