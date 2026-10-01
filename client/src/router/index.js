import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', component: () => import('../views/Home.vue'), meta: { title: 'Beranda' } },
  { path: '/about', component: () => import('../views/About.vue'), meta: { title: 'Tentang DKV' } },
  { path: '/portfolio', component: () => import('../views/Portfolio.vue'), meta: { title: 'Portofolio' } },
  { path: '/portfolio/:id', component: () => import('../views/PortfolioDetail.vue') },
  { path: '/event', component: () => import('../views/Event.vue'), meta: { title: 'Event & Kegiatan' } },
  { path: '/event/:id', component: () => import('../views/EventDetail.vue') },
  { path: '/blog', component: () => import('../views/Blog.vue'), meta: { title: 'Blog & Artikel' } },
  { path: '/blog/:slug', component: () => import('../views/BlogDetail.vue') },
  { path: '/member', component: () => import('../views/Member.vue'), meta: { title: 'Anggota' } },
  { path: '/camavis', component: () => import('../views/Camavis.vue'), meta: { title: 'Daftar CAMAVIS' } },
  { path: '/contact', component: () => import('../views/Contact.vue'), meta: { title: 'Kontak' } },
  {
    path: '/admin/login',
    component: () => import('../views/admin/Login.vue'),
    meta: { title: 'Admin Login', guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue'), meta: { title: 'Dashboard' } },
      { path: 'portfolio', component: () => import('../views/admin/ManagePortfolio.vue'), meta: { title: 'Kelola Portofolio' } },
      { path: 'event', component: () => import('../views/admin/ManageEvent.vue'), meta: { title: 'Kelola Event' } },
      { path: 'blog', component: () => import('../views/admin/ManageBlog.vue'), meta: { title: 'Kelola Blog' } },
      { path: 'member', component: () => import('../views/admin/ManageMember.vue'), meta: { title: 'Kelola Anggota' } },
      { path: 'camavis', component: () => import('../views/admin/ManageCamavis.vue'), meta: { title: 'Kelola CAMAVIS' } },
      {
        path: 'users',
        component: () => import('../views/admin/ManageUsers.vue'),
        meta: { title: 'Kelola Tim & Contributor', superadminOnly: true },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return next('/admin/login');
  }
  if (to.meta.guestOnly && auth.isAuthenticated()) {
    return next('/admin/dashboard');
  }
  if (to.meta.superadminOnly && auth.user?.role !== 'superadmin') {
    return next('/admin/dashboard');
  }
  if (to.meta.title) document.title = `${to.meta.title} | DKV Universitas Merangin`;
  next();
});

export default router;
