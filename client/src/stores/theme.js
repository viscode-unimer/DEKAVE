import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  applyTheme();

  watch(isDark, (val) => {
    localStorage.setItem('theme', val ? 'dark' : 'light');
    applyTheme();
  });

  const toggle = () => { isDark.value = !isDark.value; };

  return { isDark, toggle };
});
