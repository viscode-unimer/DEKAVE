<script setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import PublicLayout from '../components/common/PublicLayout.vue';
import { MapPin, Mail, Instagram, Youtube, Palette, Send, Sparkles } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const sending = ref(false);
const form = reactive({ name: '', email: '', message: '' });

const handleSubmit = async () => {
  sending.value = true;
  await new Promise((r) => setTimeout(r, 800));
  toast.success('Pesan berhasil dikirim! Kami akan segera menghubungimu.');
  form.name = '';
  form.email = '';
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
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 mb-6 backdrop-blur-md">
          <Mail :size="14" class="text-cyan-400" />
          <span>DIRECT STUDIO INQUIRY</span>
        </div>
        <h1 class="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6">
          {{ t('contact.title') }}
        </h1>
        <p class="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          {{ t('contact.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="py-12 relative">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Form -->
          <div class="lg:col-span-7">
            <div class="glass-card rounded-3xl p-8 sm:p-10 border border-white/10">
              <span class="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 block">
                // GET IN TOUCH
              </span>
              <h2 class="font-heading text-2xl sm:text-3xl font-bold text-white mb-6">
                Kirim Pesan ke DEKAVE
              </h2>

              <form @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                    {{ t('contact.name') }} <span class="text-cyan-400">*</span>
                  </label>
                  <input v-model="form.name" required type="text" class="input-field" placeholder="Nama Lengkap" />
                </div>

                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                    {{ t('contact.email') }} <span class="text-cyan-400">*</span>
                  </label>
                  <input v-model="form.email" required type="email" class="input-field" placeholder="nama@email.com" />
                </div>

                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                    {{ t('contact.message') }} <span class="text-cyan-400">*</span>
                  </label>
                  <textarea v-model="form.message" required rows="5" class="input-field resize-none" placeholder="Tuliskan pertanyaan, kolaborasi, atau pesanmu..." />
                </div>

                <button
                  type="submit"
                  :disabled="sending"
                  class="btn-accent w-full py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-60"
                >
                  <Send :size="16" />
                  <span>{{ sending ? 'Mengirim...' : t('contact.send') }}</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Info & Socials -->
          <div class="lg:col-span-5 space-y-6">
            <div class="glass-card rounded-3xl p-8 border border-white/10">
              <h3 class="font-heading text-xl font-bold text-white mb-6">{{ t('contact.follow_us') }}</h3>
              <div class="space-y-4">
                <a href="#" class="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-400/30 text-gray-300 hover:text-white transition-all group">
                  <div class="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                    <Instagram :size="20" />
                  </div>
                  <div>
                    <span class="text-sm font-semibold block text-white">Instagram</span>
                    <span class="text-xs font-mono text-gray-400">@dekave.unimer</span>
                  </div>
                </a>

                <a href="#" class="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-400/30 text-gray-300 hover:text-white transition-all group">
                  <div class="w-10 h-10 rounded-lg bg-sky/10 flex items-center justify-center text-sky">
                    <Youtube :size="20" />
                  </div>
                  <div>
                    <span class="text-sm font-semibold block text-white">YouTube</span>
                    <span class="text-xs font-mono text-gray-400">DEKAVE Official</span>
                  </div>
                </a>

                <a href="#" class="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-400/30 text-gray-300 hover:text-white transition-all group">
                  <div class="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                    <Palette :size="20" />
                  </div>
                  <div>
                    <span class="text-sm font-semibold block text-white">Behance</span>
                    <span class="text-xs font-mono text-gray-400">behance.net/dekave</span>
                  </div>
                </a>
              </div>
            </div>

            <div class="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
              <h3 class="font-heading text-lg font-bold text-white mb-2">Informasi Sekretariat</h3>
              <p class="flex items-center gap-3 text-sm text-gray-300">
                <MapPin :size="16" class="text-cyan-400 shrink-0" />
                <span>Kampus Universitas Merangin, Bangko, Jambi</span>
              </p>
              <p class="flex items-center gap-3 text-sm text-gray-300">
                <Mail :size="16" class="text-sky shrink-0" />
                <span class="font-mono text-xs">dekave@merangin.ac.id</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
