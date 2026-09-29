<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import PublicLayout from '../components/common/PublicLayout.vue';
import api from '../utils/api';

const { t } = useI18n();
const toast = useToast();

const loading = ref(false);
const submitted = ref(false);

const form = reactive({
  fullName: '',
  nickname: '',
  nim: '',
  faculty: '',
  major: '',
  phone: '',
  instagram: '',
  email: '',
  motivation: '',
  portfolioLink: '',
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await api.post('/camavis', form);
    submitted.value = true;
    toast.success('Pendaftaran berhasil dikirim!');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal mengirim pendaftaran. Coba lagi.');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <PublicLayout>
    <!-- Hero -->
    <section class="py-24 bg-gradient-to-br from-primary via-secondary to-surface text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <span class="inline-block text-accent text-xs font-bold tracking-widest uppercase border border-accent px-3 py-1 rounded-full mb-4">
          CAMAVIS
        </span>
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('camavis.title') }}</h1>
        <p class="text-xl text-gray-300 font-medium italic mb-4">{{ t('camavis.subtitle') }}</p>
        <p class="text-gray-300 max-w-2xl mx-auto">{{ t('camavis.desc') }}</p>
      </div>
    </section>

    <!-- Success State -->
    <section v-if="submitted" class="py-20">
      <div class="max-w-lg mx-auto px-4 text-center">
        <div class="text-7xl mb-6">🎉</div>
        <h2 class="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('camavis.success_title') }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400">{{ t('camavis.success_desc') }}</p>
        <button @click="submitted = false" class="mt-8 btn-accent">
          Daftar Lagi
        </button>
      </div>
    </section>

    <!-- Form -->
    <section v-else class="py-16 bg-white dark:bg-primary">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-50 dark:bg-secondary rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 class="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {{ t('camavis.form_title') }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.full_name') }} *
                </label>
                <input
                  v-model="form.fullName"
                  type="text"
                  required
                  class="input-field"
                  :placeholder="t('camavis.full_name')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.nickname') }} *
                </label>
                <input
                  v-model="form.nickname"
                  type="text"
                  required
                  class="input-field"
                  :placeholder="t('camavis.nickname')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.nim') }} *
                </label>
                <input
                  v-model="form.nim"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Contoh: 2023001"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.email') }} *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.faculty') }} *
                </label>
                <input
                  v-model="form.faculty"
                  type="text"
                  required
                  class="input-field"
                  :placeholder="t('camavis.faculty')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.major') }} *
                </label>
                <input
                  v-model="form.major"
                  type="text"
                  required
                  class="input-field"
                  :placeholder="t('camavis.major')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.phone') }} *
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="input-field"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.instagram') }} *
                </label>
                <input
                  v-model="form.instagram"
                  type="text"
                  required
                  class="input-field"
                  placeholder="@username"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('camavis.motivation') }} *
              </label>
              <textarea
                v-model="form.motivation"
                required
                rows="5"
                class="input-field resize-none"
                placeholder="Tuliskan motivasimu bergabung dengan DKV..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('camavis.portfolio_link') }}
              </label>
              <input
                v-model="form.portfolioLink"
                type="url"
                class="input-field"
                placeholder="https://behance.net/username atau link lainnya"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-accent py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {{ loading ? t('camavis.submitting') : t('camavis.submit') }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
