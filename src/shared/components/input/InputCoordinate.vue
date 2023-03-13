<template>
  <el-input
    :model-value="modelValue"
    :placeholder="placeholder"
    :maxlength="max"
    :minlength="min"
    :readonly="readonly"
    :formatter="handleFormatter"
    :disabled="disabled"
    :clearable="clearable"
    @input="handleInput"
  />
</template>

<script lang="ts" setup>
import { toRefs } from "vue";

interface Prop {
  max?: number;
  min?: number;
  modelValue?: number | string;
  placeholder?: string;
  readonly?: boolean;
  clearable?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  modelValue: "",
  max: 255,
  min: 0,
  readonly: false,
  clearable: true,
  disabled: false,
});

const { modelValue } = toRefs(props);

const emits = defineEmits(["update:modelValue"]);

const handleFormatter = (value: string) => value.replace(/[^0-9.,+-]/g, "");

const handleInput = (value: any) => {
  emits("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.el-input {
  height: 40px;
}
</style>
