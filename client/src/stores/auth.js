import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('dekave_user')) || null);
  const token = ref(localStorage.getItem('dekave_token') || null);
  const isLoading = ref(false);

  const isAuthenticated = () => !!token.value;

  const login = async (identifier, password) => {
    isLoading.value = true;
    try {
      const res = await api.post('/auth/login', {
        identifier,
        email: identifier,
        username: identifier,
        password,
      });
      token.value = res.data.token;
      user.value = res.data.user;
      localStorage.setItem('dekave_token', res.data.token);
      localStorage.setItem('dekave_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      isLoading.value = false;
    }
  };

  const registerContributor = async (payload) => {
    return await api.post('/auth/register-contributor', payload);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('dekave_token');
    localStorage.removeItem('dekave_user');
  };

  return { user, token, isLoading, isAuthenticated, login, logout };
});
