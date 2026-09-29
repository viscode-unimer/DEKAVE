<script setup>
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const form = reactive({ email: '', password: '' });
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  const result = await auth.login(form.email, form.password);
  if (result.success) {
    toast.success('Login berhasil! Selamat datang.');
    router.push('/admin/dashboard');
  } else {
    toast.error(result.message || 'Login gagal. Periksa email & password.');
  }
  loading.value = false;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-surface px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-secondary rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <!-- Header -->
        <div class="text-center mb-8">
          <RouterLink to="/" class="inline-block">
            <span class="font-heading text-4xl font-bold text-accent tracking-wider">DKV</span>
          </RouterLink>
          <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mt-2">
            Portal Admin UKM DKV
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Universitas Merangin
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('admin.email') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="viscode0um@gmail.com"
              autocomplete="email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('admin.password') }}
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="btn-accent w-full py-3 text-base disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin">⏳</span>
            <span>{{ loading ? 'Memverifikasi...' : t('admin.login') }}</span>
          </button>
        </form>

        <!-- Back to Website -->
        <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <RouterLink
            to="/"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            <span>←</span>
            <span>Kembali ke Halaman Utama</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
