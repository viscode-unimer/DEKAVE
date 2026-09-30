<script setup>
import { computed } from 'vue';
import {
  Crown,
  ShieldCheck,
  PenTool,
  Coins,
  Palette,
  Camera,
  Video,
  Megaphone,
  Clock,
  Sparkles,
  Instagram,
  User,
} from 'lucide-vue-next';

const props = defineProps({
  member: {
    type: Object,
    required: true,
  },
  isInactive: {
    type: Boolean,
    default: false,
  },
});

const roleMeta = computed(() => {
  const pos = (props.member.position || '').toLowerCase();
  const div = (props.member.division || '').toLowerCase();
  const nonActive = props.isInactive || !props.member.isActive || pos.includes('non aktif') || pos.includes('nonaktif') || pos.includes('demisioner') || pos.includes('alumni');

  if (nonActive) {
    return {
      icon: Clock,
      label: props.member.position || 'Non Aktif',
      badgeClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/30',
      cornerBadgeClass: 'bg-slate-500/20 text-slate-600 dark:text-slate-300 border border-slate-400/30',
      iconClass: 'text-slate-500 dark:text-slate-400',
      cardClass: 'border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 opacity-85 hover:opacity-100',
      photoBorder: 'border-slate-300 dark:border-slate-700',
      avatarBg: 'from-slate-600 to-slate-800',
    };
  }

  // Ketua Umum / Ketua
  if (pos.includes('ketua') && !pos.includes('wakil')) {
    return {
      icon: Crown,
      label: props.member.position || 'Ketua Umum',
      badgeClass: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/50 shadow-sm',
      cornerBadgeClass: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/30',
      iconClass: 'text-amber-500',
      cardClass: 'border-amber-400/80 dark:border-amber-400/60 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/15 bg-gradient-to-b from-amber-500/[0.04] to-transparent',
      photoBorder: 'border-amber-400 ring-2 ring-amber-400/30',
      avatarBg: 'from-amber-500 to-amber-700',
    };
  }

  // Wakil Ketua
  if (pos.includes('wakil')) {
    return {
      icon: ShieldCheck,
      label: props.member.position || 'Wakil Ketua',
      badgeClass: 'bg-sky-500/20 text-sky-800 dark:text-cyan-300 border-sky-400/50 shadow-sm',
      cornerBadgeClass: 'bg-gradient-to-br from-sky-400 to-cyan-600 text-white shadow-md shadow-sky-500/30',
      iconClass: 'text-sky-500 dark:text-cyan-400',
      cardClass: 'border-sky-400/80 dark:border-cyan-400/60 ring-2 ring-sky-400/30 shadow-xl shadow-sky-500/10 dark:shadow-cyan-500/15 bg-gradient-to-b from-sky-500/[0.04] to-transparent',
      photoBorder: 'border-sky-400 dark:border-cyan-400 ring-2 ring-sky-400/30',
      avatarBg: 'from-sky-500 to-cyan-700',
    };
  }

  // Sekretaris
  if (pos.includes('sekretaris')) {
    return {
      icon: PenTool,
      label: props.member.position || 'Sekretaris',
      badgeClass: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/50',
      cornerBadgeClass: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/40 shadow-sm',
      iconClass: 'text-emerald-500',
      cardClass: 'border-emerald-400/70 dark:border-emerald-500/50 ring-1 ring-emerald-400/25 shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/10 bg-gradient-to-b from-emerald-500/[0.03] to-transparent hover:border-emerald-400',
      photoBorder: 'border-emerald-400/80 ring-1 ring-emerald-400/30',
      avatarBg: 'from-emerald-500 to-emerald-700',
    };
  }

  // Bendahara
  if (pos.includes('bendahara')) {
    return {
      icon: Coins,
      label: props.member.position || 'Bendahara',
      badgeClass: 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-400/50',
      cornerBadgeClass: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-400/40 shadow-sm',
      iconClass: 'text-rose-500',
      cardClass: 'border-rose-400/70 dark:border-rose-500/50 ring-1 ring-rose-400/25 shadow-lg shadow-rose-500/5 dark:shadow-rose-500/10 bg-gradient-to-b from-rose-500/[0.03] to-transparent hover:border-rose-400',
      photoBorder: 'border-rose-400/80 ring-1 ring-rose-400/30',
      avatarBg: 'from-rose-500 to-rose-700',
    };
  }

  // Anggota Aktif per Divisi
  if (div.includes('desain')) {
    return {
      icon: Palette,
      label: props.member.position || 'Anggota Desain',
      badgeClass: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-400/40',
      cornerBadgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-400/30',
      iconClass: 'text-purple-500',
      cardClass: 'border-slate-200/80 dark:border-white/[0.08] hover:border-purple-400 dark:hover:border-purple-400/80 hover:shadow-lg hover:shadow-purple-500/10',
      photoBorder: 'border-slate-200 dark:border-white/10 group-hover:border-purple-400',
      avatarBg: 'from-purple-500 to-purple-700',
    };
  }

  if (div.includes('photo')) {
    return {
      icon: Camera,
      label: props.member.position || 'Anggota Foto',
      badgeClass: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-400/40',
      cornerBadgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-400/30',
      iconClass: 'text-sky-500',
      cardClass: 'border-slate-200/80 dark:border-white/[0.08] hover:border-sky-400 dark:hover:border-sky-400/80 hover:shadow-lg hover:shadow-sky-500/10',
      photoBorder: 'border-slate-200 dark:border-white/10 group-hover:border-sky-400',
      avatarBg: 'from-sky-500 to-sky-700',
    };
  }

  if (div.includes('video')) {
    return {
      icon: Video,
      label: props.member.position || 'Anggota Video',
      badgeClass: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-400/40',
      cornerBadgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-400/30',
      iconClass: 'text-rose-500',
      cardClass: 'border-slate-200/80 dark:border-white/[0.08] hover:border-rose-400 dark:hover:border-rose-400/80 hover:shadow-lg hover:shadow-rose-500/10',
      photoBorder: 'border-slate-200 dark:border-white/10 group-hover:border-rose-400',
      avatarBg: 'from-rose-500 to-rose-700',
    };
  }

  if (div.includes('public') || div.includes('pr') || div.includes('humas')) {
    return {
      icon: Megaphone,
      label: props.member.position || 'Anggota PR',
      badgeClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-400/40',
      cornerBadgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-400/30',
      iconClass: 'text-amber-500',
      cardClass: 'border-slate-200/80 dark:border-white/[0.08] hover:border-amber-400 dark:hover:border-amber-400/80 hover:shadow-lg hover:shadow-amber-500/10',
      photoBorder: 'border-slate-200 dark:border-white/10 group-hover:border-amber-400',
      avatarBg: 'from-amber-500 to-amber-700',
    };
  }

  // Fallback
  return {
    icon: Sparkles,
    label: props.member.position || 'Anggota',
    badgeClass: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-400/40',
    cornerBadgeClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-400/30',
    iconClass: 'text-cyan-500',
    cardClass: 'border-slate-200/80 dark:border-white/[0.08] hover:border-cyan-400 dark:hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/10',
    photoBorder: 'border-slate-200 dark:border-white/10 group-hover:border-cyan-400',
    avatarBg: 'from-cyan-500 to-cyan-700',
  };
});
</script>

<template>
  <!-- Card Container: Exactly Uniform Dimensions for ALL Cards -->
  <div
    class="group glass-card rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-between relative overflow-hidden hover:-translate-y-1.5 w-48 sm:w-52 h-[295px] p-4 flex-shrink-0"
    :class="roleMeta.cardClass"
  >
    <!-- Top-Right Role Symbol Badge -->
    <div
      class="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
      :class="roleMeta.cornerBadgeClass"
      :title="roleMeta.label"
    >
      <component :is="roleMeta.icon" :size="13" />
    </div>

    <!-- Main Card Body -->
    <div class="w-full flex flex-col items-center">
      <!-- Profile Photo (Kotak Round Shape / Squircle rounded-2xl) - Uniform Size -->
      <div
        class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 transition-all duration-300 shadow-md dark:shadow-lg dark:shadow-black/40 mb-3 relative"
        :class="roleMeta.photoBorder"
      >
        <img
          v-if="member.photo"
          :src="member.photo"
          :alt="member.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br text-2xl"
          :class="roleMeta.avatarBg"
        >
          <span>
            {{ member.name ? member.name.charAt(0).toUpperCase() : '?' }}
          </span>
        </div>
      </div>

      <!-- Member Name -->
      <h3
        class="font-heading font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors w-full px-1 text-sm sm:text-base"
        :title="member.name"
      >
        {{ member.name }}
      </h3>

      <!-- Role & Details -->
      <div class="mt-1.5 flex flex-col items-center gap-1 w-full">
        <!-- Role Badge with Symbol Icon -->
        <span
          class="inline-flex items-center gap-1.5 font-mono font-semibold px-2.5 py-0.5 rounded-full border text-[11px] max-w-full truncate"
          :class="roleMeta.badgeClass"
        >
          <component :is="roleMeta.icon" :size="11" class="flex-shrink-0" />
          <span class="truncate">{{ member.position }}</span>
        </span>

        <!-- Division -->
        <span class="text-[11px] font-mono text-slate-500 dark:text-gray-400 truncate max-w-full">
          Divisi {{ member.division }}
        </span>

        <!-- Major (Program Studi) if available -->
        <span
          v-if="member.major"
          class="text-[10px] font-mono text-slate-400 dark:text-gray-500 truncate max-w-full"
          :title="member.major"
        >
          {{ member.major }}
        </span>
      </div>
    </div>

    <!-- Card Footer: Instagram Link / Label -->
    <div class="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/[0.06] w-full flex items-center justify-center">
      <a
        v-if="member.instagram"
        :href="`https://instagram.com/${member.instagram.replace('@', '')}`"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-cyan-300 transition-colors truncate max-w-full"
        :title="`Instagram: @${member.instagram.replace('@', '')}`"
      >
        <Instagram :size="11" class="flex-shrink-0" />
        <span class="truncate">@{{ member.instagram.replace('@', '') }}</span>
      </a>
      <span v-else class="text-[10px] font-mono text-slate-400 dark:text-gray-600">
        UKM DEKAVE
      </span>
    </div>
  </div>
</template>
