<template>
  <div class="min-h-screen bg-claude-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="flex justify-center mb-6">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2 text-claude-muted hover:text-claude-text transition-all"
        >
          <ArrowLeft :size="16" />
          <span class="text-sm">Back to Home</span>
        </router-link>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif font-semibold text-claude-text mb-2">Welcome Back</h1>
        <p class="text-claude-muted">Sign in to continue to AI Platform</p>
      </div>

      <div class="bg-white rounded-2xl shadow-mockup p-8 border border-claude-border">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-claude-text mb-2">Username</label>
            <input
              v-model="formData.username"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50 focus:border-claude-accent transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-claude-text mb-2">Password</label>
            <input
              v-model="formData.password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50 focus:border-claude-accent transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="errorMsg" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {{ errorMsg }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-claude-muted">
            Don't have an account?
            <router-link to="/register" class="text-claude-accent hover:text-claude-accent-hover font-medium">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { LoginData } from '@/api/auth';
import { ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref<LoginData>({
  username: '',
  password: '',
});

const loading = ref(false);
const errorMsg = ref('');

async function handleLogin() {
  loading.value = true;
  errorMsg.value = '';

  try {
    await authStore.login(formData.value);
    router.push('/app/chat');
  } catch (error: any) {
    errorMsg.value = error.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
