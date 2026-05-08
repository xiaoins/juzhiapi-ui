import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/app',
    component: () => import('@/views/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/app/chat',
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/user/Chat.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'api-keys',
        name: 'ApiKeys',
        component: () => import('@/views/user/ApiKeys.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'wallet',
        name: 'Wallet',
        component: () => import('@/views/user/Wallet.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/admin/Admin.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/app/chat');
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    next('/app/chat');
  } else {
    next();
  }
});

export default router;