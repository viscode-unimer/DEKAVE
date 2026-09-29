<script setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import PublicLayout from '../components/common/PublicLayout.vue';
import { MapPin, Mail, Instagram, Youtube, Palette } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const sending = ref(false);
const form = reactive({ name: '', email: '', message: '' });

const handleSubmit = async () => {
  sending.value = true;
  // Simulate sending — wire to API if needed
  await new Promise((r) => setTimeout(r, 1000));
  toast.success('Pesan berhasil dikirim! Kami akan segera menghubungimu.');
  form.name = '';
  form.email = '';
  form.message = '';
  sending.value = false;
};
</script>

<template>
  <PublicLayout>
    <section class="py-24 bg-gradient-to-br from-primary to-secondary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="font-heading text-5xl font-bold mb-4">{{ t('contact.title') }}</h1>
        <p class="text-gray-300 text-xl">{{ t('contact.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 bg-white dark:bg-primary">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div>
            <h2 class="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-6">Kirim Pesan</h2>
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('contact.name') }}</label>
                <input v-model="form.name" required type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('contact.email') }}</label>
                <input v-model="form.email" required type="email" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('contact.message') }}</label>
                <textarea v-model="form.message" required rows="5" class="input-field resize-none" />
              </div>
              <button
                type="submit"
                :disabled="sending"
                class="btn-accent w-full py-3 disabled:opacity-60"
              >
                {{ sending ? 'Mengirim...' : t('contact.send') }}
              </button>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <div>
              <h3 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-4">
                {{ t('contact.follow_us') }}
              </h3>
              <div class="space-y-3">
                <a href="#" class="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-accent">
                    <Instagram :size="16" />
                  </div>
                  <span>Instagram</span>
                </a>
                <a href="#" class="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-accent">
                    <Youtube :size="16" />
                  </div>
                  <span>YouTube</span>
                </a>
                <a href="#" class="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-accent">
                    <Palette :size="16" />
                  </div>
                  <span>Behance</span>
                </a>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-secondary rounded-2xl p-6">
              <h3 class="font-heading text-lg font-bold text-gray-900 dark:text-white mb-3">Informasi</h3>
              <div class="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                <p class="flex items-center gap-2.5">
                  <MapPin :size="16" class="text-accent flex-shrink-0" />
                  <span>Universitas Merangin</span>
                </p>
                <p class="flex items-center gap-2.5">
                  <Mail :size="16" class="text-accent flex-shrink-0" />
                  <span>dekave@merangin.ac.id</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
