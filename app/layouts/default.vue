<template>
  <div class="min-h-screen flex flex-col">
    <CommonAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <CommonAppFooter />
  </div>
</template>
