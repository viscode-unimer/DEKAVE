<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import { RouterLink } from 'vue-router';
import PublicLayout from '../components/common/PublicLayout.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../utils/api';
import {
  CheckCircle2,
  Sparkles,
  Send,
  Clock,
  Calendar,
  School,
  Instagram,
  Phone,
} from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();

const loading = ref(false);
const submitted = ref(false);

const settingsLoading = ref(true);
const settings = ref({
  isOpen: false,
  period: 'Semester Depan',
  announcement:
    'Pendaftaran Calon Mahasiswa Viscode (CAMAVIS) saat ini telah ditutup. Kami akan membuka pendaftaran kembali pada semester depan. Pantau terus linimasa media sosial kami agar tidak ketinggalan jadwal seleksi gelombang selanjutnya!',
  whatsappNumber: '6282289456789',
  instagramHandle: 'dekave_unimer',
});

const form = reactive({
  fullName: '',
  nickname: '',
  nim: '',
  faculty: '',
  major: '',
  phone: '',
  instagram: '',
  email: '',
  division: 'Desain',
  motivation: '',
  portfolioLink: '',
});

const fetchSettings = async () => {
  settingsLoading.value = true;
  try {
    const res = await api.get('/camavis/settings');
    if (res.data?.data) {
      settings.value = res.data.data;
    }
  } catch (err) {
    console.error('Error fetching CAMAVIS settings:', err);
  } finally {
    settingsLoading.value = false;
  }
};

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

onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <PublicLayout>
    <!-- Hero Header -->
    <section class="relative pt-36 pb-12 md:pt-44 md:pb-16 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Status Indicator Pill -->
        <div
          v-if="!settingsLoading"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border mb-6 backdrop-blur-md"
          :class="settings.isOpen
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              :class="settings.isOpen ? 'bg-emerald-400' : 'bg-rose-400'"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2"
              :class="settings.isOpen ? 'bg-emerald-500' : 'bg-rose-500'"
            ></span>
          </span>
          <span>{{ settings.isOpen ? 'PENDAFTARAN DIBUKA' : 'PENDAFTARAN DITUTUP' }}</span>
        </div>

        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ t('camavis.title') }}
        </h1>
        <p class="text-sky-600 dark:text-cyan-300 text-lg sm:text-xl font-medium italic mb-4">
          {{ t('camavis.subtitle') }}
        </p>
        <p class="text-slate-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('camavis.desc') }}
        </p>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="settingsLoading" class="py-16">
      <LoadingSpinner />
    </div>

    <!-- OPSI 1: CLOSED STATE (Ketika pendaftaran ditutup) -->
    <section v-else-if="!settings.isOpen" class="py-6 pb-28 relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card rounded-3xl p-8 sm:p-14 border border-rose-500/30 dark:border-rose-400/25 relative overflow-hidden text-center shadow-2xl shadow-rose-500/5">
          <!-- Ambient Glow Effect -->
          <div class="absolute -top-24 -left-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Pulsing Status Badge -->
          <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 mb-8 backdrop-blur-md shadow-sm">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span>PENDAFTARAN GELOMBANG INI TELAH DITUTUP</span>
          </div>

          <!-- Main Clock Icon -->
          <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-400 shadow-lg shadow-rose-500/10">
            <Clock :size="46" />
          </div>

          <!-- Main Title & Announcement Text -->
          <h2 class="font-heading text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Pendaftaran CAMAVIS Telah Ditutup
          </h2>
          <p class="text-slate-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            {{ settings.announcement }}
          </p>

          <!-- 3 Highlight Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            <div class="bg-slate-100/80 dark:bg-white/[0.04] p-5 rounded-2xl border border-slate-200 dark:border-white/10">
              <div class="text-rose-500 mb-2">
                <Calendar :size="20" />
              </div>
              <span class="text-xs font-mono text-slate-400 block mb-1">Jadwal Buka</span>
              <p class="font-heading font-bold text-slate-900 dark:text-white text-base">
                {{ settings.period || 'Semester Depan' }}
              </p>
            </div>

            <div class="bg-slate-100/80 dark:bg-white/[0.04] p-5 rounded-2xl border border-slate-200 dark:border-white/10">
              <div class="text-amber-500 mb-2">
                <School :size="20" />
              </div>
              <span class="text-xs font-mono text-slate-400 block mb-1">Target Peserta</span>
              <p class="font-heading font-bold text-slate-900 dark:text-white text-base">
                Mahasiswa Aktif Unimer
              </p>
            </div>

            <div class="bg-slate-100/80 dark:bg-white/[0.04] p-5 rounded-2xl border border-slate-200 dark:border-white/10">
              <div class="text-cyan-500 mb-2">
                <Sparkles :size="20" />
              </div>
              <span class="text-xs font-mono text-slate-400 block mb-1">Pilihan Divisi</span>
              <p class="font-heading font-bold text-slate-900 dark:text-white text-base">
                Desain • Foto • Video • PR
              </p>
            </div>
          </div>

          <!-- Action Buttons / CTA -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <!-- Instagram Button -->
            <a
              :href="`https://instagram.com/${(settings.instagramHandle || 'dekave_unimer').replace('@', '')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/25 transition-all duration-300"
            >
              <Instagram :size="18" />
              <span>Pantau Info di Instagram</span>
            </a>

            <!-- WhatsApp Narahubung Button -->
            <a
              v-if="settings.whatsappNumber"
              :href="`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Halo Admin DEKAVE, saya ingin bertanya info pendaftaran CAMAVIS periode selanjutnya...')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all duration-300"
            >
              <Phone :size="18" />
              <span>Narahubung WhatsApp</span>
            </a>
          </div>

          <!-- Secondary Links -->
          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-center gap-6 text-xs font-mono text-slate-500 dark:text-gray-400">
            <RouterLink to="/portfolio" class="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
              Lihat Karya DEKAVE →
            </RouterLink>
            <span>•</span>
            <RouterLink to="/member" class="hover:text-sky-600 dark:hover:text-cyan-400 transition-colors">
              Struktur Organisasi →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Success State -->
    <section v-else-if="submitted" class="py-20 relative">
      <div class="max-w-lg mx-auto px-4 text-center">
        <div class="glass-card rounded-3xl p-10 border border-sky-500/30 dark:border-cyan-400/30">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
            <CheckCircle2 :size="44" />
          </div>
          <h2 class="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {{ t('camavis.success_title') }}
          </h2>
          <p class="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-8">{{ t('camavis.success_desc') }}</p>
          <button @click="submitted = false" class="btn-accent px-8 py-3 rounded-full text-sm font-semibold">
            Daftar Lagi
          </button>
        </div>
      </div>
    </section>

    <!-- Active Form Section (Ketika isOpen === true) -->
    <section v-else class="py-12 pb-24 relative">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="mb-8 pb-6 border-b border-slate-200 dark:border-white/[0.08]">
            <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 font-semibold mb-2 block">
              // REGISTRATION FORM
            </span>
            <h2 class="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ t('camavis.form_title') }}
            </h2>
            <p class="text-slate-500 dark:text-gray-400 text-xs font-mono mt-1">Lengkapi data diri calon anggota visual dengan benar</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.full_name') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.nickname') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.nim') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.email') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.faculty') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.major') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.phone') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
                <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                  {{ t('camavis.instagram') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
              <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                Pilihan Divisi Peminatan <span class="text-sky-600 dark:text-cyan-400">*</span>
              </label>
              <select v-model="form.division" required class="input-field">
                <option value="Desain">Divisi Desain (Grafis, Poster, Ilustrasi, Layout)</option>
                <option value="Photography">Divisi Photography (Kamera, Framing, Hunting Foto)</option>
                <option value="Videography">Divisi Videography (Video Kreatif, Reels, Sinematik)</option>
                <option value="Public Relation">Divisi Public Relation / PR (Humas & Media Sosial)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                {{ t('camavis.motivation') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
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
              <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                {{ t('camavis.portfolio_link') }} <span class="text-slate-400 dark:text-gray-500 font-normal">(Opsional)</span>
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
                class="w-full btn-accent py-4 rounded-xl text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25"
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
