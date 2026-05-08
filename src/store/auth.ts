import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, LoginData, RegisterData, UserInfo } from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const loading = ref(false);

  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => userInfo.value?.role === 'ADMIN');

  async function login(data: LoginData) {
    loading.value = true;
    try {
      const res = await authApi.login(data);
      token.value = res.data.token;
      userInfo.value = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return true;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterData) {
    loading.value = true;
    try {
      await authApi.register(data);
      return true;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      token.value = null;
      userInfo.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return;
    try {
      const res = await authApi.getCurrentUser();
      userInfo.value = res.data;
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (error) {
      logout();
      throw error;
    }
  }

  return {
    token,
    userInfo,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
});