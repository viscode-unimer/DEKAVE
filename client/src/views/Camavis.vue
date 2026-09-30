<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import PublicLayout from '../components/common/PublicLayout.vue';
import api from '../utils/api';
import { CheckCircle2, Sparkles, Send, User, Mail, Phone, BookOpen, School, Instagram, Link, FileText } from 'lucide-vue-next';

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
    <!-- Hero Header -->
    <section class="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 mb-6 backdrop-blur-md">
          <Sparkles :size="14" class="text-cyan-400" />
          <span>OFFICIAL CAMAVIS ADMISSION</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
          {{ t('camavis.title') }}
        </h1>
        <p class="text-cyan-300 text-lg sm:text-xl font-medium italic mb-4">
          {{ t('camavis.subtitle') }}
        </p>
        <p class="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('camavis.desc') }}
        </p>
      </div>
    </section>

    <!-- Success State -->
    <section v-if="submitted" class="py-20 relative">
      <div class="max-w-lg mx-auto px-4 text-center">
        <div class="glass-card rounded-3xl p-10 border border-cyan-400/30">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <CheckCircle2 :size="44" />
          </div>
          <h2 class="font-heading text-3xl font-bold text-white mb-4">
            {{ t('camavis.success_title') }}
          </h2>
          <p class="text-gray-300 text-sm leading-relaxed mb-8">{{ t('camavis.success_desc') }}</p>
          <button @click="submitted = false" class="btn-accent px-8 py-3 rounded-full text-sm font-semibold">
            Daftar Lagi
          </button>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section v-else class="py-12 relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="mb-8 pb-6 border-b border-white/[0.08]">
            <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 block">
              // REGISTRATION FORM
            </span>
            <h2 class="font-heading text-2xl sm:text-3xl font-bold text-white">
              {{ t('camavis.form_title') }}
            </h2>
            <p class="text-gray-400 text-xs font-mono mt-1">Lengkapi data diri calon anggota visual dengan benar</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.full_name') }} <span class="text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.nickname') }} <span class="text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.nim') }} <span class="text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.email') }} <span class="text-cyan-400">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.faculty') }} <span class="text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.major') }} <span class="text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.phone') }} <span class="text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  {{ t('camavis.instagram') }} <span class="text-cyan-400">*</span>
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
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                {{ t('camavis.motivation') }} <span class="text-cyan-400">*</span>
              </label>
              <textarea
                v-model="form.motivation"
                required
                rows="4"
                class="input-field resize-none"
                placeholder="Tuliskan motivasi & ketertarikanmu bergabung di UKM DKV..."
              />
            </div>

            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                {{ t('camavis.portfolio_link') }} <span class="text-gray-500 font-normal">(Opsional)</span>
              </label>
              <input
                v-model="form.portfolioLink"
                type="url"
                class="input-field"
                placeholder="https://behance.net/username, Google Drive, atau link website"
              />
            </div>

            <div class="pt-4">
              <button
                type="submit"
                :disabled="loading"
                class="w-full btn-accent py-4 rounded-xl text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
              >
                <Send :size="18" />
                <span>{{ loading ? t('camavis.submitting') : t('camavis.submit') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
