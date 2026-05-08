<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white border-b border-claude-border px-6 py-4">
      <h2 class="text-xl font-semibold text-claude-text">Admin Panel</h2>
      <p class="text-sm text-claude-muted mt-1">Manage users, models, and view system logs</p>
    </header>

    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="bg-white border-b border-claude-border px-6">
        <nav class="flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-all"
            :class="activeTab === tab.id
              ? 'border-claude-accent text-claude-accent'
              : 'border-transparent text-claude-muted hover:text-claude-text'"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-claude-muted">Loading...</div>
        </div>

        <template v-else>
          <div v-if="activeTab === 'users'">
            <div class="bg-white rounded-2xl border border-claude-border overflow-hidden">
              <div class="px-6 py-4 border-b border-claude-border flex items-center justify-between">
                <h3 class="font-semibold text-claude-text">Users</h3>
              </div>
              <table class="w-full">
                <thead class="bg-claude-bg">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Username</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-claude-border">
                  <tr v-for="user in users" :key="user.id" class="hover:bg-claude-bg/50">
                    <td class="px-6 py-4 text-sm text-claude-text">{{ user.id }}</td>
                    <td class="px-6 py-4 text-sm font-medium text-claude-text">{{ user.username }}</td>
                    <td class="px-6 py-4 text-sm text-claude-muted">{{ user.email || '-' }}</td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                      >
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      >
                        {{ user.status === 1 ? 'Active' : 'Disabled' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-claude-subtle">{{ formatDate(user.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTab === 'models'">
            <div class="bg-white rounded-2xl border border-claude-border overflow-hidden">
              <div class="px-6 py-4 border-b border-claude-border flex items-center justify-between">
                <h3 class="font-semibold text-claude-text">AI Models</h3>
              </div>
              <table class="w-full">
                <thead class="bg-claude-bg">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Display Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Model Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Provider</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Input Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Output Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-claude-border">
                  <tr v-for="model in models" :key="model.id" class="hover:bg-claude-bg/50">
                    <td class="px-6 py-4 text-sm font-medium text-claude-text">{{ model.displayName }}</td>
                    <td class="px-6 py-4 text-sm text-claude-muted font-mono">{{ model.modelName }}</td>
                    <td class="px-6 py-4 text-sm text-claude-text">{{ model.provider }}</td>
                    <td class="px-6 py-4 text-sm text-claude-muted">{{ model.inputPrice }} / 1K</td>
                    <td class="px-6 py-4 text-sm text-claude-muted">{{ model.outputPrice }} / 1K</td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="model.enabled === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      >
                        {{ model.enabled === 1 ? 'Enabled' : 'Disabled' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTab === 'logs'">
            <div class="bg-white rounded-2xl border border-claude-border overflow-hidden">
              <div class="px-6 py-4 border-b border-claude-border">
                <h3 class="font-semibold text-claude-text">API Usage Logs</h3>
              </div>
              <table class="w-full">
                <thead class="bg-claude-bg">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Model</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Prompt Tokens</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Completion Tokens</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Cost</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-claude-subtle uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-claude-border">
                  <tr v-for="log in logs" :key="log.id" class="hover:bg-claude-bg/50">
                    <td class="px-6 py-4 text-sm text-claude-text">{{ log.userId }}</td>
                    <td class="px-6 py-4 text-sm text-claude-muted font-mono">{{ log.modelName }}</td>
                    <td class="px-6 py-4 text-sm text-claude-muted">{{ log.promptTokens }}</td>
                    <td class="px-6 py-4 text-sm text-claude-muted">{{ log.completionTokens }}</td>
                    <td class="px-6 py-4 text-sm font-medium text-claude-text">{{ log.cost }} credits</td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      >
                        {{ log.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-claude-subtle">{{ formatDate(log.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import request from '@/api/request';

const tabs = [
  { id: 'users', name: 'Users' },
  { id: 'models', name: 'Models' },
  { id: 'logs', name: 'Usage Logs' },
];

const activeTab = ref('users');
const loading = ref(false);
const users = ref<any[]>([]);
const models = ref<any[]>([]);
const logs = ref<any[]>([]);

async function loadUsers() {
  try {
    const res = await request.get('/api/admin/users');
    users.value = res.data?.records || [];
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

async function loadModels() {
  try {
    const res = await request.get('/api/admin/models');
    models.value = res.data?.records || [];
  } catch (error) {
    console.error('Failed to load models:', error);
  }
}

async function loadLogs() {
  try {
    const res = await request.get('/api/admin/logs');
    logs.value = res.data?.records || [];
  } catch (error) {
    console.error('Failed to load logs:', error);
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function loadData() {
  loading.value = true;
  try {
    switch (activeTab.value) {
      case 'users':
        await loadUsers();
        break;
      case 'models':
        await loadModels();
        break;
      case 'logs':
        await loadLogs();
        break;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>
