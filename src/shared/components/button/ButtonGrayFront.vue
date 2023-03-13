<template>
  <el-button class="btn-gray" @click="handleClick">{{ name }}</el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name?: string;
  fontWeight?: string;
  maxWidth?: string;
  width?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  name: "",
  fontWeight: "400",
  maxWidth: "100%",
  width: "100px",
});

const emit = defineEmits(["onClick"]);
const { name } = toRefs(props);

const handleClick = () => {
  emit("onClick");
};
</script>

<style scoped lang="scss">
@use "../src/front/assets/scss/variables" as *;

.btn-gray {
  background-color: $gray-100;
  height: 40px;
  font-weight: v-bind(fontWeight);
  max-width: v-bind(maxWidth);
  width: v-bind(width);
  color: $black-80;
}
</style>
