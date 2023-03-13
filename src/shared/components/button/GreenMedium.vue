<template>
  <el-button :loading="loading" class="button-submit">{{ name }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name: string;
  loading?: boolean;
  fontSize?: string;
  fontWeight?: string | number;
}

const props = withDefaults(defineProps<Prop>(), {
  loading: false,
  fontSize: "12px",
  fontWeight: "bold",
});

const { name } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/shared/assets/scss/variables" as *;

.button-submit {
  background-color: $green-50;
  color: $white-color;
  height: 40px;
  font-size: v-bind(fontSize);
  font-weight: v-bind(fontWeight);
}
</style>
