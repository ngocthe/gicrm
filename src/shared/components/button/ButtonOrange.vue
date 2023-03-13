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
  height?: string;
  borderRadius?: string;
}
const props = withDefaults(defineProps<Prop>(), {
  name: "",
  loading: false,
  height: "40px",
  borderRadius: "unset",
});
const { name, loading, height, borderRadius } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/front/assets/scss/variables" as *;

.button-submit {
  background-color: $orange;
  color: $white-color;
  height: v-bind(height);
  border-radius: v-bind(borderRadius);

  :deep(svg) {
    margin-right: 7px;
  }
}
</style>
