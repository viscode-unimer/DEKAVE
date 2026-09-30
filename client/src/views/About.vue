<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import { Compass, Sparkles, Target, Rocket, Award, Users, Palette, Calendar } from 'lucide-vue-next';

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
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <Sparkles :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>DEKAVE PHILOSOPHY & IDENTITY</span>
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
            <p class="text-slate-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg mb-8">
              {{ t('about.desc') }}
            </p>
            <div class="glass-card rounded-2xl p-6 border-l-4 border-l-cyan-500 relative overflow-hidden">
              <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
              <p class="italic text-cyan-800 dark:text-cyan-200 font-medium text-lg leading-snug">
                "Ideas Become Reality, Visuals Become Stories"
              </p>
              <span class="text-xs text-slate-500 dark:text-gray-400 font-mono mt-2 block">Creative Studio Motto — DEKAVE</span>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </div>
    </section>
  </PublicLayout>
</template>
