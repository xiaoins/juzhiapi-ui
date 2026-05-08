<template>
  <section class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient">
    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="max-w-3xl mb-12">
        <div class="animate-fade-in">
          <h1 class="text-6xl md:text-[5.5rem] font-serif font-medium leading-[1.05] mb-8 tracking-tight">
            Meet JuZhiAi.
          </h1>
        </div>
        
        <div class="animate-fade-in" style="animation-delay: 0.2s;">
          <p class="text-xl md:text-2xl text-claude-muted mb-10 leading-relaxed font-normal">
            JuZhiAi is a next-generation AI assistant built for work. <br class="hidden md:block" /> Safe, accurate, and deeply capable.
          </p>
        </div>

        <div class="animate-fade-in flex flex-wrap gap-4" style="animation-delay: 0.4s;">
          <button 
            @click="goToLogin"
            class="bg-claude-text hover:bg-black text-white px-9 py-4 rounded-full text-base font-medium transition-all shadow-lg active:scale-95"
          >
            Talk to JuZhiAi
          </button>
          <button class="bg-white border border-claude-border hover:bg-claude-secondary text-claude-text px-9 py-4 rounded-full text-base font-medium transition-all">
            JuZhiAi for Business
          </button>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full h-24 border-t border-claude-border bg-white/50 backdrop-blur-sm hidden md:flex items-center justify-around px-20">
      <div class="flex flex-col items-center gap-1 group">
        <span class="text-[10px] font-bold uppercase tracking-widest text-claude-subtle group-hover:text-claude-accent transition-colors">Context Window</span>
        <span class="text-sm font-medium">200k Tokens</span>
      </div>
      <div class="w-px h-8 bg-claude-border"></div>
      <div class="flex flex-col items-center gap-1 group">
        <span class="text-[10px] font-bold uppercase tracking-widest text-claude-subtle group-hover:text-claude-accent transition-colors">Security</span>
        <span class="text-sm font-medium">SOC2 Type II</span>
      </div>
      <div class="w-px h-8 bg-claude-border"></div>
      <div class="flex flex-col items-center gap-1 group">
        <span class="text-[10px] font-bold uppercase tracking-widest text-claude-subtle group-hover:text-claude-accent transition-colors">Capabilities</span>
        <span class="text-sm font-medium">Multimodal Vision</span>
      </div>
      <div class="w-px h-8 bg-claude-border"></div>
      <div class="flex flex-col items-center gap-1 group">
        <span class="text-[10px] font-bold uppercase tracking-widest text-claude-subtle group-hover:text-claude-accent transition-colors">Enterprise</span>
        <span class="text-sm font-medium">Admin Console</span>
      </div>
    </div>
    
    <div class="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden lg:block animate-scale-in">
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full opacity-40">
        <circle cx="250" cy="250" r="150" stroke="#d97757" stroke-width="0.2" stroke-dasharray="4 4" />
        <path d="M50 450 L450 50" stroke="#d97757" stroke-width="0.1" opacity="0.3" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 1.5s ease-out 0.3s forwards;
  opacity: 0;
}
</style>
