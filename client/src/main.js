import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import router from './router';
import App from './App.vue';
import './style.css';

import id from './locales/id.json';
import en from './locales/en.json';

const savedLang = localStorage.getItem('dkv_lang') || localStorage.getItem('dekave_lang') || 'id';

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'id',
  messages: { id, en },
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});

app.mount('#app');
