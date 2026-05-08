<template>
  <div class="h-screen flex flex-col">
    <header class="bg-white border-b border-claude-border px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-claude-text">AI Chat</h2>
        <select
          v-model="selectedModel"
          class="px-4 py-2 rounded-xl border border-claude-border bg-claude-bg text-claude-text text-sm focus:outline-none focus:ring-2 focus:ring-claude-accent/50"
        >
          <option v-for="model in models" :key="model.id" :value="model.modelName">
            {{ model.displayName }}
          </option>
        </select>
      </div>
      <button
        @click="createNewSession"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-claude-accent hover:bg-claude-accent/10 rounded-xl transition-all"
      >
        <Plus :size="18" />
        New Chat
      </button>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-72 bg-claude-secondary border-r border-claude-border flex flex-col">
        <div class="p-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full px-4 py-2 rounded-xl border border-claude-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-claude-accent/50"
          />
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          <div
            v-for="session in filteredSessions"
            :key="session.id"
            @click="selectSession(session)"
            class="group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all"
            :class="[
              currentSession?.id === session.id
                ? 'bg-claude-accent text-white'
                : 'hover:bg-white text-claude-text'
            ]"
          >
            <span class="text-sm font-medium truncate">{{ session.title || 'New Chat' }}</span>
            <button
              @click.stop="deleteSession(session.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all"
            >
              <Trash2 :size="14" />
            </button>
          </div>
          <div v-if="sessions.length === 0" class="text-center text-claude-subtle text-sm py-8">
            No conversations yet
          </div>
        </div>
      </aside>

      <div class="flex-1 flex flex-col">
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="messages.length === 0" class="h-full flex items-center justify-center">
            <div class="text-center">
              <MessageSquare :size="48" class="mx-auto mb-4 text-claude-subtle" />
              <p class="text-claude-muted">Start a conversation with AI</p>
              <p class="text-sm text-claude-subtle mt-1">Select a model and send your first message</p>
            </div>
          </div>

          <div v-for="(msg, index) in messages" :key="index" class="flex gap-4" :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              :class="msg.role === 'user' ? 'bg-claude-text' : 'bg-claude-accent'"
            >
              <span class="text-white text-xs font-bold">{{ msg.role === 'user' ? 'U' : 'AI' }}</span>
            </div>
            <div
              class="max-w-[70%] px-6 py-4 rounded-2xl"
              :class="msg.role === 'user' ? 'bg-claude-accent text-white rounded-tr-none' : 'bg-claude-secondary text-claude-text rounded-tl-none'"
            >
              <p class="whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>

          <div v-if="isStreaming" class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-claude-accent flex items-center justify-center shrink-0">
              <span class="text-white text-xs font-bold">AI</span>
            </div>
            <div class="bg-claude-secondary px-6 py-4 rounded-2xl rounded-tl-none">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-claude-subtle rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-claude-subtle rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-claude-subtle rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-claude-border p-4">
          <form @submit.prevent="sendMessage" class="flex gap-4">
            <input
              v-model="inputMessage"
              type="text"
              :disabled="isStreaming"
              placeholder="Type your message..."
              class="flex-1 px-6 py-4 rounded-xl border border-claude-border bg-claude-bg text-claude-text focus:outline-none focus:ring-2 focus:ring-claude-accent/50"
            />
            <button
              type="submit"
              :disabled="!inputMessage.trim() || isStreaming"
              class="px-6 py-4 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send :size="20" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { Plus, Trash2, MessageSquare, Send } from 'lucide-vue-next';
import { chatApi, Session, Message as ChatMessage } from '@/api/chat';
import { modelApi, Model } from '@/api/model';

const models = ref<Model[]>([]);
const sessions = ref<Session[]>([]);
const messages = ref<ChatMessage[]>([]);
const currentSession = ref<Session | null>(null);
const selectedModel = ref('');
const inputMessage = ref('');
const isStreaming = ref(false);
const searchQuery = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const filteredSessions = computed(() => {
  if (!searchQuery.value) return sessions.value;
  return sessions.value.filter((s: Session) => 
    s.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function loadModels() {
  try {
    const res = await modelApi.getModels();
    models.value = res.data || [];
    if (models.value.length > 0) {
      selectedModel.value = models.value[0].modelName;
    }
  } catch (error) {
    console.error('Failed to load models:', error);
  }
}

async function loadSessions() {
  try {
    const res = await chatApi.getSessions();
    sessions.value = res.data?.records || [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
  }
}

async function selectSession(session: Session) {
  currentSession.value = session;
  try {
    const res = await chatApi.getMessages(session.id);
    messages.value = res.data?.records || [];
    scrollToBottom();
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
}

async function createNewSession() {
  try {
    const res = await chatApi.createSession({
      modelName: selectedModel.value,
      title: 'New Chat',
    });
    currentSession.value = res.data;
    messages.value = [];
    await loadSessions();
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

async function deleteSession(sessionId: number) {
  try {
    await chatApi.deleteSession(sessionId);
    sessions.value = sessions.value.filter((s: Session) => s.id !== sessionId);
    if (currentSession.value?.id === sessionId) {
      currentSession.value = null;
      messages.value = [];
    }
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}

async function sendMessage() {
  if (!inputMessage.value.trim() || isStreaming.value) return;

  const userMessage = inputMessage.value;
  inputMessage.value = '';

  if (!currentSession.value) {
    await createNewSession();
  }

  messages.value.push({
    id: Date.now(),
    sessionId: currentSession.value!.id,
    role: 'user',
    content: userMessage,
    modelName: selectedModel.value,
    tokenCount: 0,
    createdAt: new Date().toISOString(),
  });

  scrollToBottom();

  isStreaming.value = true;

  try {
    const response = await fetch('http://localhost:8080/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        sessionId: currentSession.value?.id,
        modelName: selectedModel.value,
        message: userMessage,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = '';

    const aiMessageIndex = messages.value.length;
    messages.value.push({
      id: Date.now(),
      sessionId: currentSession.value!.id,
      role: 'assistant',
      content: '',
      modelName: selectedModel.value,
      tokenCount: 0,
      createdAt: new Date().toISOString(),
    });

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              messages.value[aiMessageIndex].content = assistantMessage;
              scrollToBottom();
            }
          } catch (e) {}
        }
      }
    }

    await loadSessions();
  } catch (error) {
    console.error('Failed to send message:', error);
    messages.value.push({
      id: Date.now(),
      sessionId: currentSession.value!.id,
      role: 'assistant',
      content: 'Sorry, there was an error processing your request.',
      modelName: selectedModel.value,
      tokenCount: 0,
      createdAt: new Date().toISOString(),
    });
  } finally {
    isStreaming.value = false;
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

onMounted(() => {
  loadModels();
  loadSessions();
});
</script>
