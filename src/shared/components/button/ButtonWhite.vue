<template>
  <el-button :loading="loading" class="button-submit">{{ name }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name: string;
  loading?: boolean;
  fontSize?: string;
}
const props = withDefaults(defineProps<Prop>(), {
  loading: false,
  fontSize: "14px",
});
const { name } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/shared/assets/scss/variables" as *;

.button-submit {
  background-color: $white-color;
  color: $black-80;
  height: 40px;
  font-size: v-bind(fontSize);

  &:hover {
    border-color: $border-color !important;
    background-color: $gray-100;
    color: $black-80;
  }
}
</style>
