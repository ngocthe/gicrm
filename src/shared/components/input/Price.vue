<template>
  <el-input
    :model-value="modelValue"
    :placeholder="placeholder"
    :maxlength="maxLength"
    :disabled="disabled"
    :formatter="
      (value) =>
        `$ ${value}`
          .replace(/\D/g, '')
          .replace(/(?!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
    "
    class="custom-input-price"
    @input="updateValue"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { formatPrice } from "~/../../src/shared/utils";
import { toRefs } from "vue";
import { formatValuePrice } from "~/../../src/shared/utils/price";
import { MAX_PRICE } from "~/../../src/shared/constants";
import { MAX_LENGTH_DEFAULT } from "~/../../src/shared/utils/validate";
import priceDisplay from "~/../../src/shared/utils/price";

interface Prop {
  modelValue: string | null;
  placeholder?: string;
  maxLength?: number;
  maxPrice?: number;
  height?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  maxLength: MAX_LENGTH_DEFAULT,
  maxPrice: MAX_PRICE,
  height: "40px",
  disabled: false,
});

const { maxPrice } = toRefs(props);

const emit = defineEmits([
  "update:modelValue",
  "handleChange",
  "handleChangeInput",
]);

const updateValue = (event) => {
  let value = formatPrice(event);
  if (parseFloat(formatValuePrice(value)) >= maxPrice.value) {
    value = priceDisplay(maxPrice.value);
  }
  emit("update:modelValue", value);
  emit("handleChangeInput", value);
};

const handleChange = () => {
  emit("handleChange");
};
</script>

<style lang="scss" scoped>
.custom-input-price {
  height: v-bind(height);
}
</style>
