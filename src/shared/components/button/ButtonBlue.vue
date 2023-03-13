<template>
  <el-button
    :loading="loading"
    class="button-submit"
    :disabled="disabled"
    @click="handleClick"
    >{{ name }}</el-button
  >
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name?: string;
  fontWeight?: string;
  maxWidth?: string;
  width?: string;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  name: "",
  fontWeight: "400",
  maxWidth: "100%",
  width: "100px",
});

const emit = defineEmits(["onClick"]);
const handleClick = () => {
  emit("onClick");
};
const { name } = toRefs(props);
</script>

<style scoped lang="scss">
@use "../src/admin/assets/scss/variables" as *;

.button-submit {
  background-color: $blue;
  color: $white-color;
  font-size: 14px;
  height: 40px;
  width: v-bind(width);
}
</style>
