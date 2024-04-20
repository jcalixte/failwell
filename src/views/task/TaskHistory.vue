<script setup lang="ts">
import EstimationTimeArrival from '@/components/EstimationTimeArrival.vue'
import { adaptStepsToTextarea } from '@/modules/task/infra/adaptStepsToTextarea'
import { useTaskStore } from '@/modules/task/stores/useTask.store'
import { useMagicKeys, whenever } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  id: string
}>()
const taskStore = useTaskStore()

const task = computed(() => taskStore.getTask(props.id))
const currentIndex = ref(0)
const prev = computed(() =>
  adaptStepsToTextarea(task.value?.stepHistory[currentIndex.value] || [])
)
const current = computed(() =>
  adaptStepsToTextarea(task.value?.stepHistory[currentIndex.value + 1] || [])
)
const goToPrev = () => {
  currentIndex.value = Math.max(0, currentIndex.value - 1)
}

const goToNext = () => {
  if (!task.value?.stepHistory) {
    return
  }

  currentIndex.value = Math.min(
    task.value?.stepHistory.length - 2 || 0,
    currentIndex.value + 1
  )
}

const isPrevDisabled = computed(() => currentIndex.value === 0)
const isNextDisabled = computed(
  () =>
    task.value?.stepHistory &&
    currentIndex.value === task.value?.stepHistory.length - 2
)

const { n, p } = useMagicKeys()

whenever(p, () => {
  goToPrev()
})

whenever(n, () => {
  goToNext()
})
</script>

<template>
  <div v-if="task" class="task-history">
    <h1 class="title">
      <button @click="router.go(-1)" class="button is-white">
        <img src="/icons/left.svg" alt="go back" />
      </button>
      {{ task.title }}
    </h1>
    <h2 class="subtitle">
      <estimation-time-arrival :estimation="task.totalEstimation" />
    </h2>
    <div class="buttons" v-if="!isPrevDisabled || !isNextDisabled">
      <button class="button" :disabled="isPrevDisabled" @click="goToPrev">
        <img src="/icons/arrow-left.svg" alt="go back" /></button
      ><button class="button" :disabled="isNextDisabled" @click="goToNext">
        <img src="/icons/arrow-right.svg" alt="go back" />
      </button>
    </div>
    <Diff
      v-if="task.stepHistory.length > 1"
      mode="split"
      theme="dark"
      language="markdown"
      :prev="prev"
      :current="current"
    />
    <div v-else>No history yet.</div>
  </div>
</template>

<!-- <style scoped lang="scss">
.task-history {
}
</style> -->
