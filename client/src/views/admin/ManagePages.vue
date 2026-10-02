<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import {
  LayoutDashboard,
  Home,
  Info,
  PhoneCall,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next';

const toast = useToast();

const activeTab = ref('home');
const loading = ref(true);
const saving = ref(false);
const resetting = ref(false);
const showResetModal = ref(false);

const tabs = [
  { id: 'home', label: 'Beranda (Home)', icon: Home, desc: 'Kelola teks Hero, slogan, dan banner ajakan CAMAVIS' },
  { id: 'about', label: 'Tentang (About)', icon: Info, desc: 'Kelola visi, misi, deskripsi organisasi, dan motto' },
  { id: 'contact', label: 'Kontak (Contact)', icon: PhoneCall, desc: 'Kelola nomor WhatsApp, email, alamat, dan link media sosial' },
];

const metaInfo = reactive({
  isCustom: false,
  updatedAt: null,
  updatedBy: '',
});

// Forms state
const homeForm = reactive({
  heroBadge: '',
  heroTitle1: '',
  heroTitle1Highlight: '',
  heroTitle2: '',
  heroTitle2Highlight: '',
  heroCtaText: '',
  heroCtaLink: '',
  divisionRibbonTitle: '',
  divisionRibbonItems: [],
  camavisBannerTag: '',
  camavisBannerTitle: '',
  camavisBannerDesc: '',
  camavisBannerCtaText: '',
  camavisBannerCtaLink: '',
});

const aboutForm = reactive({
  badge: '',
  title: '',
  subtitle: '',
  introTitle: '',
  introDesc1: '',
  introDesc2: '',
  quoteText: '',
  quoteAuthor: '',
  visionTitle: '',
  visionText: '',
  missionTitle: '',
  missionItems: [],
});

const contactForm = reactive({
  badge: '',
  title: '',
  subtitle: '',
  instantResponseTitle: '',
  instantResponseDesc: '',
  instantResponseButtonText: '',
  formTitle: '',
  formSubtitle: '',
  campusAddress: '',
  email: '',
  whatsappNumber: '',
  whatsappDisplay: '',
  whatsappDefaultMessage: '',
  instagramHandle: '',
  instagramUrl: '',
  tiktokHandle: '',
  tiktokUrl: '',
});

// Load data for active tab
const loadPageData = async (tab) => {
  loading.value = true;
  try {
    const res = await api.get(`/page-content/${tab}`);
    if (res.data?.success) {
      const data = res.data.data || {};
      metaInfo.isCustom = !!res.data.isCustom;
      metaInfo.updatedAt = res.data.updatedAt;
      metaInfo.updatedBy = res.data.updatedBy;

      if (tab === 'home') {
        Object.assign(homeForm, data);
        if (!Array.isArray(homeForm.divisionRibbonItems)) {
          homeForm.divisionRibbonItems = ['Desain', 'Photography', 'Videography', 'Public Relation (PR)'];
        }
      } else if (tab === 'about') {
        Object.assign(aboutForm, data);
        if (!Array.isArray(aboutForm.missionItems)) {
          aboutForm.missionItems = [];
        }
      } else if (tab === 'contact') {
        Object.assign(contactForm, data);
      }
    }
  } catch (err) {
    console.error('Failed to load page content:', err);
    toast.error('Gagal memuat konten halaman dari server');
  } finally {
    loading.value = false;
  }
};

const switchTab = (tabId) => {
  activeTab.value = tabId;
  loadPageData(tabId);
};

// Save changes
const handleSave = async () => {
  saving.value = true;
  try {
    let payload = {};
    if (activeTab.value === 'home') payload = homeForm;
    else if (activeTab.value === 'about') payload = aboutForm;
    else if (activeTab.value === 'contact') payload = contactForm;

    const res = await api.put(`/page-content/${activeTab.value}`, { content: payload });
    if (res.data?.success) {
      toast.success(res.data.message || 'Perubahan berhasil disimpan!');
      metaInfo.isCustom = true;
      metaInfo.updatedAt = new Date().toISOString();
    }
  } catch (err) {
    console.error('Save failed:', err);
    toast.error(err.response?.data?.message || 'Gagal menyimpan perubahan. Pastikan Anda memiliki hak Superadmin.');
  } finally {
    saving.value = false;
  }
};

// Reset to default
const handleReset = async () => {
  reseting.value = true;
  try {
    const res = await api.post(`/page-content/${activeTab.value}/reset`);
    if (res.data?.success) {
      toast.success(res.data.message || 'Konten berhasil di-reset ke bawaan!');
      showResetModal.value = false;
      await loadPageData(activeTab.value);
    }
  } catch (err) {
    console.error('Reset failed:', err);
    toast.error(err.response?.data?.message || 'Gagal mereset konten');
  } finally {
    reseting.value = false;
  }
};

// Mission Items helpers
const addMissionItem = () => {
  aboutForm.missionItems.push('');
};

const removeMissionItem = (index) => {
  aboutForm.missionItems.splice(index, 1);
};

// Division items helpers
const ribbonItemsString = ref('');
const updateRibbonFromString = () => {
  homeForm.divisionRibbonItems = ribbonItemsString.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

onMounted(() => {
  loadPageData(activeTab.value);
});
</script>

<template>
  <div class="space-y-8 max-w-6xl mx-auto pb-16">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-950/80 via-primary to-royal/20 border border-sky-500/25 shadow-xl backdrop-blur-xl">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-mono font-medium">
          <ShieldCheck :size="14" />
          <span>SUPERADMIN EXCLUSIVE CMS</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
          Editor Konten Halaman Utama
        </h1>
        <p class="text-sm text-slate-300 max-w-2xl font-light">
          Kustomisasi teks, slogan, dan informasi penting pada halaman Beranda, Tentang, dan Kontak secara langsung tanpa mengubah baris kode.
        </p>
      </div>

      <!-- Action Buttons Top -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="showResetModal = true"
          :disabled="loading || saving || resetting"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <RotateCcw :size="16" />
          <span>Reset ke Bawaan</span>
        </button>
        <button
          type="button"
          @click="handleSave"
          :disabled="loading || saving"
          class="btn-accent inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/25 active:scale-95 disabled:opacity-50"
        >
          <Save :size="16" />
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
        </button>
      </div>
    </div>

    <!-- Tab Selector Navigation -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button
        v-for="t in tabs"
        :key="t.id"
        @click="switchTab(t.id)"
        type="button"
        :class="[
          'flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200',
          activeTab === t.id
            ? 'bg-sky-500/15 border-sky-500/40 shadow-lg shadow-sky-500/10 text-white ring-1 ring-sky-500/30'
            : 'bg-slate-900/60 dark:bg-white/[0.02] border-slate-700/60 dark:border-white/10 text-slate-400 hover:text-slate-200 hover:border-slate-600'
        ]"
      >
        <div
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
            activeTab === t.id ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'bg-slate-800 text-slate-400'
          ]"
        >
          <component :is="t.icon" :size="20" />
        </div>
        <div class="space-y-0.5">
          <span class="text-sm font-bold block" :class="activeTab === t.id ? 'text-sky-300' : 'text-slate-200'">
            {{ t.label }}
          </span>
          <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {{ t.desc }}
          </p>
        </div>
      </button>
    </div>

    <!-- Status Ribbon -->
    <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 font-mono">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="metaInfo.isCustom ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'"></span>
        <span>
          Status: <strong class="text-slate-200">{{ metaInfo.isCustom ? 'Konten Kustom Aktif' : 'Memakai Template Bawaan' }}</strong>
        </span>
      </div>
      <div v-if="metaInfo.updatedAt" class="hidden sm:block">
        Terakhir diubah: <span class="text-sky-400">{{ new Date(metaInfo.updatedAt).toLocaleString('id-ID') }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-16 flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p class="text-sm font-mono text-slate-400">Memuat konfigurasi halaman...</p>
    </div>

    <!-- Forms Container -->
    <div v-else class="space-y-8">
      <!-- ============================================================== -->
      <!-- TAB 1: BERANDA (HOME)                                          -->
      <!-- ============================================================== -->
      <div v-if="activeTab === 'home'" class="space-y-8">
        <!-- Section 1: Hero Typography -->
        <div class="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Sparkles :size="18" class="text-sky-400" />
              <span>Hero Header Section (Tampilan Utama Paling Atas)</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Atur judul besar yang pertama kali dilihat pengunjung saat membuka website.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Hero Badge -->
            <div class="md:col-span-2">
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Teks Badge / Lencana Atas
              </label>
              <input
                v-model="homeForm.heroBadge"
                type="text"
                class="input-field"
                placeholder="Contoh: UKM DKV — Universitas Merangin"
              />
            </div>

            <!-- Baris 1: Ideas Become -->
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Judul Baris 1: Teks Utama
              </label>
              <input
                v-model="homeForm.heroTitle1"
                type="text"
                class="input-field"
                placeholder="Contoh: Ideas Become"
              />
            </div>

            <!-- Baris 1: Reality, (Highlight) -->
            <div>
              <label class="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                Judul Baris 1: Teks Highlight Cyan (Italic)
              </label>
              <input
                v-model="homeForm.heroTitle1Highlight"
                type="text"
                class="input-field border-cyan-500/40 text-cyan-300 focus:border-cyan-400"
                placeholder="Contoh: Reality,"
              />
            </div>

            <!-- Baris 2: Visuals Become -->
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Judul Baris 2: Teks Utama
              </label>
              <input
                v-model="homeForm.heroTitle2"
                type="text"
                class="input-field"
                placeholder="Contoh: Visuals Become"
              />
            </div>

            <!-- Baris 2: Stories (Underline) -->
            <div>
              <label class="block text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider mb-2">
                Judul Baris 2: Teks Bergaris Bawah (Underline)
              </label>
              <input
                v-model="homeForm.heroTitle2Highlight"
                type="text"
                class="input-field border-sky-500/40 text-sky-300 focus:border-sky-400"
                placeholder="Contoh: Stories"
              />
            </div>

            <!-- CTA Button -->
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Teks Tombol Aksi (CTA) Hero
              </label>
              <input
                v-model="homeForm.heroCtaText"
                type="text"
                class="input-field"
                placeholder="Contoh: Eksplorasi Portofolio"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tautan Tombol Aksi (Link)
              </label>
              <input
                v-model="homeForm.heroCtaLink"
                type="text"
                class="input-field font-mono text-xs"
                placeholder="Contoh: /portfolio"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Banner CAMAVIS Call To Action -->
        <div class="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-lg font-bold font-heading text-white">
              Banner Pendaftaran CAMAVIS (Bagian Bawah Beranda)
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Ubah ajakan bergabung untuk calon mahasiswa/anggota baru di bagian penutup beranda.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tagline Lencana
              </label>
              <input
                v-model="homeForm.camavisBannerTag"
                type="text"
                class="input-field"
                placeholder="Contoh: REKRUTMEN TERBUKA"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Judul Utama Banner
              </label>
              <input
                v-model="homeForm.camavisBannerTitle"
                type="text"
                class="input-field"
                placeholder="Contoh: Bergabung sebagai CAMAVIS?"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Deskripsi Ajakan
              </label>
              <textarea
                v-model="homeForm.camavisBannerDesc"
                rows="3"
                class="input-field resize-none"
                placeholder="Tuliskan kalimat ajakan persuasif..."
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Teks Tombol Pendaftaran
              </label>
              <input
                v-model="homeForm.camavisBannerCtaText"
                type="text"
                class="input-field"
                placeholder="Contoh: Daftar Sekarang"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tautan Tombol (Link)
              </label>
              <input
                v-model="homeForm.camavisBannerCtaLink"
                type="text"
                class="input-field font-mono text-xs"
                placeholder="Contoh: /camavis"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TAB 2: TENTANG (ABOUT)                                         -->
      <!-- ============================================================== -->
      <div v-if="activeTab === 'about'" class="space-y-8">
        <!-- Header & Intro -->
        <div class="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-lg font-bold font-heading text-white">
              Profil & Pengenalan Organisasi
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Atur teks header dan uraian profil UKM DKV Universitas Merangin.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Badge Header
              </label>
              <input
                v-model="aboutForm.badge"
                type="text"
                class="input-field"
                placeholder="DKV PHILOSOPHY & IDENTITY"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Judul Halaman
              </label>
              <input
                v-model="aboutForm.title"
                type="text"
                class="input-field"
                placeholder="Tentang DKV Universitas Merangin"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Subjudul Halaman
              </label>
              <input
                v-model="aboutForm.subtitle"
                type="text"
                class="input-field"
                placeholder="Wadah eksplorasi visual, inovasi desain..."
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Paragraf Pengenalan 1
              </label>
              <textarea
                v-model="aboutForm.introDesc1"
                rows="4"
                class="input-field resize-none leading-relaxed"
                placeholder="Paragraf pertama profil..."
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Paragraf Pengenalan 2 (Kolaborasi 4 Divisi)
              </label>
              <textarea
                v-model="aboutForm.introDesc2"
                rows="3"
                class="input-field resize-none leading-relaxed"
                placeholder="Paragraf kedua profil..."
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                Motto / Kutipan Filosofi
              </label>
              <input
                v-model="aboutForm.quoteText"
                type="text"
                class="input-field text-cyan-300"
                placeholder="Ideas Become Reality, Visuals Become Stories"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Label Pengutip Motto
              </label>
              <input
                v-model="aboutForm.quoteAuthor"
                type="text"
                class="input-field"
                placeholder="Motto Resmi DKV Universitas Merangin"
              />
            </div>
          </div>
        </div>

        <!-- Visi & Misi -->
        <div class="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-lg font-bold font-heading text-white">
              Visi & Butir-Butir Misi
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Sesuaikan tujuan jangka panjang dan langkah misi strategis organisasi.
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Teks Visi Kami
              </label>
              <textarea
                v-model="aboutForm.visionText"
                rows="3"
                class="input-field resize-none leading-relaxed"
                placeholder="Tuliskan visi UKM DKV..."
              ></textarea>
            </div>

            <!-- Dynamic Mission Items -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Daftar Butir Misi ({{ aboutForm.missionItems.length }} Poin)
                </label>
                <button
                  type="button"
                  @click="addMissionItem"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold transition-all"
                >
                  <Plus :size="14" />
                  <span>Tambah Poin Misi</span>
                </button>
              </div>

              <div class="space-y-2.5">
                <div
                  v-for="(item, idx) in aboutForm.missionItems"
                  :key="idx"
                  class="flex items-center gap-2.5"
                >
                  <span class="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-sky-400 font-mono text-xs flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <input
                    v-model="aboutForm.missionItems[idx]"
                    type="text"
                    class="input-field text-sm"
                    :placeholder="`Poin misi ke-${idx + 1}...`"
                  />
                  <button
                    type="button"
                    @click="removeMissionItem(idx)"
                    class="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0 transition-colors"
                    title="Hapus Poin"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- TAB 3: KONTAK (CONTACT)                                        -->
      <!-- ============================================================== -->
      <div v-if="activeTab === 'contact'" class="space-y-8">
        <!-- WhatsApp Narahubung & Template -->
        <div class="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-lg font-bold font-heading text-white flex items-center gap-2">
              <PhoneCall :size="18" class="text-emerald-400" />
              <span>Narahubung & WhatsApp Fast Response</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Nomor WhatsApp ini digunakan untuk tombol "Chat Langsung via WhatsApp" dan formulir pesan cepat.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Nomor WhatsApp (Angka saja, diawali 62)
              </label>
              <input
                v-model="contactForm.whatsappNumber"
                type="text"
                class="input-field border-emerald-500/40 text-emerald-300 focus:border-emerald-400 font-mono"
                placeholder="Contoh: 6282289656828"
              />
              <span class="text-[11px] text-slate-500 mt-1 block font-mono">
                Gunakan awalan 62 tanpa spasi atau tanda plus (contoh: 6282289656828)
              </span>
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tampilan Teks Nomor WhatsApp
              </label>
              <input
                v-model="contactForm.whatsappDisplay"
                type="text"
                class="input-field font-mono"
                placeholder="Contoh: +62 822-8965-6828"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Pesan Default Tombol "Chat Langsung via WhatsApp"
              </label>
              <textarea
                v-model="contactForm.whatsappDefaultMessage"
                rows="2"
                class="input-field resize-none"
                placeholder="Pesan pembuka yang otomatis muncul di WA..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Info Sekretariat & Media Sosial -->
        <div class="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div class="border-b border-slate-800 pb-4">
            <h2 class="text-lg font-bold font-heading text-white">
              Sekretariat & Tautan Media Sosial Resmi
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Informasi alamat, email resmi, akun Instagram, dan akun TikTok.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Resmi Organisasi
              </label>
              <input
                v-model="contactForm.email"
                type="email"
                class="input-field font-mono text-xs"
                placeholder="viscode0um@gmail.com"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Alamat Kampus / Sekretariat
              </label>
              <input
                v-model="contactForm.campusAddress"
                type="text"
                class="input-field"
                placeholder="Kampus Universitas Merangin, Bangko, Jambi"
              />
            </div>

            <!-- Instagram -->
            <div>
              <label class="block text-xs font-mono font-semibold text-pink-400 uppercase tracking-wider mb-2">
                Username Instagram (dengan @)
              </label>
              <input
                v-model="contactForm.instagramHandle"
                type="text"
                class="input-field border-pink-500/30 text-pink-300"
                placeholder="@viscode_um"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                URL Profil Instagram
              </label>
              <input
                v-model="contactForm.instagramUrl"
                type="url"
                class="input-field font-mono text-xs"
                placeholder="https://www.instagram.com/viscode_um/"
              />
            </div>

            <!-- TikTok -->
            <div>
              <label class="block text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                Username TikTok (dengan @)
              </label>
              <input
                v-model="contactForm.tiktokHandle"
                type="text"
                class="input-field border-cyan-500/30 text-cyan-300"
                placeholder="@viscode_univmerangin"
              />
            </div>

            <div>
              <label class="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                URL Profil TikTok
              </label>
              <input
                v-model="contactForm.tiktokUrl"
                type="url"
                class="input-field font-mono text-xs"
                placeholder="https://www.tiktok.com/@viscode_univmerangin..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Floating Save Bar for convenience -->
    <div class="fixed bottom-6 right-6 z-30 flex items-center gap-3 p-3 rounded-2xl bg-slate-900/95 border border-sky-500/30 shadow-2xl backdrop-blur-xl">
      <button
        type="button"
        @click="showResetModal = true"
        :disabled="saving || resetting"
        class="px-4 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/10 transition-colors"
      >
        Reset Default
      </button>
      <button
        type="button"
        @click="handleSave"
        :disabled="saving"
        class="btn-accent px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-sky-500/30"
      >
        <Save :size="15" />
        <span>{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
      </button>
    </div>

    <!-- Confirmation Modal for Reset -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
          <AlertTriangle :size="24" />
        </div>
        <h3 class="text-xl font-heading font-bold text-white">
          Reset Konten ke Bawaan?
        </h3>
        <p class="text-sm text-slate-300 leading-relaxed">
          Tindakan ini akan menghapus kustomisasi pada tab <strong class="text-sky-400">{{ tabs.find(t => t.id === activeTab)?.label }}</strong> dan mengembalikannya ke template teks standar sistem.
        </p>
        <div class="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            @click="showResetModal = false"
            :disabled="resetting"
            class="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            @click="handleReset"
            :disabled="resetting"
            class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
          >
            <span>{{ resetting ? 'Mereset...' : 'Ya, Kembalikan ke Bawaan' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
