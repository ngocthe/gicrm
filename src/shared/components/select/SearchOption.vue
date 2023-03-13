<template>
  <client-only>
    <el-select
      v-model="value"
      :placeholder="placeholder"
      filterable
      @input="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
const value = ref("");

interface Prop {
  modelValue: string;
  placeholder?: string;
  options?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
});

const emits = defineEmits(["update:modelValue"]);
const { placeholder, modelValue } = toRefs(props);

const handleChange = (e) => {
  emits("update:modelValue", e);
};
</script>
