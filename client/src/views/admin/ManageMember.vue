<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import api from '../../utils/api';
import { User, Crop, ZoomIn, ZoomOut, RotateCcw, ChevronDown } from 'lucide-vue-next';

const { t } = useI18n();
const toast = useToast();
const members = ref([]);
const loading = ref(true);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);

const genOptions = ['MAVIS GEN I', 'MAVIS GEN II', 'MAVIS GEN III'];

const majorOptions = [
  'PGSD',
  'PGPAUD',
  'PBSI',
  'Pend. Matematika',
  'Pend. Biologi',
  'Pend. Ekonomi',
  'Pend. Bahasa Inggris',
  'Pend. Luar Sekolah',
  'Hukum',
  'Hukum Bisnis',
  'Biologi',
  'Teknologi Informasi',
  'Sistem Informasi',
  'Bisnis Digital',
  'Kewirausahaan',
  'Pendidikan Profesi Guru',
];

const positionOptions = [
  'Ketua Umum',
  'Wakil Ketua',
  'Sekretaris I',
  'Sekretaris II',
  'Bendahara I',
  'Bendahara II',
  'Anggota',
];

const divisionOptions = [
  'Desain',
  'Photography',
  'Videography',
  'Public Relation',
];

const form = reactive({
  name: '',
  position: '',
  division: '',
  major: '',
  genMavis: '',
  instagram: '',
  isActive: true,
  photo: null,
});

// Photo Cropper & Positioner State
const VIEW_SIZE = 280; // 280x280 px square frame
const showCropper = ref(false);
const rawImageSrc = ref('');
const photoPreview = ref('');
const cropZoom = ref(1.0);
const cropOffset = reactive({ x: 0, y: 0 });
const imgDisplayW = ref(VIEW_SIZE);
const imgDisplayH = ref(VIEW_SIZE);
let loadedImageObj = null;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let initialOffsetX = 0;
let initialOffsetY = 0;

const onFileSelected = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    rawImageSrc.value = evt.target.result;
    initCropperWithImage(evt.target.result);
  };
  reader.readAsDataURL(file);
  e.target.value = '';
};

const openAdjuster = () => {
  if (!rawImageSrc.value) return;
  initCropperWithImage(rawImageSrc.value);
};

const initCropperWithImage = (src) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    loadedImageObj = img;
    cropZoom.value = 1.0;
    const baseScale = Math.max(VIEW_SIZE / img.naturalWidth, VIEW_SIZE / img.naturalHeight);
    imgDisplayW.value = img.naturalWidth * baseScale;
    imgDisplayH.value = img.naturalHeight * baseScale;
    // Center initially
    cropOffset.x = (VIEW_SIZE - imgDisplayW.value) / 2;
    cropOffset.y = (VIEW_SIZE - imgDisplayH.value) / 2;
    showCropper.value = true;
  };
  img.src = src;
};

const updateZoomAndDimensions = () => {
  if (!loadedImageObj) return;
  const baseScale = Math.max(VIEW_SIZE / loadedImageObj.naturalWidth, VIEW_SIZE / loadedImageObj.naturalHeight);
  const newW = loadedImageObj.naturalWidth * baseScale * cropZoom.value;
  const newH = loadedImageObj.naturalHeight * baseScale * cropZoom.value;

  const centerX = cropOffset.x - VIEW_SIZE / 2;
  const centerY = cropOffset.y - VIEW_SIZE / 2;
  const ratio = newW / imgDisplayW.value;

  cropOffset.x = centerX * ratio + VIEW_SIZE / 2;
  cropOffset.y = centerY * ratio + VIEW_SIZE / 2;

  imgDisplayW.value = newW;
  imgDisplayH.value = newH;

  const minX = VIEW_SIZE - newW;
  const minY = VIEW_SIZE - newH;
  cropOffset.x = Math.min(0, Math.max(minX, cropOffset.x));
  cropOffset.y = Math.min(0, Math.max(minY, cropOffset.y));
};

const resetCrop = () => {
  if (!loadedImageObj) return;
  cropZoom.value = 1.0;
  const baseScale = Math.max(VIEW_SIZE / loadedImageObj.naturalWidth, VIEW_SIZE / loadedImageObj.naturalHeight);
  imgDisplayW.value = loadedImageObj.naturalWidth * baseScale;
  imgDisplayH.value = loadedImageObj.naturalHeight * baseScale;
  cropOffset.x = (VIEW_SIZE - imgDisplayW.value) / 2;
  cropOffset.y = (VIEW_SIZE - imgDisplayH.value) / 2;
};

const startDrag = (e) => {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialOffsetX = cropOffset.x;
  initialOffsetY = cropOffset.y;
};

const onDrag = (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;
  const newX = initialOffsetX + deltaX;
  const newY = initialOffsetY + deltaY;

  const minX = VIEW_SIZE - imgDisplayW.value;
  const minY = VIEW_SIZE - imgDisplayH.value;
  cropOffset.x = Math.min(0, Math.max(minX, newX));
  cropOffset.y = Math.min(0, Math.max(minY, newY));
};

const startTouch = (e) => {
  if (e.touches.length === 1) {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    initialOffsetX = cropOffset.x;
    initialOffsetY = cropOffset.y;
  }
};

const onTouchMove = (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - dragStartX;
  const deltaY = e.touches[0].clientY - dragStartY;
  const newX = initialOffsetX + deltaX;
  const newY = initialOffsetY + deltaY;

  const minX = VIEW_SIZE - imgDisplayW.value;
  const minY = VIEW_SIZE - imgDisplayH.value;
  cropOffset.x = Math.min(0, Math.max(minX, newX));
  cropOffset.y = Math.min(0, Math.max(minY, newY));
};

const endDrag = () => {
  isDragging = false;
};

const applyCrop = () => {
  if (!loadedImageObj) return;

  const canvas = document.createElement('canvas');
  const OUTPUT_SIZE = 600;
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d');

  const factor = OUTPUT_SIZE / VIEW_SIZE;
  ctx.drawImage(
    loadedImageObj,
    cropOffset.x * factor,
    cropOffset.y * factor,
    imgDisplayW.value * factor,
    imgDisplayH.value * factor
  );

  canvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], 'avatar_kotak.jpg', { type: 'image/jpeg' });
    form.photo = file;
    photoPreview.value = URL.createObjectURL(blob);
    showCropper.value = false;
    toast.success('Posisi foto profil berhasil disesuaikan!');
  }, 'image/jpeg', 0.92);
};

const cancelCrop = () => {
  showCropper.value = false;
};

const clearPhoto = () => {
  form.photo = null;
  photoPreview.value = '';
  rawImageSrc.value = '';
};

const fetchMembers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/members');
    members.value = res.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  editing.value = null;
  Object.assign(form, {
    name: '',
    position: '',
    division: '',
    major: '',
    genMavis: '',
    instagram: '',
    isActive: true,
    photo: null,
  });
  clearPhoto();
  showForm.value = true;
};

const openEdit = (m) => {
  editing.value = m;
  Object.assign(form, {
    name: m.name,
    position: m.position,
    division: m.division,
    major: m.major || (m.year ? String(m.year) : ''),
    genMavis: m.genMavis || '',
    instagram: m.instagram || '',
    isActive: m.isActive,
    photo: null,
  });
  photoPreview.value = m.photo || '';
  rawImageSrc.value = m.photo || '';
  showForm.value = true;
};

const handleSave = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('position', form.position);
    fd.append('division', form.division);
    fd.append('major', form.major);
    fd.append('genMavis', form.genMavis);
    fd.append('instagram', form.instagram);
    fd.append('isActive', form.isActive);
    if (form.photo) fd.append('photo', form.photo);

    if (editing.value) {
      await api.put(`/members/${editing.value._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Anggota diperbarui!');
    } else {
      await api.post('/members', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Anggota ditambahkan!');
    }
    showForm.value = false;
    fetchMembers();
  } catch (e) {
    toast.error(e.response?.data?.message || 'Terjadi kesalahan');
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (id) => {
  if (!confirm(t('common.confirm_delete'))) return;
  try {
    await api.delete(`/members/${id}`);
    toast.success('Dihapus!');
    fetchMembers();
  } catch {
    toast.error('Gagal menghapus');
  }
};

onMounted(fetchMembers);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelola Anggota</h1>
      <button @click="openCreate" class="btn-accent">+ Tambah Anggota</button>
    </div>

    <!-- Create / Edit Form -->
    <div v-if="showForm" class="bg-white dark:bg-secondary rounded-2xl p-6 shadow mb-6">
      <h2 class="font-heading text-xl font-bold text-gray-900 dark:text-white mb-5">
        {{ editing ? 'Edit Anggota' : 'Anggota Baru' }}
      </h2>
      <form @submit.prevent="handleSave" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama *</label>
          <input v-model="form.name" required class="input-field" placeholder="Nama lengkap" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kedudukan *</label>
          <div class="relative">
            <select
              v-model="form.position"
              required
              class="input-field appearance-none pr-10 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Kedudukan --</option>
              <option
                v-for="pos in positionOptions"
                :key="pos"
                :value="pos"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ pos }}
              </option>
              <option
                v-if="form.position && !positionOptions.includes(form.position)"
                :value="form.position"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ form.position }}
              </option>
            </select>
            <ChevronDown
              :size="16"
              class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Divisi *</label>
          <div class="relative">
            <select
              v-model="form.division"
              required
              class="input-field appearance-none pr-10 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Divisi --</option>
              <option
                v-for="div in divisionOptions"
                :key="div"
                :value="div"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ div }}
              </option>
              <option
                v-if="form.division && !divisionOptions.includes(form.division)"
                :value="form.division"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ form.division }}
              </option>
            </select>
            <ChevronDown
              :size="16"
              class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program Studi *</label>
          <div class="relative">
            <select
              v-model="form.major"
              required
              class="input-field appearance-none pr-10 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Program Studi --</option>
              <option
                v-for="m in majorOptions"
                :key="m"
                :value="m"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ m }}
              </option>
              <option
                v-if="form.major && !majorOptions.includes(form.major)"
                :value="form.major"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ form.major }}
              </option>
            </select>
            <ChevronDown
              :size="16"
              class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gen Mavis</label>
          <div class="relative">
            <select
              v-model="form.genMavis"
              class="input-field appearance-none pr-10 cursor-pointer"
            >
              <option value="">-- Pilih Gen Mavis --</option>
              <option
                v-for="gen in genOptions"
                :key="gen"
                :value="gen"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ gen }}
              </option>
              <option
                v-if="form.genMavis && !genOptions.includes(form.genMavis)"
                :value="form.genMavis"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {{ form.genMavis }}
              </option>
            </select>
            <ChevronDown
              :size="16"
              class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
          <input v-model="form.instagram" class="input-field" placeholder="@username" />
        </div>

        <!-- Custom Photo Upload with Round Shape Preview & Position Adjuster -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Foto Profil (Kotak Round Shape) {{ editing ? '(kosongkan jika tidak ingin mengganti)' : '' }}
          </label>

          <div class="flex flex-wrap items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
            <!-- Round Square Preview Box -->
            <div class="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-amber-400 flex items-center justify-center shadow-md flex-shrink-0 group">
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Preview Foto"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 text-xs">
                <User :size="28" class="opacity-40 mb-1" />
                <span>Belum ada</span>
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="flex-1 space-y-2">
              <div class="flex flex-wrap gap-2">
                <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors shadow-sm">
                  <span>{{ photoPreview ? 'Pilih / Ganti Foto' : '+ Upload Foto' }}</span>
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileSelected"
                    class="hidden"
                  />
                </label>

                <button
                  v-if="rawImageSrc"
                  type="button"
                  @click="openAdjuster"
                  class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/20 hover:border-sky-500 text-slate-700 dark:text-gray-200 hover:text-sky-600 transition-colors"
                >
                  <Crop :size="14" />
                  <span>Atur Posisi & Zoom</span>
                </button>

                <button
                  v-if="photoPreview"
                  type="button"
                  @click="clearPhoto"
                  class="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <span>Hapus</span>
                </button>
              </div>

              <p class="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                Saat memilih foto, alat pemotong otomatis terbuka agar Anda dapat menggeser posisi wajah dan mengatur zoom sesuai bingkai kotak round shape tanpa terpotong.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" v-model="form.isActive" id="mactive" class="w-4 h-4 accent-accent" />
          <label for="mactive" class="text-sm text-gray-700 dark:text-gray-300">Anggota aktif</label>
        </div>
        <div class="md:col-span-2 flex gap-3">
          <button type="submit" :disabled="saving" class="btn-accent disabled:opacity-60">
            {{ saving ? 'Menyimpan...' : t('common.save') }}
          </button>
          <button
            type="button"
            @click="showForm = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Member Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <LoadingSpinner v-if="loading" class="col-span-full" />
      <div
        v-for="m in members"
        :key="m._id"
        class="bg-white dark:bg-secondary rounded-2xl p-4 shadow text-center"
      >
        <!-- Square Round Shape Profile Card -->
        <div class="w-16 h-16 mx-auto rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2 shadow-sm border border-slate-200 dark:border-white/10">
          <img v-if="m.photo" :src="m.photo" :alt="m.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <User :size="24" class="opacity-40" />
          </div>
        </div>
        <p class="font-semibold text-xs text-gray-900 dark:text-white truncate">{{ m.name }}</p>
        <p class="text-xs text-accent font-medium">{{ m.position }}</p>
        <p class="text-xs text-gray-400">{{ m.division }}</p>
        <p v-if="m.major" class="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ m.major }}</p>
        <span v-if="m.genMavis" class="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-medium">
          {{ m.genMavis }}
        </span>
        <div class="flex gap-1 mt-3">
          <button
            @click="openEdit(m)"
            class="flex-1 text-xs border border-blue-400 text-blue-400 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Edit
          </button>
          <button
            @click="handleDelete(m._id)"
            class="flex-1 text-xs border border-red-400 text-red-400 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
      <div
        v-if="!loading && members.length === 0"
        class="col-span-full text-center text-gray-400 py-12"
      >
        Belum ada anggota.
      </div>
    </div>

    <!-- Interactive Photo Cropper / Adjuster Modal -->
    <div
      v-if="showCropper"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div class="bg-white dark:bg-[#0c1427] border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 dark:text-white space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h3 class="font-heading text-lg font-bold">Atur Posisi Foto Profil</h3>
            <p class="text-xs text-slate-500 dark:text-gray-400">Geser & atur zoom agar wajah pas di bingkai kotak</p>
          </div>
          <button
            type="button"
            @click="cancelCrop"
            class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
          >
            ✕
          </button>
        </div>

        <!-- Viewport Cropper Container (Kotak Round Shape 280x280) -->
        <div class="flex justify-center">
          <div
            class="relative w-[280px] h-[280px] rounded-2xl overflow-hidden bg-slate-950 border-4 border-amber-400 shadow-xl cursor-grab active:cursor-grabbing select-none touch-none ring-4 ring-black/40"
            @mousedown="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchstart="startTouch"
            @touchmove="onTouchMove"
            @touchend="endDrag"
          >
            <!-- Rendered movable image -->
            <img
              v-if="rawImageSrc"
              :src="rawImageSrc"
              class="absolute pointer-events-none select-none max-w-none origin-top-left transition-none"
              :style="{
                width: `${imgDisplayW}px`,
                height: `${imgDisplayH}px`,
                transform: `translate3d(${cropOffset.x}px, ${cropOffset.y}px, 0)`,
              }"
            />

            <!-- Focus crosshairs guide -->
            <div class="absolute inset-0 pointer-events-none border border-white/20 rounded-2xl grid grid-cols-3 grid-rows-3 opacity-30">
              <div class="border-r border-b border-white/40"></div>
              <div class="border-r border-b border-white/40"></div>
              <div class="border-b border-white/40"></div>
              <div class="border-r border-b border-white/40"></div>
              <div class="border-r border-b border-white/40"></div>
              <div class="border-b border-white/40"></div>
              <div class="border-r border-white/40"></div>
              <div class="border-r border-white/40"></div>
              <div></div>
            </div>

            <!-- Hint overlay -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-[10px] text-white/90 px-3 py-1 rounded-full pointer-events-none whitespace-nowrap">
              👆 Klik & geser untuk posisikan wajah
            </div>
          </div>
        </div>

        <!-- Zoom Slider & Controls -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-600 dark:text-gray-300 font-mono">
            <span>Perbesar / Zoom</span>
            <span>{{ Math.round(cropZoom * 100) }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="cropZoom = Math.max(1, +(cropZoom - 0.1).toFixed(2)); updateZoomAndDimensions();"
              class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 font-bold flex items-center justify-center text-sm transition-colors"
            >
              <ZoomOut :size="16" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              v-model.number="cropZoom"
              @input="updateZoomAndDimensions"
              class="w-full accent-sky-500 cursor-pointer"
            />
            <button
              type="button"
              @click="cropZoom = Math.min(3, +(cropZoom + 0.1).toFixed(2)); updateZoomAndDimensions();"
              class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 font-bold flex items-center justify-center text-sm transition-colors"
            >
              <ZoomIn :size="16" />
            </button>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="resetCrop"
              class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-500 dark:hover:text-cyan-400 font-medium transition-colors"
            >
              <RotateCcw :size="12" />
              <span>Reset ke Tengah</span>
            </button>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            @click="cancelCrop"
            class="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            @click="applyCrop"
            class="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <span>✓ Terapkan Foto</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
