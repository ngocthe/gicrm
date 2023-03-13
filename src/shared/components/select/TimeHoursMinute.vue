<template>
  <client-only>
    <el-select
      :model-value="modelValue"
      :placeholder="placeholder"
      filterable
      :disabled="disabled"
      @change="handleChangeTime"
    >
      <el-option
        v-for="time in arrTime"
        :key="time"
        :label="time"
        :value="time"
      />
    </el-select>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { getTimeArray } from "~/../../src/shared/utils";

const arrTime = ref<string[]>([]);
interface Prop {
  modelValue: string | null;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  modelValue: "24:00",
  disabled: false,
});

const emits = defineEmits(["update:modelValue"]);
const { placeholder, modelValue } = toRefs(props);

const handleChangeTime = (value: any) => {
  emits("update:modelValue", value);
};

arrTime.value = getTimeArray("00:00", "24:00", 15, "minutes");
</script>
