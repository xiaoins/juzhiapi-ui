<template>
  <section class="py-24 md:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 class="text-4xl md:text-5xl font-serif mb-8 leading-tight">Empower your workflow with JuZhiAi</h2>
          <div class="space-y-12">
            <div v-for="(feature, idx) in features" :key="idx" class="flex gap-6">
              <div :class="['shrink-0 w-14 h-14 rounded-2xl', feature.color, 'flex items-center justify-center', feature.iconColor]">
                <component :is="feature.icon" :size="28" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
                <p class="text-claude-muted text-lg leading-relaxed">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="relative">
          <div class="bg-white rounded-xl shadow-mockup relative z-10 border border-claude-border overflow-hidden">
            <div class="flex items-center justify-between p-4 border-b border-claude-secondary bg-white">
              <div class="flex items-center gap-3">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div class="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div class="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span class="ml-2 text-xs font-medium text-claude-subtle">JuZhiAi 3.5 Sonnet</span>
              </div>
              <div class="flex gap-2">
                <div class="w-16 h-2 bg-claude-secondary rounded" />
                <div class="w-6 h-2 bg-claude-secondary rounded" />
              </div>
            </div>
            
            <div class="p-8 space-y-6">
              <div class="flex gap-4 items-start">
                <div class="w-8 h-8 rounded-full bg-claude-accent shrink-0 flex items-center justify-center text-white text-[10px] font-bold">C</div>
                <div class="space-y-2">
                  <div class="w-32 h-3 bg-claude-secondary rounded" />
                  <div class="w-48 h-3 bg-claude-secondary rounded" />
                </div>
              </div>
              <div class="flex gap-4 items-start justify-end flex-row-reverse">
                <div class="w-8 h-8 rounded-full bg-claude-text shrink-0 flex items-center justify-center text-white text-[10px] font-bold">U</div>
                <div class="bg-claude-secondary p-4 rounded-2xl rounded-tr-none max-w-[85%]">
                  <p class="text-xs leading-relaxed text-claude-text">Can you help me analyze this quarterly revenue spreadsheet and identify the key growth drivers?</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="w-8 h-8 rounded-full bg-claude-accent shrink-0 flex items-center justify-center text-white text-[10px] font-bold">C</div>
                <div class="bg-white border border-claude-border p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                  <p class="text-xs leading-relaxed text-claude-text">I've analyzed your data. Based on the Q3 reports, your primary growth drivers are the expansion of the SaaS enterprise tier and a 22% increase in regional retention...</p>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute -bottom-6 -right-6 w-full h-full bg-claude-accent/5 rounded-2xl -z-0" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FileText, Code, MessageSquare } from 'lucide-vue-next';
import type { Component } from 'vue';

interface Feature {
  title: string;
  description: string;
  icon: Component;
  color: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    title: "Process massive documents",
    description: "Upload books, code repositories, or complex financial reports. Claude understands the nuances across hundreds of thousands of words in seconds.",
    icon: FileText,
    color: "bg-blue-500/10",
    iconColor: "text-blue-600"
  },
  {
    title: "Advanced reasoning and coding",
    description: "JuZhiAi excels at technical tasks. Debug code, translate languages, or solve logic puzzles with human-like reasoning capabilities.",
    icon: Code,
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-600"
  },
  {
    title: "Seamless collaboration",
    description: "Draft emails, brainstorm marketing copies, or build complex project plans. Claude works alongside you as a truly collaborative partner.",
    icon: MessageSquare,
    color: "bg-purple-500/10",
    iconColor: "text-purple-600"
  }
];
</script>
