<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <router-link class="title is-3" to="/">
        <img class="logo" src="/public/loop.png" alt="Loopycode" />
      </router-link>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

img.logo {
  max-width: 40px;
}
</style>
