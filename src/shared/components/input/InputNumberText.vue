<template>
  <div class="custom-input-number">
    <el-input-number
      :model-value="modelValue"
      controls-position="right"
      class="input-number"
      :placeholder="placeholder"
      :precision="precision"
      :max="max"
      :min="min"
      :disabled="disabled"
      @keypress="handlePress"
      @input="handleInput"
    />
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { MAX_PEOPLE } from "~/../../src/shared/constants";

interface Prop {
  controlsPosition?: string;
  max?: number;
  min?: number;
  modelValue: number | undefined | string;
  placeholder?: string;
  precision?: number;
  disabled?: boolean;
  width?: string;
  acceptNull?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  controlsPosition: "right",
  placeholder: "",
  max: MAX_PEOPLE,
  min: 0,
  precision: 0,
  disabled: false,
  width: "100%",
  acceptNull: false,
});

const { modelValue, min, max, precision, acceptNull } = toRefs(props);

const emits = defineEmits(["update:modelValue"]);

const handlePress = (evt) => {
  if ((evt.which != 8 && evt.which != 0 && evt.which < 48) || evt.which > 57) {
    if (props.precision && evt.which === 46) return;
    evt.preventDefault();
  }
};

const handleInput = (e) => {
  let value = +e;
  if (value > max.value) {
    value = max.value;
  }
  if (value < min.value) {
    value = min.value;
  }

  if (!value && !acceptNull.value) {
    emits("update:modelValue", null);
  } else if (!value && value !== 0 && acceptNull.value) {
    emits("update:modelValue", null);
  } else {
    emits("update:modelValue", +value.toFixed(precision.value));
  }
};
</script>

<style lang="scss" scoped>
:deep(.input-number) {
  .el-input {
    height: 40px;

    .el-input__wrapper {
      padding-right: 15px;
    }

    .el-input__inner {
      text-align: unset;
    }
  }

  width: v-bind(width);

  .el-input-number__increase,
  .el-input-number__decrease {
    display: none;
  }
}
</style>
