<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import PublicLayout from '../components/common/PublicLayout.vue';
import api from '../utils/api';
import {
  MapPin,
  Mail,
  Instagram,
  ArrowUpRight,
} from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const sending = ref(false);

const pageContent = ref({
  badge: 'HUBUNGI KAMI & FAST CONNECT',
  title: 'Hubungi Kami',
  subtitle: 'Ada pertanyaan, ingin berkolaborasi, atau butuh konsultasi desain? Hubungi tim pengurus DKV Universitas Merangin sekarang.',
  formTitle: 'Kirim Pesan ke DKV',
  formSubtitle: 'Isi pesan dan kami akan otomatis mengarahkan ke WhatsApp resmi DKV dengan format yang rapi.',
  campusAddress: 'Kampus Universitas Merangin, Bangko, Jambi',
  email: 'viscode0um@gmail.com',
  whatsappNumber: '6282289656828',
  whatsappDisplay: '+62 822-8965-6828',
  instagramHandle: '@viscode_um',
  instagramUrl: 'https://www.instagram.com/viscode_um/',
  tiktokHandle: '@viscode_univmerangin',
  tiktokUrl: 'https://www.tiktok.com/@viscode_univmerangin?_r=1&_t=ZS-9ACLSGdOjH4',
});

const whatsappNumber = ref('6282289656828');

const form = reactive({
  name: '',
  contact: '',
  topic: 'Pertanyaan Umum & Info UKM',
  message: '',
});

const topics = [
  'Pertanyaan Umum & Info UKM',
  'Ajak Kolaborasi / Project Desain',
  'Info Kegiatan & Event',
  'Pendaftaran CAMAVIS',
];

onMounted(async () => {
  try {
    const res = await api.get('/page-content/contact');
    if (res.data?.data) {
      pageContent.value = { ...pageContent.value, ...res.data.data };
      if (pageContent.value.whatsappNumber) {
        whatsappNumber.value = pageContent.value.whatsappNumber.replace(/[^0-9]/g, '');
      }
    }
  } catch {
    // fallback default
  }
});

const handleSubmit = () => {
  if (!form.name.trim() || !form.message.trim()) {
    toast.error('Mohon lengkapi Nama dan Pesan!');
    return;
  }

  sending.value = true;

  const formattedMsg =
    `*PESAN DARI WEBSITE DKV / VISCODE*\n\n` +
    `• *Nama:* ${form.name.trim()}\n` +
    `• *Kontak Pengirim:* ${form.contact.trim() || '-'}\n` +
    `• *Topik:* ${form.topic}\n\n` +
    `*Isi Pesan:*\n${form.message.trim()}`;

  const url = `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(formattedMsg)}`;
  window.open(url, '_blank');
  toast.success('Membuka WhatsApp untuk mengirim pesan...');

  // Reset form
  form.name = '';
  form.contact = '';
  form.topic = 'Pertanyaan Umum & Info UKM';
  form.message = '';
  sending.value = false;
};
</script>

<template>
  <PublicLayout>
    <!-- Hero Header -->
    <section class="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-lines opacity-15 pointer-events-none"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 mb-6 backdrop-blur-md">
          <Mail :size="14" class="text-cyan-600 dark:text-cyan-400" />
          <span>{{ pageContent.badge }}</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          {{ pageContent.title }}
        </h1>
        <p class="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ pageContent.subtitle }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="py-12 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Form Section (7 cols) -->
          <div class="lg:col-span-7">
            <!-- WhatsApp Message Generator Form -->
            <div class="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-white/10">
              <span class="text-xs font-mono uppercase tracking-widest text-sky-600 dark:text-cyan-400 font-semibold mb-2 block">
                // FORMULIR PESAN & INQUIRY
              </span>
              <h2 class="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {{ pageContent.formTitle || 'Kirim Pesan ke DKV' }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mb-6">
                {{ pageContent.formSubtitle || 'Isi form di bawah, lalu klik kirim untuk langsung meneruskannya ke WhatsApp pengurus dengan format pesan otomatis.' }}
              </p>

              <form @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                    {{ t('contact.name') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
                  </label>
                  <input v-model="form.name" required type="text" class="input-field" placeholder="Nama Lengkap Anda" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                      No. WhatsApp / Email <span class="text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input v-model="form.contact" type="text" class="input-field" placeholder="08xx atau email Anda" />
                  </div>
                  <div>
                    <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                      Topik Pertanyaan
                    </label>
                    <select v-model="form.topic" class="input-field">
                      <option v-for="top in topics" :key="top" :value="top">{{ top }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2">
                    {{ t('contact.message') }} <span class="text-sky-600 dark:text-cyan-400">*</span>
                  </label>
                  <textarea v-model="form.message" required rows="5" class="input-field resize-none" placeholder="Tuliskan pertanyaan, ajakan kolaborasi, atau pesan yang ingin disampaikan..." />
                </div>

                <button
                  type="submit"
                  :disabled="sending"
                  class="btn-accent w-full py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 text-sm shadow-lg shadow-sky-500/25 disabled:opacity-60 group"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Kirim Pesan via WhatsApp</span>
                  <ArrowUpRight :size="16" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          <!-- Info & Socials (5 cols) -->
          <div class="lg:col-span-5 space-y-6">
            <!-- Media Sosial -->
            <div class="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-white/10">
              <h3 class="font-heading text-xl font-bold text-slate-900 dark:text-white mb-6">
                {{ t('contact.follow_us') }}
              </h3>
              <div class="space-y-3.5">
                <!-- Instagram -->
                <a
                  :href="pageContent.instagramUrl || 'https://www.instagram.com/viscode_um/'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] hover:border-pink-500/40 dark:hover:border-pink-400/30 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-all group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
                      <Instagram :size="20" />
                    </div>
                    <div>
                      <span class="text-sm font-semibold block text-slate-900 dark:text-white">Instagram</span>
                      <span class="text-xs font-mono text-slate-500 dark:text-gray-400">{{ pageContent.instagramHandle }}</span>
                    </div>
                  </div>
                  <ArrowUpRight :size="16" class="text-slate-400 group-hover:text-pink-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <!-- TikTok -->
                <a
                  :href="pageContent.tiktokUrl || 'https://www.tiktok.com/@viscode_univmerangin?_r=1&_t=ZS-9ACLSGdOjH4'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] hover:border-sky-500/40 dark:hover:border-cyan-400/30 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white transition-all group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <div>
                      <span class="text-sm font-semibold block text-slate-900 dark:text-white">TikTok</span>
                      <span class="text-xs font-mono text-slate-500 dark:text-gray-400">{{ pageContent.tiktokHandle }}</span>
                    </div>
                  </div>
                  <ArrowUpRight :size="16" class="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

              </div>
            </div>

            <!-- Sekretariat & Email -->
            <div class="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 space-y-4">
              <h3 class="font-heading text-lg font-bold text-slate-900 dark:text-white mb-2">
                Informasi Sekretariat
              </h3>
              <p class="flex items-start gap-3 text-sm text-slate-700 dark:text-gray-300">
                <MapPin :size="18" class="text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>{{ pageContent.campusAddress }}</span>
              </p>
              <a
                :href="`mailto:${pageContent.email}`"
                class="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors group"
              >
                <Mail :size="18" class="text-sky-600 dark:text-sky shrink-0 group-hover:scale-110 transition-transform" />
                <span class="font-mono text-xs sm:text-sm">{{ pageContent.email }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
