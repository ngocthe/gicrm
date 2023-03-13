<template>
  <div class="div-inline" :class="className">
    <div
      class="label-text"
      :class="{ 'required-field': isRequired, 'label-class': labelClass }"
    >
      {{ $t(label) }}
    </div>
    <slot name="form-item"></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

interface Prop {
  label: string;
  isRequired?: boolean;
  className?: string;
  labelWidth?: string;
  labelMinWidth?: string;
  labelClass?: boolean;
}

withDefaults(defineProps<Prop>(), {
  label: "",
  isRequired: false,
  className: "",
  labelWidth: "160px",
  labelMinWidth: "160px",
  labelClass: false,
});
</script>

<style lang="scss" scoped>
.div-inline {
  display: flex;
  margin-bottom: 20px;

  .label-text {
    padding-top: 8px;
    width: v-bind(labelWidth);
    min-width: v-bind(labelMinWidth);
  }
}
</style>
