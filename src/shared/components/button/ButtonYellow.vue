<template>
  <el-button class="button-submit" :disabled="disable">{{ name }}</el-button>
</template>

<script setup lang="ts">
import { toRefs } from "vue";

interface Prop {
  name?: string;
  fontWeight?: string;
  maxWidth?: string;
  width?: string;
  disable?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  name: "",
  fontWeight: "400",
  maxWidth: "100%",
  width: "100%",
  disable: false,
});
const { name } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/front/assets/scss/variables" as *;

.button-submit {
  background-color: $yellow-color;
  color: $white-color;
  height: 40px;
  font-weight: v-bind(fontWeight);
  max-width: v-bind(maxWidth);
  width: v-bind(width);
}
</style>
