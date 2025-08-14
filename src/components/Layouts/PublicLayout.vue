<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router';
  import Header from './Header.vue';
  import Footer from './Footer.vue';
</script>

<template>
  <Header />
  <main class="mx-auto max-w-6xl px-8 py-20 my-15 min-h-[80vh]">
    <RouterView />
  </main>
  <Footer />
</template>
