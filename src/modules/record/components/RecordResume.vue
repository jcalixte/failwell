<script setup lang="ts">
import { useTaskRecordMetadata } from '@/modules/record/hooks/useTaskRecordMetadata'
import type { Recordable } from '@/modules/record/interfaces/recordable'
import { computed } from 'vue'

const props = defineProps<{
  record: Recordable
  totalEstimation: number
}>()

const { duration } = useTaskRecordMetadata(props.record)

const isSuperiorToEstimation = computed(() => {
  if (!duration.value) {
    return false
  }

  return duration.value > props.totalEstimation
})
</script>

<template>
  <div class="record-resume content" v-if="record.end">
    <p
      :class="{
        'has-text-primary-dark': !isSuperiorToEstimation,
        'has-text-warning-dark': isSuperiorToEstimation
      }"
    >
      The task took {{ duration }} minutes instead of
      {{ totalEstimation }} minutes.
    </p>
  </div>
</template>

<style scoped lang="scss">
.record-resume {
}
</style>
