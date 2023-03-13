<template>
  <client-only>
    <el-date-picker
      v-model="date"
      type="date"
      class="input-date"
      :format="format"
      :placeholder="placeholder"
      :value-format="valueFormat"
      :readonly="isReadonly"
      :disabled="isDisable"
      :editable="true"
      :disabled-date="disabledDate"
      :clearable="clearable"
      @change="handleChange"
    />
  </client-only>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch } from "vue";

type DateFunction = (time: Date) => boolean;
interface Prop {
  modelValue: string | null;
  placeholder?: string;
  format?: string;
  width?: string;
  isReadonly?: boolean;
  isDisable?: boolean;
  clearable?: boolean;
  valueFormat?: string;
  disabledDate?: DateFunction;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  format: "YYYY年MM月DD日",
  valueFormat: "YYYY-MM-DD",
  width: "134px",
  isDisable: false,
  clearable: false,
  disabledDate: () => {
    return false;
  },
});

const emits = defineEmits(["update:modelValue", "disabledDate"]);
const { placeholder, modelValue, format } = toRefs(props);
const date = ref(modelValue.value);

watch(modelValue, (val) => {
  if (val) {
    date.value = val;
  }
});
const handleChange = (e) => {
  emits("update:modelValue", e);
};
</script>

<style scoped lang="scss">
.input-date:deep {
  width: v-bind(width);
  margin-right: 12px;
  height: 40px;
}
</style>
