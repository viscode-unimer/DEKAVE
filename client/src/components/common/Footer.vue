<script setup>
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { Lock, ArrowUpRight, Instagram, Sparkles } from 'lucide-vue-next';
const { t } = useI18n();
</script>

<template>
  <footer class="relative mt-24 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#040814]/90 backdrop-blur-xl text-slate-800 dark:text-white overflow-hidden transition-colors duration-300">
    <!-- Ambient top border glow line -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-200 dark:border-white/[0.06]">
        <!-- Brand Column (5 cols) -->
        <div class="md:col-span-5 space-y-4">
          <RouterLink to="/" class="inline-flex items-center group">
            <img
              src="/logo-dkv-biru.png"
              alt="Logo DKV Universitas Merangin"
              class="h-9 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform"
            />
            <img
              src="/logo-dkv-putih.png"
              alt="Logo DKV Universitas Merangin"
              class="h-9 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
            />
          </RouterLink>
          <p class="text-slate-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
            Unit Kegiatan Mahasiswa Desain Komunikasi Visual Universitas Merangin. Ruang eksplorasi, inovasi visual, dan pergerakan karya generasi kreatif.
          </p>
          <div class="pt-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-white/[0.03] border border-slate-300/60 dark:border-white/10 text-xs text-slate-700 dark:text-gray-300">
              <span class="w-2 h-2 rounded-full bg-sky animate-pulse"></span>
              <span>"Ideas Become Reality, Visuals Become Stories"</span>
            </div>
          </div>
        </div>

        <!-- Quick Links (3 cols) -->
        <div class="md:col-span-3 space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky font-semibold">Navigasi Utama</h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/about" class="text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600 group-hover:bg-sky-500 dark:group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.about') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/portfolio" class="text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600 group-hover:bg-sky-500 dark:group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.portfolio') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/event" class="text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600 group-hover:bg-sky-500 dark:group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.event') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600 group-hover:bg-sky-500 dark:group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.blog') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/member" class="text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600 group-hover:bg-sky-500 dark:group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.member') }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Admission & Contact (4 cols) -->
        <div class="md:col-span-4 space-y-4">
          <h4 class="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky font-semibold">Komunitas & Pengurus</h4>
          <p class="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
            Ingin berkarya atau berkolaborasi bersama kami? Pintu pendaftaran anggota selalu terbuka untuk kreator muda.
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <RouterLink
              to="/camavis"
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-slate-800 dark:text-white bg-slate-200/80 hover:bg-sky-500/15 dark:bg-white/[0.08] dark:hover:bg-sky/20 border border-slate-300/80 dark:border-white/10 hover:border-sky-500/40 dark:hover:border-sky/40 transition-all group"
            >
              <Sparkles :size="13" class="text-sky-600 dark:text-sky" />
              <span>Daftar CAMAVIS</span>
              <ArrowUpRight :size="13" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </RouterLink>

            <RouterLink
              to="/admin/login"
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white bg-transparent hover:bg-slate-200/50 dark:hover:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 transition-all"
              title="Khusus Pengurus & Kontributor DKV"
            >
              <Lock :size="13" class="text-sky-600 dark:text-sky" />
              <span>Portal Admin DKV</span>
            </RouterLink>
          </div>

          <!-- Social media pills -->
          <div class="flex items-center gap-3 pt-2">
            <a
              href="https://www.instagram.com/viscode_um/"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/[0.05] border border-slate-300/80 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white hover:border-sky-500/40 dark:hover:border-sky/40 hover:bg-sky-500/10 dark:hover:bg-sky/10 transition-all"
              aria-label="Instagram"
            >
              <Instagram :size="15" />
            </a>
            <a
              href="https://www.tiktok.com/@viscode_univmerangin?_r=1&_t=ZS-9ACLSGdOjH4"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/[0.05] border border-slate-300/80 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white hover:border-sky-500/40 dark:hover:border-sky/40 hover:bg-sky-500/10 dark:hover:bg-sky/10 transition-all"
              aria-label="TikTok"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-400 font-mono">
        <p class="flex items-center gap-2">
          <span>© {{ new Date().getFullYear() }} DKV Universitas Merangin</span>
          <span class="text-slate-400 dark:text-gray-600">•</span>
          <span class="text-sky-600 dark:text-sky font-medium">v0.7</span>
        </p>
        <p class="text-slate-600 dark:text-gray-400 font-sans">
          Developed by <span class="text-sky-600 dark:text-sky font-semibold tracking-wide">XXaverius</span>
        </p>
      </div>
    </div>
  </footer>
</template>
