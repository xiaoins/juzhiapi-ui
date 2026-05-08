<template>
  <section class="py-24 md:py-32 bg-claude-bg">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-20">
        <h2 class="text-4xl md:text-5xl font-serif mb-6">Designed for you</h2>
        <p class="text-xl text-claude-muted">Whether you're an individual creator or a global enterprise, JuZhiAi adapts to your needs with unmatched versatility.</p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          v-for="(cap, idx) in capabilities"
          :key="idx" 
          :icon="cap.icon"
          :title="cap.title"
          :description="cap.description"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FeatureCard from './FeatureCard.vue';
import { Zap, ShieldCheck, Globe } from 'lucide-vue-next';

const capabilities = [
  {
    icon: Zap,
    title: "Fast and Capable",
    description: "From creative writing to coding, data analysis to research, Claude handles complex tasks with precision and speed."
  },
  {
    icon: ShieldCheck,
    title: "Safe by Design",
    description: "Built using Constitutional AI to ensure responses are helpful, harmless, and honest—prioritizing your safety above all else."
  },
  {
    icon: Globe,
    title: "Global Context",
    description: "Industry-leading context window allows JuZhiAi to process massive documents and intricate conversations without losing steam."
  }
];
</script>
