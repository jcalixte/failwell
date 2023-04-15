<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <router-link class="title is-3" to="/">Loopycode</router-link>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
