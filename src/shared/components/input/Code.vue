<template>
  <el-input
    :model-value="modelValue"
    :placeholder="$t(placeholder)"
    :maxlength="maxlength"
    :minlength="minlength"
    :formatter="(value) => `${value}`.replace(/[^0-9]/g, '')"
    clearable
    @keypress="handlePress"
    @input="handleInput"
  />
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import {
  MAX_LENGTH_POSTAL_CODE,
  MIN_LENGTH_POSTAL_CODE,
} from "~/../../src/shared/utils/validate";

interface Prop {
  maxlength?: number;
  minlength?: number;
  modelValue?: number | string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "placeholder.postal_code",
  maxlength: MAX_LENGTH_POSTAL_CODE,
  minlength: MIN_LENGTH_POSTAL_CODE,
  modelValue: "",
});

const { modelValue } = toRefs(props);

const emits = defineEmits(["update:modelValue", "input"]);

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
  emits("input");
};
</script>

<style lang="scss" scoped>
.el-input {
  height: 40px;
}
</style>
