<template>
  <client-only>
    <el-select
      :model-value="modelValue"
      :multiple="true"
      :filterable="filterable"
      :allow-create="true"
      :default-first-option="true"
      :reserve-keyword="false"
      :teleported="false"
      :placeholder="placeholder"
      class="custom-input-select-multi"
      :multiple-limit="limit"
      @remove-tag="handleRemove"
      @keydown="handleKeyDown"
      @change="updateValue"
      @click="handleClick"
    >
      <el-option
        v-for="item in options"
        :key="item[propKey]"
        :label="item[label]"
        :value="item[value]"
      />
    </el-select>
  </client-only>
</template>

<script lang="ts" setup>
import { MAX_LENGTH_TAG } from "../../utils/validate";
import { nextTick, ref } from "vue";

interface Prop {
  modelValue: string[];
  placeholder?: string;
  value?: string;
  label?: string;
  propKey?: string;
  options: [];
  limit?: number;
  maxLengthTag?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  placeholder: "",
  value: "id",
  label: "label",
  propKey: "id",
  maxLengthTag: MAX_LENGTH_TAG,
});
const filterable = ref(true);
const isRemove = ref(false);
const emit = defineEmits(["update:modelValue"]);

if (props?.modelValue?.length >= props.limit) {
  filterable.value = false;
}

const updateValue = (event) => {
  let lastItem = event[event.length - 1];
  if (lastItem === "") return;
  if (lastItem?.length > props.maxLengthTag) {
    event[event?.length - 1] = lastItem.slice(0, props.maxLengthTag);
  }
  nextTick(() => {
    if (event[event.length - 1]) {
      event[event.length - 1] = event[event.length - 1].trim();
    }
    if (!event[event?.length - 1]?.length && !isRemove.value) {
      return;
    } else {
      emit("update:modelValue", event);
      isRemove.value = false;
    }
  });
};

const handleRemove = () => {
  isRemove.value = true;
};

const handleClick = () => {
  if (props.modelValue?.length < props.limit) {
    filterable.value = true;
  }
};

const handleKeyDown = (e) => {
  if (e.target?.value?.length >= props.maxLengthTag) {
    e.preventDefault();
  }
  if (props?.limit && props.modelValue.length >= props.limit) {
    e.preventDefault();
    filterable.value = false;
    return false;
  }
};
</script>

<style lang="scss">
@import "~/../../src/shared/assets/scss/variables.scss";

.custom-input-select-multi {
  width: 100%;

  .el-input {
    min-height: 40px;
  }

  ul.el-select-dropdown__list {
    flex-wrap: wrap;
  }

  .el-select__tags {
    .el-tag--info {
      background-color: $gray-100;
      color: $black-80;
    }

    .el-tag__content {
      display: flex;
    }
  }

  .el-select-dropdown__wrap {
    .el-select-dropdown__list {
      margin: 0 !important;
      display: flex !important;
      gap: 8px;

      .el-select-dropdown__item {
        font-size: 12px;
        height: 24px;
        line-height: 24px;
        padding: 0 8px;
        background: $gray-100;
        color: $black-80;
        border-radius: 3px;

        &.selected {
          &:after {
            display: none;
          }

          &.hover {
            background: $gray-100;
          }
        }

        &:hover {
          background: $gray-100;
        }
      }
    }

    padding: 8px 12px;
  }
}
</style>
