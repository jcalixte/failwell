<template>
  <div class="no-task-found">
    <p>Task not found.</p>
    <router-link :to="{ name: 'home' }" class="button">
      <img src="/icons/left.svg" alt="left arrow" />
      go to homepage</router-link
    >
  </div>
</template>

<style scoped>
.no-task-found {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
