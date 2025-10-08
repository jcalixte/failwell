<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  estimation: number
}>()
const label = computed(() => `${props.estimation} minutes`)
</script>

<template>
  <div class="estimation-time-arrival tags has-addons">
    <div class="tag"><abbr title="Estimated Time of Arrival">ETA</abbr></div>
    <!-- <div class="tag tooltip" data-tip="Estimated Time of Arrival">ETA</div> -->
    <div class="tag is-primary" data-test="tag-label">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.estimation-time-arrival {
  flex-wrap: nowrap;
}
</style>
