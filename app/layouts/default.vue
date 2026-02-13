<template>
  <div class="min-h-screen flex flex-col">
    <CommonAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <CommonAppFooter />

    <!-- Global create board dialog (triggered by header CTA) -->
    <CommonCreateBoardDialog
      v-if="showCreateDialog"
      @close="closeCreateDialog"
      @created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
const { showCreateDialog, closeCreateDialog } = useCreateDialog()

function handleCreated(code: string) {
  closeCreateDialog()
  navigateTo(`/board/${code}`)
}
</script>
