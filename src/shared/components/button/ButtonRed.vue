<template>
  <el-button :disabled="disabled" :loading="loading" class="button-submit">{{
    name
  }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name: string;
  loading?: boolean;
  fontSize?: string;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  loading: false,
  fontSize: "14px",
  disabled: false,
});
const { name } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/admin/assets/scss/variables" as *;

.button-submit {
  background-color: $red;
  color: $white-color;
  height: 40px;
  font-size: v-bind(fontSize);
}
</style>
