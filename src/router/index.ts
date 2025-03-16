import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import UserDetail from '../components/UserDetail.vue';
import LoginView from '../views/LoginView.vue';
import { useAuthStore } from '../store/authStore';

const routes = [
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/user/:id', name: 'UserDetail', component: UserDetail, props: true, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
