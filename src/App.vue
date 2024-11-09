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

    <main>
      <RouterView />
    </main>

    <footer>
      <a
        href="https://github.com/jcalixte/failwell/issues"
        target="_blank"
        rel="noopener noreferrer"
        >report an issue</a
      >
    </footer>
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

main {
  flex: 1;
}

footer {
  text-align: right;
  font-size: 0.8rem;
}
</style>
