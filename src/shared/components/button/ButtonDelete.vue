<template>
  <button-gray
    :class="className"
    :name="name"
    :loading="loading"
    :disabled="disabled"
    :icon="IconDelete"
    @click="onclick"
  >
  </button-gray>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import IconDelete from "../icon/Delete.vue";
import ButtonGray from "../button/ButtonGray";
interface Prop {
  name?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
const props = withDefaults(defineProps<Prop>(), {
  name: "",
  loading: false,
  disabled: false,
  className: "",
});
const { name, loading } = toRefs(props);
const emits = defineEmits(["click"]);

const onclick = () => {
  emits("click");
};
</script>

<style lang="scss" scoped>
@use "../src/admin/assets/scss/variables" as *;

.el-button {
  padding: 9px 20px;
  height: 40px;
  font-weight: 500;
}

.btn-delete {
  background-color: $white-color;

  &:hover {
    border-color: $gray-100 !important;
    background-color: $gray-100;
    color: $black-80;
  }

  :deep(i) {
    font-size: 21px !important;
  }
}
</style>
