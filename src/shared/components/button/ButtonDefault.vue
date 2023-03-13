<template>
  <el-button :disabled="disabled">{{ name }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name?: string;
  width?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  name: "",
  width: "68px",
  disabled: false,
});

const { name } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/store/assets/scss/variables" as *;

.el-button {
  width: v-bind(width);
  -el-button-text-color: #606266;
  height: 40px;
  font-weight: 500;
}
</style>
