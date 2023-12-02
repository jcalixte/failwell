<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header>
      <nav>
        <router-link class="title is-3" to="/">
          <img class="logo" src="/loop.png" alt="Fail Well" />
        </router-link>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

nav {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

img.logo {
  max-width: 40px;
}
</style>
