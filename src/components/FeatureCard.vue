<template>
  <div class="feature-card p-8 bg-white/50 border border-claude-border rounded-3xl backdrop-blur-sm transition-all hover:bg-white hover:border-black/[0.08] hover:shadow-xl group">
    <div class="w-12 h-12 bg-claude-accent/10 rounded-2xl flex items-center justify-center mb-6 text-claude-accent group-hover:scale-110 transition-transform">
      <component :is="icon" :size="24" />
    </div>
    <h3 class="text-2xl font-display font-semibold mb-4 tracking-tight">{{ title }}</h3>
    <p class="text-claude-muted leading-relaxed text-lg">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  title: string;
  description: string;
}>();
</script>

<style scoped>
.feature-card:hover {
  transform: translateY(-5px);
}
</style>
