<template>
  <div>
    <h1>New Task Form</h1>
    <form @submit.prevent>
      <label for="title">Title</label>
      <input type="text" id="title" />
    </form>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
