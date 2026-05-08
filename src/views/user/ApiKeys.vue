<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white border-b border-claude-border px-6 py-4 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-claude-text">API Keys</h2>
        <p class="text-sm text-claude-muted mt-1">Manage your API keys for external tools</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-claude-accent hover:bg-claude-accent-hover text-white text-sm font-medium rounded-xl transition-all"
      >
        <Plus :size="18" />
        Create API Key
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-claude-muted">Loading...</div>
      </div>

      <div v-else-if="apiKeys.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
        <Key :size="48" class="text-claude-subtle mb-4" />
        <p class="text-claude-muted">No API keys yet</p>
        <p class="text-sm text-claude-subtle mt-1">Create your first API key to start using external tools</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="apiKey in apiKeys"
          :key="apiKey.id"
          class="bg-white rounded-2xl border border-claude-border p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-medium text-claude-text">{{ apiKey.name || 'Unnamed Key' }}</h3>
              <p class="text-sm text-claude-subtle mt-1">
                Created {{ formatDate(apiKey.createdAt) }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="apiKey.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ apiKey.status === 1 ? 'Active' : 'Disabled' }}
            </span>
          </div>

          <div class="bg-claude-bg rounded-xl p-4 mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <code class="text-sm text-claude-text font-mono">
                {{ apiKey.keyPrefix }}********************************
              </code>
            </div>
            <div class="flex gap-2">
              <button
                v-if="getSavedKey(String(apiKey.id))"
                @click.prevent="copyKey(getSavedKey(String(apiKey.id)) || '')"
                class="p-2 hover:bg-claude-secondary rounded-lg transition-all"
                title="Copy API Key"
              >
                <Copy :size="16" class="text-claude-muted" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-6 text-sm text-claude-muted">
            <div>
              <span class="text-claude-subtle">Total Calls:</span>
              <span class="ml-1 font-medium text-claude-text">{{ apiKey.totalCalls.toLocaleString() }}</span>
            </div>
            <div>
              <span class="text-claude-subtle">Total Cost:</span>
              <span class="ml-1 font-medium text-claude-text">{{ apiKey.totalCost.toLocaleString() }} credits</span>
            </div>
            <div v-if="apiKey.lastUsedAt">
              <span class="text-claude-subtle">Last Used:</span>
              <span class="ml-1 font-medium text-claude-text">{{ formatDate(apiKey.lastUsedAt) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 mt-4 pt-4 border-t border-claude-border">
            <button
              v-if="apiKey.status === 1"
              @click="disableKey(apiKey.id)"
              class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              Disable
            </button>
            <button
              v-else
              @click="enableKey(apiKey.id)"
              class="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-all"
            >
              Enable
            </button>
            <button
              @click="confirmDelete(apiKey)"
              class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeCreateModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative">
        <button
          @click="closeCreateModal"
          class="absolute top-4 right-4 p-1 hover:bg-claude-secondary rounded-lg transition-all"
        >
          <X :size="20" class="text-claude-muted" />
        </button>
        <h3 class="text-lg font-semibold text-claude-text mb-4">Create API Key</h3>
        <form @submit.prevent="createKey">
          <div class="mb-4">
            <label class="block text-sm font-medium text-claude-text mb-2">Name (Required)</label>
            <input
              v-model="newKeyName"
              type="text"
              placeholder="e.g., My Development Key"
              class="w-full px-4 py-3 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50"
            />
          </div>
          <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {{ errorMsg }}
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 py-2 px-4 border border-claude-border text-claude-text font-medium rounded-xl hover:bg-claude-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating || !newKeyName.trim()"
              class="flex-1 py-2 px-4 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ creating ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeSuccessModal">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative">
        <button
          @click="closeSuccessModal"
          class="absolute top-4 right-4 p-1 hover:bg-claude-secondary rounded-lg transition-all"
        >
          <X :size="20" class="text-claude-muted" />
        </button>
        <h3 class="text-lg font-semibold text-claude-text mb-4">API Key Created Successfully!</h3>
        <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-sm text-green-700 mb-2">Please copy and save your API key now. It will not be shown again.</p>
          <code class="block text-sm font-mono text-claude-text break-all">{{ createdKey }}</code>
        </div>
        <button
          @click.prevent="copyKey(createdKey)"
          class="w-full py-2 px-4 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all mb-2"
        >
          Copy API Key
        </button>
        <button
          @click="closeSuccessModal"
          class="w-full py-2 px-4 border border-claude-border text-claude-text font-medium rounded-xl hover:bg-claude-secondary transition-all"
        >
          Done
        </button>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDeleteModal = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-claude-text mb-4">Delete API Key</h3>
        <p class="text-claude-muted mb-6">Are you sure you want to delete this API key? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-2 px-4 border border-claude-border text-claude-text font-medium rounded-xl hover:bg-claude-secondary transition-all"
          >
            Cancel
          </button>
          <button
            @click="deleteKey"
            class="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Key, Copy, X } from 'lucide-vue-next';
import { apiKeyApi, ApiKey } from '@/api/apiKey';

const apiKeys = ref<ApiKey[]>([]);
const loading = ref(false);
const creating = ref(false);
const showCreateModal = ref(false);
const showSuccessModal = ref(false);
const showDeleteModal = ref(false);
const newKeyName = ref('');
const createdKey = ref('');
const errorMsg = ref('');
const selectedKey = ref<ApiKey | null>(null);
const savedKeys = ref<Record<string, string>>({});

function loadSavedKeys() {
  const saved = localStorage.getItem('savedApiKeys');
  if (saved) {
    try {
      savedKeys.value = JSON.parse(saved);
    } catch {
      savedKeys.value = {};
    }
  }
}

function saveKeyToStorage(id: string, key: string) {
  savedKeys.value[id] = key;
  localStorage.setItem('savedApiKeys', JSON.stringify(savedKeys.value));
}

function getSavedKey(id: string): string | null {
  return savedKeys.value[id] || null;
}

function openCreateModal() {
  showCreateModal.value = true;
  newKeyName.value = '';
  createdKey.value = '';
  errorMsg.value = '';
}

function closeCreateModal() {
  showCreateModal.value = false;
  newKeyName.value = '';
  createdKey.value = '';
  errorMsg.value = '';
}

function closeSuccessModal() {
  showSuccessModal.value = false;
  createdKey.value = '';
}

async function loadApiKeys() {
  loading.value = true;
  try {
    const res = await apiKeyApi.getApiKeys();
    apiKeys.value = res.data?.records || [];
  } catch (error) {
    console.error('Failed to load API keys:', error);
  } finally {
    loading.value = false;
  }
}

async function createKey() {
  if (!newKeyName.value.trim()) {
    errorMsg.value = 'Name is required';
    return;
  }
  
  creating.value = true;
  errorMsg.value = '';
  try {
    const res = await apiKeyApi.createApiKey(newKeyName.value);
    createdKey.value = res.data?.apiKey || '';
    apiKeys.value.unshift(res.data);
    if (res.data?.apiKey) {
      saveKeyToStorage(String(res.data.id), res.data.apiKey);
    }
    showCreateModal.value = false;
    showSuccessModal.value = true;
    newKeyName.value = '';
  } catch (error: any) {
    errorMsg.value = error.message || 'Failed to create API key';
  } finally {
    creating.value = false;
  }
}

async function enableKey(id: number) {
  try {
    await apiKeyApi.enableApiKey(id);
    await loadApiKeys();
  } catch (error) {
    console.error('Failed to enable API key:', error);
  }
}

async function disableKey(id: number) {
  try {
    await apiKeyApi.disableApiKey(id);
    await loadApiKeys();
  } catch (error) {
    console.error('Failed to disable API key:', error);
  }
}

function confirmDelete(key: ApiKey) {
  selectedKey.value = key;
  showDeleteModal.value = true;
}

async function deleteKey() {
  if (!selectedKey.value) return;
  try {
    await apiKeyApi.deleteApiKey(selectedKey.value.id);
    delete savedKeys.value[String(selectedKey.value.id)];
    localStorage.setItem('savedApiKeys', JSON.stringify(savedKeys.value));
    showDeleteModal.value = false;
    await loadApiKeys();
  } catch (error) {
    console.error('Failed to delete API key:', error);
  }
}

function copyKey(key: string) {
  if (!key) return;
  navigator.clipboard.writeText(key).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = key;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

onMounted(() => {
  loadSavedKeys();
  loadApiKeys();
});
</script>
