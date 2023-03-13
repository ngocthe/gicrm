<template>
  <el-input
    :model-value="modelValue"
    :placeholder="placeholder"
    :maxlength="max"
    :minlength="min"
    :readonly="readonly"
    :formatter="(value) => `${value}`.replace(/[^0-9]/g, '')"
    :disabled="disabled"
    @input="handleInput"
  />
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { MAX_PEOPLE } from "~/../../src/shared/constants";

interface Prop {
  max?: number;
  min?: number;
  modelValue?: number | string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  modelValue: "",
  readonly: false,
  max: MAX_PEOPLE,
  min: 0,
  disabled: false,
});

const { modelValue, max, min } = toRefs(props);

const emits = defineEmits(["update:modelValue"]);

const handleInput = (e) => {
  let value = +e;
  if (value > max.value) {
    value = max.value;
  }
  if (value < min.value) {
    value = min.value;
  }
  emits("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.el-input {
  height: 40px;
}
</style>
