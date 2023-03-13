<template>
  <el-button :loading="loading" :disabled="disabled">
    <IconLeave />
    <span>{{ $t(name) }}</span>
  </el-button>
</template>

<script lang="ts" setup>
import IconLeave from "~/../../src/shared/components/icon/Leave";

interface Prop {
  loading?: boolean;
  disabled?: boolean;
  name?: string;
}
withDefaults(defineProps<Prop>(), {
  loading: false,
  disabled: false,
  name: "button_export",
});
</script>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.el-button {
  height: 40px;
  padding: 9px 20px;
  font-weight: 700;
  color: $black-80;

  &:hover {
    border-color: $border-color !important;
    opacity: 0.8;

    :deep(svg) {
      path {
        fill: $blue-color;
      }
    }
  }

  span {
    gap: 4px;
  }
}
</style>
