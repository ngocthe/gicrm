<template>
  <el-button class="button-submit" :loading="loading">
    <slot name="icon" />
    {{ name }}
  </el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name: string;
  loading?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  name: "",
  loading: false,
});
const { name, loading } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/store/assets/scss/variables" as *;

.button-submit {
  background-color: $green-medium-color;
  color: $white-color;
  height: 40px;

  :deep(svg) {
    margin-right: 7px;
  }
}
</style>
