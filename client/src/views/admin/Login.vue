<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import {
  Loader2,
  ArrowLeft,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

// Mode: 'login' | 'register'
const mode = ref('login');

// Login form state
const loginType = ref('email'); // 'email' | 'username'
const loginForm = reactive({
  identifier: '',
  password: '',
});
const showPassword = ref(false);
const loginLoading = ref(false);
const loginErrorMsg = ref('');
const isPendingNotice = ref(false);

// Register contributor form state
const regForm = reactive({
  username: '',
  fullName: '',
  email: '',
  division: 'Desain',
  password: '',
  confirmPassword: '',
  notes: '',
});
const showRegPassword = ref(false);
const regLoading = ref(false);
const regSuccess = ref(false);
const regSuccessData = ref(null);

const divisions = [
  'Desain',
  'Photography',
  'Videography',
  'Public Relation',
  'Umum / Pengurus',
];

// Handle Login
const handleLogin = async () => {
  loginErrorMsg.value = '';
  isPendingNotice.value = false;

  if (!loginForm.identifier.trim() || !loginForm.password) {
    toast.error('Mohon lengkapi data login.');
    return;
  }

  loginLoading.value = true;
  try {
    const result = await auth.login(loginForm.identifier.trim(), loginForm.password);
    if (result.success) {
      toast.success('Login berhasil! Selamat datang.');
      router.push('/admin/dashboard');
    } else {
      const msg = result.message || 'Login gagal. Periksa kembali data Anda.';
      loginErrorMsg.value = msg;
      if (msg.toLowerCase().includes('pending') || msg.toLowerCase().includes('acc')) {
        isPendingNotice.value = true;
      }
      toast.error(msg);
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Terjadi kesalahan sistem';
    loginErrorMsg.value = msg;
    if (msg.toLowerCase().includes('pending') || msg.toLowerCase().includes('acc')) {
      isPendingNotice.value = true;
    }
    toast.error(msg);
  } finally {
    loginLoading.value = false;
  }
};

// Handle Contributor Registration
const handleRegister = async () => {
  if (
    !regForm.username.trim() ||
    !regForm.fullName.trim() ||
    !regForm.email.trim() ||
    !regForm.password
  ) {
    toast.error('Mohon isi semua bidang formulir yang wajib.');
    return;
  }

  if (regForm.password.length < 6) {
    toast.error('Password minimal 6 karakter.');
    return;
  }

  if (regForm.password !== regForm.confirmPassword) {
    toast.error('Konfirmasi password tidak cocok.');
    return;
  }

  regLoading.value = true;
  try {
    const res = await auth.registerContributor({
      username: regForm.username.trim().toLowerCase().replace(/\s+/g, '_'),
      fullName: regForm.fullName.trim(),
      email: regForm.email.trim(),
      division: regForm.division,
      password: regForm.password,
      notes: regForm.notes.trim(),
    });

    regSuccessData.value = res.data?.data;
    regSuccess.value = true;
    toast.success('Pendaftaran kontributor berhasil dikirim!');
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        'Gagal mendaftarkan akun kontributor. Coba lagi.'
    );
  } finally {
    regLoading.value = false;
  }
};

const switchMode = (newMode) => {
  mode.value = newMode;
  loginErrorMsg.value = '';
  isPendingNotice.value = false;
  regSuccess.value = false;
};

const resetToLogin = () => {
  mode.value = 'login';
  regSuccess.value = false;
  loginForm.identifier = regSuccessData.value?.username || '';
  loginForm.password = '';
  loginType.value = 'username';
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-surface px-4 py-12 relative overflow-hidden">
    <!-- Ambient Backdrop Glow -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md relative z-10">
      <div class="bg-white/95 dark:bg-secondary/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 transition-all duration-300">
        
        <!-- Header Branding -->
        <div class="text-center mb-6">
          <RouterLink to="/" class="inline-block group mb-3">
            <img
              src="/logo-dkv-biru.png"
              alt="Logo DKV"
              class="h-12 sm:h-14 w-auto mx-auto object-contain dark:hidden group-hover:scale-105 transition-transform"
            />
            <img
              src="/logo-dkv-putih.png"
              alt="Logo DKV"
              class="h-12 sm:h-14 w-auto mx-auto object-contain hidden dark:block drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform"
            />
          </RouterLink>
          <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mt-1">
            Portal Pengurus & Kontributor DKV
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
            Universitas Merangin
          </p>
        </div>

        <!-- Mode Segmented Switcher (Login vs Daftar Kontributor) -->
        <div class="grid grid-cols-2 p-1 bg-slate-100 dark:bg-black/30 rounded-2xl mb-6 border border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            @click="switchMode('login')"
            class="py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 flex items-center justify-center gap-1.5"
            :class="mode === 'login'
              ? 'bg-white dark:bg-primary text-sky-600 dark:text-cyan-300 shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'"
          >
            <LogIn :size="14" />
            <span>Masuk Akun</span>
          </button>
          <button
            type="button"
            @click="switchMode('register')"
            class="py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 flex items-center justify-center gap-1.5"
            :class="mode === 'register'
              ? 'bg-white dark:bg-primary text-sky-600 dark:text-cyan-300 shadow-sm border border-slate-200/80 dark:border-white/10'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'"
          >
            <UserPlus :size="14" />
            <span>Daftar Kontributor</span>
          </button>
        </div>

        <!-- ==================== MODE 1: LOGIN ==================== -->
        <div v-if="mode === 'login'">
          <!-- 2 Opsi Login: Email vs Username Toggle -->
          <div class="mb-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-gray-500 dark:text-gray-400">
                Pilih Metode Masuk:
              </span>
              <span class="text-[11px] font-mono font-semibold text-sky-600 dark:text-cyan-400">
                {{ loginType === 'email' ? 'Mode Email' : 'Mode Username' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="loginType = 'email'"
                class="py-2 px-3 rounded-xl text-xs font-mono font-semibold border flex items-center justify-center gap-1.5 transition-all"
                :class="loginType === 'email'
                  ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-cyan-300 shadow-sm'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-slate-300 dark:hover:border-white/20'"
              >
                <Mail :size="14" />
                <span>Pake Email</span>
              </button>

              <button
                type="button"
                @click="loginType = 'username'"
                class="py-2 px-3 rounded-xl text-xs font-mono font-semibold border flex items-center justify-center gap-1.5 transition-all"
                :class="loginType === 'username'
                  ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-cyan-300 shadow-sm'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-slate-300 dark:hover:border-white/20'"
              >
                <User :size="14" />
                <span>Pake Username</span>
              </button>
            </div>
          </div>

          <!-- Pending Notice Alert Banner -->
          <div
            v-if="isPendingNotice"
            class="mb-5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5"
          >
            <Clock :size="18" class="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong class="font-bold block mb-0.5">Akun Masih Pending!</strong>
              Pendaftaran Anda belum di-ACC oleh Superadmin. Mohon tunggu proses konfirmasi agar akun Anda aktif.
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Dynamic Identifier Input (Email or Username) -->
            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                <span v-if="loginType === 'email'">Alamat Email *</span>
                <span v-else>Username Akun *</span>
              </label>

              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail v-if="loginType === 'email'" :size="16" />
                  <User v-else :size="16" />
                </div>
                <input
                  v-model="loginForm.identifier"
                  :type="loginType === 'email' ? 'email' : 'text'"
                  required
                  class="input-field pl-10 text-sm"
                  :placeholder="loginType === 'email' ? 'viscode0um@gmail.com' : 'muchann__ / username'"
                  autocomplete="username"
                />
              </div>
            </div>

            <!-- Password Input with Toggle Eye -->
            <div>
              <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Password *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock :size="16" />
                </div>
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="input-field pl-10 pr-10 text-sm"
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <EyeOff v-if="showPassword" :size="16" />
                  <Eye v-else :size="16" />
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loginLoading"
              class="btn-accent w-full py-3 text-sm font-bold uppercase tracking-wider rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 mt-2"
            >
              <Loader2 v-if="loginLoading" :size="18" class="animate-spin" />
              <span>{{ loginLoading ? 'Memverifikasi...' : 'Masuk ke Sistem' }}</span>
            </button>
          </form>

          <!-- Switcher to Register -->
          <div class="mt-5 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Belum punya akun kontributor?
              <button
                type="button"
                @click="switchMode('register')"
                class="text-sky-600 dark:text-cyan-400 hover:underline font-semibold ml-1"
              >
                Daftar di sini →
              </button>
            </p>
          </div>
        </div>

        <!-- ==================== MODE 2: DAFTAR KONTRIBUTOR ==================== -->
        <div v-else>
          <!-- Success State after registration -->
          <div v-if="regSuccess" class="text-center py-4 space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
              <Clock :size="32" class="animate-pulse" />
            </div>

            <div>
              <span class="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 mb-2">
                STATUS: PENDING MENUNGGU ACC
              </span>
              <h3 class="font-heading text-lg font-bold text-gray-900 dark:text-white">
                Pendaftaran Berhasil Dikirim! 🎉
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto mt-2">
                Akun dengan username <strong class="text-sky-600 dark:text-cyan-400 font-mono">@{{ regSuccessData?.username }}</strong> telah terdaftar.
                Akun ini memerlukan persetujuan (<strong class="text-amber-600 dark:text-amber-400">ACC</strong>) dari Superadmin sebelum dapat digunakan untuk login.
              </p>
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 text-left text-xs space-y-1.5 font-mono">
              <div class="flex justify-between">
                <span class="text-gray-400">Username:</span>
                <span class="text-gray-900 dark:text-white font-bold">@{{ regSuccessData?.username }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Email:</span>
                <span class="text-gray-900 dark:text-white truncate ml-2">{{ regSuccessData?.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Status Akun:</span>
                <span class="text-amber-500 font-bold">Pending ACC</span>
              </div>
            </div>

            <button
              type="button"
              @click="resetToLogin"
              class="btn-accent w-full py-2.5 text-xs font-bold font-mono uppercase tracking-wider rounded-xl"
            >
              Kembali ke Login
            </button>
          </div>

          <!-- Register Form -->
          <div v-else>
            <!-- Info Alert -->
            <div class="mb-4 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-cyan-200 text-xs leading-relaxed flex items-start gap-2">
              <Sparkles :size="16" class="text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Pendaftaran kontributor akan diverifikasi dan disetujui (<strong>ACC</strong>) terlebih dahulu oleh <strong>Superadmin</strong> sebelum akun dapat aktif.
              </span>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-3.5">
              <!-- Username -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Username Akun *
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-mono text-xs">
                    @
                  </div>
                  <input
                    v-model="regForm.username"
                    type="text"
                    required
                    class="input-field pl-8 text-sm"
                    placeholder="nama_pengguna (tanpa spasi)"
                  />
                </div>
              </div>

              <!-- Full Name -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  v-model="regForm.fullName"
                  type="text"
                  required
                  class="input-field text-sm"
                  placeholder="Contoh: Rian Pratama"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Email Aktif *
                </label>
                <input
                  v-model="regForm.email"
                  type="email"
                  required
                  class="input-field text-sm"
                  placeholder="rian@example.com"
                />
              </div>

              <!-- Division Selection -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Divisi / Fokus Minat *
                </label>
                <select v-model="regForm.division" class="input-field text-sm">
                  <option v-for="d in divisions" :key="d" :value="d">
                    Divisi {{ d }}
                  </option>
                </select>
              </div>

              <!-- Password & Confirm Password -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <input
                    v-model="regForm.password"
                    :type="showRegPassword ? 'text' : 'password'"
                    required
                    class="input-field text-sm"
                    placeholder="Min. 6 digit"
                  />
                </div>
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Ulangi Password *
                  </label>
                  <input
                    v-model="regForm.confirmPassword"
                    :type="showRegPassword ? 'text' : 'password'"
                    required
                    class="input-field text-sm"
                    placeholder="Ketik ulang"
                  />
                </div>
              </div>

              <!-- Notes / Alasan -->
              <div>
                <label class="block text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Catatan / Program Studi (Opsional)
                </label>
                <input
                  v-model="regForm.notes"
                  type="text"
                  class="input-field text-sm"
                  placeholder="Contoh: Mahasiswa TI 2024 / Fotografer"
                />
              </div>

              <!-- Submit Register -->
              <button
                type="submit"
                :disabled="regLoading"
                class="btn-accent w-full py-3 text-sm font-bold uppercase tracking-wider rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 mt-1"
              >
                <Loader2 v-if="regLoading" :size="18" class="animate-spin" />
                <span>{{ regLoading ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Akun' }}</span>
              </button>
            </form>

            <!-- Switcher to Login -->
            <div class="mt-4 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Sudah memiliki akun yang disetujui?
                <button
                  type="button"
                  @click="switchMode('login')"
                  class="text-sky-600 dark:text-cyan-400 hover:underline font-semibold ml-1"
                >
                  Masuk sekarang →
                </button>
              </p>
            </div>
          </div>
        </div>

        <!-- Back to Website -->
        <div class="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 text-center">
          <RouterLink
            to="/"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5 font-mono"
          >
            <ArrowLeft :size="14" />
            <span>Kembali ke Halaman Utama</span>
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>
