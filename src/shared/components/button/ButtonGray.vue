<template>
  <el-button :loading="loading" class="button-submit" :disabled="disabled">{{
    name
  }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name: string;
  loading?: boolean;
  maxWidth?: string;
  width?: string;
  fontWeight?: string;
  disabled?: boolean;
  background?: string;
  color?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  loading: false,
  maxWidth: "100%",
  width: "94px",
  fontWeight: "400",
  disabled: false,
  background: "#e7e7e7",
  color: "#000000e6",
});
const { name, color } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/admin/assets/scss/variables" as *;

.button-submit {
  height: 40px;
  background-color: v-bind(background);
  font-weight: v-bind(fontWeight);
  max-width: v-bind(maxWidth);
  width: v-bind(width);
  color: v-bind(color);
}
</style>
