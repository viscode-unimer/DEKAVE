<script setup>
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { Lock, ArrowUpRight, Instagram, Youtube, Sparkles } from 'lucide-vue-next';
const { t } = useI18n();
</script>

<template>
  <footer class="relative mt-24 border-t border-white/[0.08] bg-[#040814]/90 backdrop-blur-xl text-white overflow-hidden">
    <!-- Ambient top border glow line -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-50"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/[0.06]">
        <!-- Brand Column (5 cols) -->
        <div class="md:col-span-5 space-y-4">
          <RouterLink to="/" class="inline-flex items-center gap-2.5 group">
            <div class="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-accent via-sky to-royal text-white font-black text-sm shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              D
            </div>
            <span class="font-heading font-black text-2xl tracking-wider text-white group-hover:text-sky transition-colors">
              DKV
            </span>
          </RouterLink>
          <p class="text-gray-400 text-sm leading-relaxed max-w-sm">
            Unit Kegiatan Mahasiswa Desain Komunikasi Visual Universitas Merangin. Ruang eksplorasi, inovasi visual, dan pergerakan karya generasi kreatif.
          </p>
          <div class="pt-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-gray-300">
              <span class="w-2 h-2 rounded-full bg-sky animate-pulse"></span>
              <span>"Ideas Become Reality, Visuals Become Stories"</span>
            </div>
          </div>
        </div>

        <!-- Quick Links (3 cols) -->
        <div class="md:col-span-3 space-y-3">
          <h4 class="text-xs font-mono uppercase tracking-wider text-sky font-semibold">Navigasi Utama</h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/about" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.about') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/portfolio" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.portfolio') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/event" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.event') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.blog') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/member" class="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                <span class="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-sky transition-colors"></span>
                <span>{{ t('nav.member') }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Admission & Contact (4 cols) -->
        <div class="md:col-span-4 space-y-4">
          <h4 class="text-xs font-mono uppercase tracking-wider text-sky font-semibold">Komunitas & Pengurus</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Ingin berkarya atau berkolaborasi bersama kami? Pintu pendaftaran anggota selalu terbuka untuk kreator muda.
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <RouterLink
              to="/camavis"
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-white bg-white/[0.08] hover:bg-sky/20 border border-white/10 hover:border-sky/40 transition-all group"
            >
              <Sparkles :size="13" class="text-sky" />
              <span>Daftar CAMAVIS</span>
              <ArrowUpRight :size="13" class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </RouterLink>

            <RouterLink
              to="/admin/login"
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full text-gray-300 hover:text-white bg-transparent hover:bg-white/[0.06] border border-white/10 transition-all"
              title="Khusus Pengurus & Kontributor DKV"
            >
              <Lock :size="13" class="text-sky" />
              <span>Portal Admin DKV</span>
            </RouterLink>
          </div>

          <!-- Social media pills -->
          <div class="flex items-center gap-3 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              class="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-sky/40 hover:bg-sky/10 transition-all"
              aria-label="Instagram"
            >
              <Instagram :size="15" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              class="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-sky/40 hover:bg-sky/10 transition-all"
              aria-label="YouTube"
            >
              <Youtube :size="15" />
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-mono">
        <p class="flex items-center gap-2">
          <span>© {{ new Date().getFullYear() }} DKV Univ. Merangin</span>
          <span class="text-gray-600">•</span>
          <span class="text-sky font-medium">v0.6</span>
        </p>
        <p class="text-gray-400 font-sans">
          Developed by <span class="text-sky font-semibold tracking-wide">XXaverius</span>
        </p>
      </div>
    </div>
  </footer>
</template>
