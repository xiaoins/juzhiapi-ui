<template>
  <nav :class="[
    'fixed top-0 left-0 w-full z-50 transition-all duration-300',
    isScrolled ? 'glass-nav py-3' : 'bg-transparent py-4 md:py-6'
  ]">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <div class="flex items-center gap-10">
        <a href="/" class="text-2xl font-serif font-semibold tracking-tight text-claude-text">
          JuZhiAi
        </a>
        
        <div class="hidden md:flex items-center gap-8 lowercase">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href" 
            class="text-sm font-medium text-claude-muted hover:text-claude-text transition-colors"
          >
            {{ link.name }}
          </a>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button 
          @click="goToLogin"
          class="hidden sm:block text-sm font-medium text-claude-text hover:text-claude-accent transition-colors px-4 py-2"
        >
          Log In
        </button>
        <button 
          @click="goToLogin"
          class="bg-claude-accent hover:bg-claude-accent-hover text-white px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
        >
          Try JuZhiAi
        </button>
        
        <button 
          class="md:hidden p-2 text-claude-text"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <X v-if="isMobileMenuOpen" :size="24" />
          <Menu v-else :size="24" />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="absolute top-full left-0 w-full bg-claude-bg border-b border-black/5 md:hidden">
        <div class="flex flex-col p-6 gap-4">
          <a 
            v-for="link in navLinks" 
            :key="link.name" 
            :href="link.href" 
            class="text-lg font-medium text-claude-text/70 py-2 border-b border-black/5"
            @click="isMobileMenuOpen = false"
          >
            {{ link.name }}
          </a>
          <div class="pt-4 flex flex-col gap-4">
            <button 
              @click="goToLogin"
              class="w-full text-center py-3 text-white font-medium bg-claude-accent rounded-xl"
            >
              Talk to JuZhiAi
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Menu, X } from 'lucide-vue-next';

const router = useRouter();
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const navLinks = [
  { name: 'JuZhiAi', href: '#' },
  { name: 'Team', href: '#' },
  { name: 'Safety', href: '#' },
  { name: 'Research', href: '#' },
  { name: 'Company', href: '#' },
];

const goToLogin = () => {
  router.push('/login');
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
