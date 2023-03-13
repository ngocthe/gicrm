<template>
  <el-button class="button-submit" :loading="loading" :disabled="disabled">
    <slot name="icon" />
    {{ name }}
  </el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name: string;
  loading?: boolean;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  name: "",
  loading: false,
  disabled: false,
});
const { name, loading } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/store/assets/scss/variables" as *;

.button-submit {
  background-color: $blue-50;
  color: $white-color;
  height: 40px;
  padding: 9px 20px;
  &.is-disabled {
    background-color: $blue-50;
    color: $white-color;
  }
}
</style>
