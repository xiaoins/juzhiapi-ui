<template>
  <div class="min-h-screen bg-claude-bg flex">
    <aside class="w-64 bg-white border-r border-claude-border flex flex-col">
      <div class="p-4 border-b border-claude-border">
        <h1 class="text-xl font-serif font-semibold text-claude-text">AI Platform</h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
          :class="[
            $route.path === item.path
              ? 'bg-claude-accent text-white'
              : 'text-claude-muted hover:bg-claude-secondary hover:text-claude-text'
          ]"
        >
          <component :is="item.icon" :size="20" />
          {{ item.name }}
        </router-link>

        <template v-if="authStore.isAdmin">
          <div class="pt-4 pb-2">
            <span class="text-[10px] font-bold uppercase tracking-widest text-claude-subtle">Admin</span>
          </div>
          <router-link
            to="/app/admin"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            :class="[
              $route.path === '/app/admin'
                ? 'bg-claude-accent text-white'
                : 'text-claude-muted hover:bg-claude-secondary hover:text-claude-text'
            ]"
          >
            <Settings :size="20" />
            Admin Panel
          </router-link>
        </template>
      </nav>

      <div class="p-4 border-t border-claude-border">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-claude-accent/10 flex items-center justify-center">
            <span class="text-sm font-bold text-claude-accent">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-claude-text truncate">{{ authStore.userInfo?.username }}</p>
            <p class="text-xs text-claude-subtle">{{ authStore.isAdmin ? 'Administrator' : 'User' }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-claude-muted hover:text-claude-text hover:bg-claude-secondary rounded-xl transition-all"
        >
          <LogOut :size="18" />
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-hidden">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { MessageSquare, Key, Wallet, Settings, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { path: '/app/chat', name: 'Chat', icon: MessageSquare },
  { path: '/app/api-keys', name: 'API Keys', icon: Key },
  { path: '/app/wallet', name: 'Wallet', icon: Wallet },
];

const userInitial = computed(() => {
  return authStore.userInfo?.username?.charAt(0).toUpperCase() || 'U';
});

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>
