<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <HeroSection />
    <CapabilitiesGrid />
    <DetailedFeatures />
    <CTASection />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import HeroSection from '@/components/HeroSection.vue';
import CapabilitiesGrid from '@/components/CapabilitiesGrid.vue';
import DetailedFeatures from '@/components/DetailedFeatures.vue';
import CTASection from '@/components/CTASection.vue';
import Footer from '@/components/Footer.vue';
</script>
