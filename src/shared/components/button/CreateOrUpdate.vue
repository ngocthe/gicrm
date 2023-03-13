<template>
  <el-button :loading="loading" :disabled="disabled">{{ $t(title) }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  loading?: boolean;
  disabled?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  loading: false,
  disabled: false,
  title: "button.save",
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
.el-button {
  padding: 9px 20px;
  height: 40px;
  font-weight: 500;
  background: $green-100;
  color: $white-color;
  &.is-disabled {
    background: $green-100;
    color: $white-color;
  }
}
</style>
