<script setup lang="ts">
import type { Stepable } from '@/modules/task/interfaces/stepable'

defineProps<{
  id: string
  steps: Stepable[]
}>()
</script>

<template>
  <table class="table record-step-table is-striped is-hoverable">
    <thead>
      <tr>
        <th>#</th>
        <th>status</th>
        <th>task</th>
        <th>estimation</th>
      </tr>
    </thead>
    <tbody>
      <tr class="step-row" v-for="(step, index) in steps" :key="step.id">
        <td class="td-rank">
          <div class="rank">
            {{ index + 1 }}
          </div>
        </td>
        <td class="step-title">
          {{ step.title }}
        </td>
        <td class="estimation minutes">{{ step.estimation }} min</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.step-table {
  .step-row {
    .status {
      text-align: center;

      div {
        margin: auto;
      }
    }

    .td-rank {
      &.added-afterward {
        background: #fbc124;
      }
    }

    .rank {
      text-align: right;
      display: flex;
      justify-content: end;
      align-items: center;
      min-height: 30px;
    }

    .step-title {
      padding-right: 1rem;
    }

    .minutes {
      text-align: right;
    }
  }
}
</style>
