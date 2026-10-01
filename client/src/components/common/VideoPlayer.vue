<script setup>
import { computed } from 'vue';
import { parseVideo } from '../../utils/video';
import { ExternalLink, Film, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  videoUrl: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Video Player',
  },
});

const videoInfo = computed(() => parseVideo(props.videoUrl));

const openOriginal = () => {
  if (videoInfo.value.originalUrl) {
    window.open(videoInfo.value.originalUrl, '_blank', 'noopener,noreferrer');
  }
};
</script>

<template>
  <div v-if="videoInfo.isValid" class="w-full flex flex-col items-center">
    <!-- YouTube (Standard Landscape 16:9) -->
    <div
      v-if="videoInfo.type === 'youtube' && !videoInfo.isShort"
      class="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative"
    >
      <iframe
        :src="videoInfo.embedUrl"
        :title="title"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <!-- YouTube Shorts (Vertical 9:16) -->
    <div
      v-else-if="videoInfo.type === 'youtube' && videoInfo.isShort"
      class="w-full max-w-sm aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative"
    >
      <iframe
        :src="videoInfo.embedUrl"
        :title="title"
        class="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Instagram Reel / Post (Vertical) -->
    <div
      v-else-if="videoInfo.type === 'instagram'"
      class="w-full max-w-md aspect-[9/16] min-h-[500px] sm:min-h-[560px] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative"
    >
      <iframe
        :src="videoInfo.embedUrl"
        :title="title"
        class="w-full h-full border-0"
        scrolling="no"
        allowtransparency="true"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Other / Generic Embed -->
    <div
      v-else
      class="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative"
    >
      <iframe
        :src="videoInfo.embedUrl"
        :title="title"
        class="w-full h-full border-0"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Action Bar: Direct link to app/browser -->
    <div class="mt-4 flex items-center justify-between w-full max-w-2xl px-2">
      <div class="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-gray-400">
        <Film :size="14" class="text-sky-500 dark:text-cyan-400" />
        <span v-if="videoInfo.type === 'youtube'">
          {{ videoInfo.isShort ? 'YouTube Shorts' : 'YouTube Video' }}
        </span>
        <span v-else-if="videoInfo.type === 'instagram'">Instagram Reels</span>
        <span v-else>Video Media</span>
      </div>

      <button
        @click="openOriginal"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
      >
        <span>Tonton di {{ videoInfo.type === 'youtube' ? 'YouTube' : videoInfo.type === 'instagram' ? 'Instagram' : 'Sumber' }}</span>
        <ExternalLink :size="12" />
      </button>
    </div>
  </div>

  <div
    v-else
    class="w-full aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-300 dark:border-white/10"
  >
    <AlertCircle :size="36" class="text-amber-500 mb-2" />
    <p class="text-sm font-medium text-slate-700 dark:text-gray-300">Format link video tidak dikenali</p>
    <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Gunakan link YouTube atau Instagram Reels yang valid.</p>
  </div>
</template>
