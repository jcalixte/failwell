<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  estimation: number
}>()
const label = computed(() => `${props.estimation} minutes`)
</script>

<template>
  <div class="estimation-time-arrival tags has-addons">
    <div class="tag">ETA</div>
    <div class="tag is-primary" data-test="tag-label">
      {{ label }}
    </div>
  </div>
</template>
