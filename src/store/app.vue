<template>
  <NuxtLayout>
    <Transition name="page" mode="out-in">
      <div id="nuxt-page" :key="$route.fullPath">
        <NuxtPage />
      </div>
    </Transition>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useMeStore } from "~~/../../src/shared/stores/me";

const meStore = useMeStore();
if (!meStore.info) {
  await meStore.fetchUpdate();
}
</script>

<style lang="scss" scoped>
#nuxt-page {
  height: 100%;
}
</style>
