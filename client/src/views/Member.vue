<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import { User } from 'lucide-vue-next';

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
    <section class="py-24 bg-gradient-to-br from-primary to-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('member.title') }}</h1>
        <p class="text-gray-300 text-xl">{{ t('member.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-white dark:bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSpinner v-if="loading" />
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="member in members" :key="member._id" class="text-center group">
            <div class="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200 dark:bg-secondary mb-3 ring-4 ring-transparent group-hover:ring-accent transition-all duration-300">
              <img
                v-if="member.photo"
                :src="member.photo"
                :alt="member.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <User :size="32" class="opacity-40" />
              </div>
            </div>
            <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ member.name }}</p>
            <p class="text-xs text-accent font-semibold">{{ member.position }}</p>
            <p class="text-xs text-gray-400">{{ member.division }}</p>
            <a
              v-if="member.instagram"
              :href="`https://instagram.com/${member.instagram.replace('@', '')}`"
              target="_blank"
              class="text-xs text-gray-400 hover:text-accent transition-colors"
            >
              {{ member.instagram }}
            </a>
          </div>
          <div v-if="members.length === 0" class="col-span-full text-center text-gray-400 py-12">
            {{ t('member.no_data') }}
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
