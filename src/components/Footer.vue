<template>
  <footer class="bg-white py-24 border-t border-claude-border">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
        <div class="col-span-2 lg:col-span-1">
          <a href="/" class="text-2xl font-serif font-semibold mb-6 block">JuZhiAi</a>
          <p class="text-claude-muted text-sm leading-relaxed">
            JuZhiAi is built by JuZhi, an AI safety and research company.
          </p>
        </div>
        <div v-for="(group, idx) in footerGroups" :key="idx">
          <h4 class="font-bold mb-6 text-[11px] uppercase tracking-widest text-claude-subtle">{{ group.title }}</h4>
          <ul class="space-y-4">
            <li v-for="(link, lIdx) in group.links" :key="lIdx">
              <a href="#" class="text-claude-muted hover:text-claude-text transition-colors text-sm">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-claude-border gap-6">
        <p class="text-xs text-claude-subtle">© {{ currentYear }} JuZhi PBC. All rights reserved.</p>
        <div class="flex items-center gap-8">
          <a href="#" class="text-claude-subtle hover:text-claude-text transition-colors"><Globe :size="18" /></a>
          <a href="#" class="text-claude-subtle hover:text-claude-text transition-colors text-xs font-semibold">Terms</a>
          <a href="#" class="text-claude-subtle hover:text-claude-text transition-colors text-xs font-semibold">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Globe } from 'lucide-vue-next';

const currentYear = computed(() => new Date().getFullYear());

const footerGroups = [
  {
    title: "Model",
    links: ["JuZhiAi 3.5 Sonnet", "JuZhiAi 3 Opus", "JuZhiAi 3 Haiku"]
  },
  {
    title: "Product",
    links: ["JuZhiAi API", "JuZhiAi for Teams", "Pricing", "News"]
  },
  {
    title: "Impact",
    links: ["Safety", "Responsible AI", "Constitution", "Safety Reports"]
  },
  {
    title: "Company",
    links: ["About", "Careers", "Research", "Press"]
  }
];
</script>
