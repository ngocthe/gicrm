<template>
  <el-backtop
    v-show="showButtonBackTop"
    :right="80"
    :bottom="80"
    :visibility-height="visibilityHeight"
  >
    <IconBackTop />
  </el-backtop>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

const visibilityHeight = ref(100);
const showButtonBackTop = ref(true);
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  const distance = window.scrollY;
  showButtonBackTop.value = distance > visibilityHeight.value;
};

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.el-backtop {
  width: 82px;
  height: 74px;
  background-color: #212121;
  border-radius: 20px;
  z-index: 2027;
}

@include res("xs-only", $breakpoints-spec) {
  .el-backtop {
    right: 24px !important;
  }
}
</style>
