<template>
  <el-input
    ref="_refInput"
    v-input-trim
    class="input-password"
    :model-value="modelValue"
    type="password"
    :placeholder="placeholder"
    :maxlength="maxlength"
    show-password
    :readonly="readonly"
    @focus="onFocus"
    @input="handleChange"
  />
</template>

<script setup lang="ts">
import { defineProps, toRefs, ref } from "vue";
import { MAX_LENGTH_PASSWORD } from "../../../shared/utils/validate";

interface Prop {
  placeholder?: string;
  modelValue: string;
  maxlength?: number;
}
const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  modelValue: "",
  maxlength: MAX_LENGTH_PASSWORD,
});
const readonly = ref(true);
const emits = defineEmits(["update:modelValue"]);
const { placeholder, modelValue, maxlength } = toRefs(props);

const handleChange = (e) => {
  emits("update:modelValue", e);
};

const onFocus = () => {
  readonly.value = false;
};
</script>

<style scoped lang="scss">
.input-password {
  height: 40px;
}
</style>
