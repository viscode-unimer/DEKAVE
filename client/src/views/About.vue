<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';

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
    <!-- Hero -->
    <section class="py-24 bg-gradient-to-br from-primary to-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('about.title') }}</h1>
        <p class="text-gray-300 text-xl">{{ t('about.subtitle') }}</p>
      </div>
    </section>

    <!-- About Content -->
    <section class="py-20 bg-white dark:bg-primary">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 class="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-6">Mengenal DKV</h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{{ t('about.desc') }}</p>
            <div class="mt-6 p-4 border-l-4 border-accent bg-accent/5 rounded-r-lg">
              <p class="italic text-accent font-semibold text-lg">"Ideas Become Reality, Visuals Become Stories"</p>
            </div>
          </div>
          <div class="bg-gradient-to-br from-secondary to-surface rounded-3xl p-8 text-white shadow-xl border border-blue-900/40">
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-4xl font-bold text-sky font-heading">50+</div>
                <div class="text-sm text-gray-300 mt-1">Anggota Aktif</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-sky-300 font-heading">100+</div>
                <div class="text-sm text-gray-300 mt-1">Karya</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-sky font-heading">20+</div>
                <div class="text-sm text-gray-300 mt-1">Event</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-sky-300 font-heading">5+</div>
                <div class="text-sm text-gray-300 mt-1">Prestasi</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vision Mission -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-50 dark:bg-secondary rounded-2xl p-8 border-t-4 border-royal shadow-md">
            <h3 class="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('about.vision') }}</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ t('about.vision_text') }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-secondary rounded-2xl p-8 border-t-4 border-sky shadow-md">
            <h3 class="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('about.mission') }}</h3>
            <ul class="space-y-3">
              <li
                v-for="(item, i) in missionItems"
                :key="i"
                class="flex gap-3 text-gray-600 dark:text-gray-300"
              >
                <span class="text-accent font-bold flex-shrink-0">{{ i + 1 }}.</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
