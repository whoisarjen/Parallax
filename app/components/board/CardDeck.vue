<template>
  <div class="card-deck">
    <div class="flex flex-wrap justify-center gap-2 sm:gap-3 px-4 py-4 sm:py-5">
      <BoardVoteCard
        v-for="card in cards"
        :key="card"
        :value="card"
        :selected="selectedValue === card"
        :disabled="disabled"
        @click="handleSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cards: string[]
  disabled: boolean
  selectedValue: string | null
}>()

const emit = defineEmits<{
  select: [value: string]
}>()

function handleSelect(value: string) {
  emit('select', value)
}
</script>
