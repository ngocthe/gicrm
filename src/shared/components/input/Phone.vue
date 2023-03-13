<template>
  <el-input
    :model-value="modelValue"
    :placeholder="$t(placeholder)"
    :maxlength="maxlength"
    :minlength="minlength"
    :readonly="readonly"
    :formatter="(value) => `${value}`.replace(/[^0-9]/g, '')"
    clearable
    @keypress="handlePress"
    @input="handleInput"
  />
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import {
  MAX_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_PHONE_NUMBER,
} from "~/../../src/shared/utils/validate";

interface Prop {
  maxlength?: number;
  minlength?: number;
  modelValue?: number | string;
  placeholder?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "placeholder.phone",
  maxlength: MAX_LENGTH_PHONE_NUMBER,
  minlength: MIN_LENGTH_PHONE_NUMBER,
  modelValue: "",
  readonly: false,
});

const { modelValue } = toRefs(props);

const emits = defineEmits(["update:modelValue"]);

const handlePress = (evt) => {
  if ((evt.which != 8 && evt.which != 0 && evt.which < 48) || evt.which > 57) {
    evt.preventDefault();
  }
};

const handleInput = (e) => {
  const newVal = e.replace(/[！-～]/g, (r) =>
    String.fromCharCode(r.charCodeAt(0) - 0xfee0)
  );
  emits("update:modelValue", newVal.replace(/[^0-9]/g, ""));
};
</script>

<style lang="scss" scoped>
.el-input {
  height: 40px;
}
</style>
