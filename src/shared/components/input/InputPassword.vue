<template>
  <el-input
    v-input-trim
    class="input-password"
    :model-value="modelValue"
    type="password"
    :placeholder="placeholder"
    :maxlength="maxlength"
    show-password
    @input="handleChange"
  />
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";
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
const emits = defineEmits(["update:modelValue"]);
const { placeholder, modelValue, maxlength } = toRefs(props);

const handleChange = (e) => {
  emits("update:modelValue", e);
};
</script>

<style scoped lang="scss">
.input-password {
  height: 40px;
}
</style>
