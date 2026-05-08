<template>
  <div class="min-h-screen bg-claude-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif font-semibold text-claude-text mb-2">Create Account</h1>
        <p class="text-claude-muted">Sign up to start using AI Platform</p>
      </div>

      <div class="bg-white rounded-2xl shadow-mockup p-8 border border-claude-border">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-claude-text mb-2">Username</label>
            <input
              v-model="formData.username"
              type="text"
              required
              minlength="3"
              maxlength="50"
              class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50 focus:border-claude-accent transition-all"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-claude-text mb-2">Password</label>
            <input
              v-model="formData.password"
              type="password"
              required
              minlength="6"
              maxlength="50"
              class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50 focus:border-claude-accent transition-all"
              placeholder="Choose a password (min 6 characters)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-claude-text mb-2">Email (Optional)</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50 focus:border-claude-accent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div v-if="errorMsg" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {{ errorMsg }}
          </div>

          <div v-if="successMsg" class="p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
            {{ successMsg }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-claude-muted">
            Already have an account?
            <router-link to="/login" class="text-claude-accent hover:text-claude-accent-hover font-medium">
              Sign in
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
import { RegisterData } from '@/api/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref<RegisterData>({
  username: '',
  password: '',
  email: '',
});

const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

async function handleRegister() {
  loading.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    await authStore.register(formData.value);
    successMsg.value = 'Account created successfully! Redirecting to login...';
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error: any) {
    errorMsg.value = error.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>
