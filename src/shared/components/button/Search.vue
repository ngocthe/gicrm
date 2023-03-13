<template>
  <el-button>
    <IconSearch />
    <span>{{ $t("button_search") }}</span>
  </el-button>
</template>

<style lang="scss" scoped>
@use "../src/front/assets/scss/variables" as *;

.el-button {
  padding: 9px 20px;
  height: 40px;
  float: right;
  background-color: $menuBg;
  color: $white-color;
}
</style>
