<template>
  <el-button
    :icon="icon"
    class="btn-common"
    :loading="loading"
    :disabled="disabled"
    @click="handleClick"
    >{{ $t(name) }}
  </el-button>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";

interface Prop {
  name?: string;
  fontWeight?: string;
  maxWidth?: string;
  width?: string;
  backgroundColor?: string;
  color?: string;
  height?: string;
  icon?: string;
  loading?: boolean;
  borderRadius?: string;
  border?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  name: "",
  fontWeight: "500",
  maxWidth: "100%",
  width: "96px",
  backgroundColor: "",
  color: "",
  height: "40px",
  loading: false,
  disabled: false,
  icon: "",
  borderRadius: "3px",
  border: "0",
});

const emit = defineEmits(["onClick"]);
const { name } = toRefs(props);

const handleClick = () => {
  emit("onClick");
};
</script>

<style scoped lang="scss">
@use "../src/front/assets/scss/variables" as *;

.btn-common {
  background-color: v-bind(backgroundColor);
  height: v-bind(height);
  font-weight: v-bind(fontWeight);
  max-width: v-bind(maxWidth);
  color: v-bind(color);
  width: v-bind(width);
  border-radius: v-bind(borderRadius);
  border: v-bind(border);

  &:hover {
    color: v-bind(color);
  }

  &.is-disabled,
  &.is-disabled:hover {
    background-color: v-bind(backgroundColor);
    color: v-bind(color);
  }
}
</style>
