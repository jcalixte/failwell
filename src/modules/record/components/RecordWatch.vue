<script setup lang="ts">
import type { Recordable } from '@/modules/record/interfaces/recordable'
import { toISODate } from '@/shared/types/date'
import { computed, onUnmounted, ref } from 'vue'

const props = defineProps<{
  record: Recordable
}>()

const record = computed(() => props.record)

const now = ref(toISODate(new Date()))
const id = setInterval(() => {
  now.value = toISODate(new Date())
}, 1000)
onUnmounted(() => clearInterval(id))

const timer = computed(() =>
  Math.max(
    Math.floor(
      (new Date(now.value).getTime() - new Date(record.value.start).getTime()) /
        1000
    ),
    0
  )
)

const minutes = computed(() =>
  Math.floor(timer.value / 60)
    .toString()
    .padStart(2, '0')
)
const seconds = computed(() => (timer.value % 60).toString().padStart(2, '0'))
</script>

<template>
  <div class="record-watch" v-if="record.currentStepId">
    {{ minutes }}:{{ seconds }}
  </div>
  <div class="record-watch" v-else>00:00</div>
</template>
