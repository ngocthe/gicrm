<template>
  <el-input
    v-input-trim
    class="input-text"
    :model-value="modelValue"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :type="typeInput"
    :show-password="showPassword"
    :rows="rows"
    clearable
    :disabled="disabled"
    @input="handleChange"
  >
    <template #suffix><slot name="suffix-icon" /></template>
  </el-input>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";
import { MAX_LENGTH_DEFAULT } from "../../../shared/utils/validate";

interface Prop {
  placeholder?: string;
  modelValue: string | null;
  maxlength?: number;
  maxWidth?: string;
  width?: string;
  height?: string;
  typeInput?: string;
  showPassword?: boolean;
  rows?: number;
  disabled?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  modelValue: "",
  maxlength: MAX_LENGTH_DEFAULT,
  maxWidth: "100%",
  width: "100%",
  height: "40px",
  typeInput: "",
  showPassword: false,
  disabled: false,
});
const emits = defineEmits(["update:modelValue"]);
const { placeholder, modelValue, maxlength } = toRefs(props);

const handleChange = (e) => {
  emits("update:modelValue", e);
};
</script>

<style scoped lang="scss">
.input-text {
  height: v-bind(height);
  max-width: v-bind(maxWidth);
  width: v-bind(width);
}
</style>
