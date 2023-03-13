<template>
  <div class="input-code-store">
    <el-input
      v-model="prefixCode"
      :formatter="
        (value) =>
          `${value}`
            .replace(/[a-z]+/, function (match) {
              return match.toUpperCase();
            })
            .replace(/[^a-zA-Z]/g, '')
      "
      :model-value="prefixCode"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="clearable"
      :disabled="disabled"
      @input="handleInput"
    >
      <template #append> {{ suffixCode }}</template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import { MAX_LENGTH_STORE_CODE } from "~/../../src/shared/utils/validate";

interface Prop {
  placeholder?: string;
  prefixCode: string | null;
  suffixCode: string | null;
  maxlength?: number;
  disabled?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  prefixCode: "",
  suffixCode: "",
  maxlength: MAX_LENGTH_STORE_CODE,
  disabled: false,
  clearable: false,
});
const emits = defineEmits(["update:prefixCode"]);
const { placeholder, prefixCode, suffixCode, maxlength } = toRefs(props);

const handleInput = (e: string) => {
  emits("update:prefixCode", e);
};
</script>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.input-code-store {
  :deep(.el-input) {
    .el-input__wrapper {
      width: 65px;
    }

    .el-input-group__append {
      justify-content: flex-start;
      color: $black-80;
      background: $gray-80;
    }
  }
}
</style>
