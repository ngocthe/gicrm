<template>
  <el-button class="btn-add" type="primary">
    <IconAddNew />
    <span>{{ $t("create_new") }}</span>
  </el-button>
</template>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.el-button {
  height: 40px;
  background-color: $green-medium-color;
  border: none;
}
</style>
