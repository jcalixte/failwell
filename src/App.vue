<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <h1 class="title is-3">
        <router-link to="/">Loopycode</router-link>
      </h1>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
