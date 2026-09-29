<script setup>
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { Lock } from 'lucide-vue-next';
const { t } = useI18n();
</script>

<template>
  <footer class="bg-secondary dark:bg-secondary text-white mt-auto border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <h3 class="font-heading text-2xl font-bold text-accent mb-3 tracking-wider">DKV</h3>
          <p class="text-gray-400 text-sm leading-relaxed italic max-w-sm">
            "Ideas Become Reality,<br>Visuals Become Stories"
          </p>
          <p class="text-gray-400 text-sm mt-3">
            UKM Desain Komunikasi Visual<br>Universitas Merangin
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Navigasi</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <RouterLink to="/about" class="text-gray-400 hover:text-accent transition-colors">
                {{ t('nav.about') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/portfolio" class="text-gray-400 hover:text-accent transition-colors">
                {{ t('nav.portfolio') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/event" class="text-gray-400 hover:text-accent transition-colors">
                {{ t('nav.event') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-gray-400 hover:text-accent transition-colors">
                {{ t('nav.blog') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/camavis" class="text-gray-400 hover:text-accent transition-colors">
                {{ t('nav.camavis') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="text-gray-400 hover:text-accent transition-colors">
                {{ t('nav.contact') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Social & Admin -->
        <div>
          <h4 class="font-semibold text-white mb-4">{{ t('contact.follow_us') }}</h4>
          <div class="flex gap-4 mb-6">
            <a href="#" class="text-gray-400 hover:text-accent transition-colors text-sm">Instagram</a>
            <a href="#" class="text-gray-400 hover:text-accent transition-colors text-sm">YouTube</a>
            <a href="#" class="text-gray-400 hover:text-accent transition-colors text-sm">Behance</a>
          </div>

          <h4 class="font-semibold text-white mb-2 text-xs uppercase tracking-wider text-gray-400">Khusus Pengurus</h4>
          <RouterLink
            to="/admin/login"
            class="inline-flex items-center gap-1.5 text-xs text-accent hover:underline border border-accent/40 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <Lock :size="13" />
            <span>Portal Admin DKV</span>
          </RouterLink>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
        <p>© {{ new Date().getFullYear() }} DKV — UKM Desain Komunikasi Visual Universitas Merangin. <span class="text-accent font-medium">v0.5</span></p>
        <RouterLink to="/admin/login" class="hover:text-accent transition-colors">
          Login Admin
        </RouterLink>
      </div>
    </div>
  </footer>
</template>
