<template>
  <div class="navigation">
    <div class="logo-sidebar" :class="{ collapse: isCollapse }">
      <white-arxia class="big-arxia" />
    </div>
    <div class="item-menu">
      <el-scrollbar always>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          background-color="#33415C"
          text-color="#ffffff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
        >
          <template v-for="(item, index) in adminRouters" :key="index">
            <div>
              <template v-if="!item.hidden && isShowChild(item.children)">
                <!--Have no sub-menu-->
                <el-menu-item :index="item.name" :route="{ name: item.name }">
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon>
                  <template #title>{{ item.title }}</template>
                </el-menu-item>
              </template>
              <!--Have sub-menu-->
              <el-sub-menu v-else-if="!item.hidden" :index="item.name">
                <template #title>
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon>
                  <span v-if="!isCollapse">{{ item.title }}</span>
                </template>
                <el-menu-item
                  v-for="(child, key) in item.children"
                  :key="key"
                  :index="child.name"
                  :route="{ name: child.name }"
                >
                  {{ child.title }}
                </el-menu-item>
              </el-sub-menu>
            </div>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { BreadcrumbStore } from "~/../../src/admin/store/breadcrumb";
import { adminRouters } from "~/../../src/admin/router";
import WhiteArxia from "~/../../src/shared/components/icon/WhiteArxia.vue";

const breadcrumbStore = BreadcrumbStore();

interface Prop {
  isCollapse?: boolean;
}

withDefaults(defineProps<Prop>(), {
  isCollapse: false,
});

const isShowChild = (children = []) => {
  const showingChildren = children.filter((item) => !item.hidden);
  return showingChildren.length === 0;
};

const activeMenu = computed(() => {
  const menu = breadcrumbStore?.breadcrumb?.filter((item) => !item.hidden);
  return menu?.length && menu[menu.length - 1]?.name;
});
</script>

<style lang="scss" scoped>
@use "~/../../src/admin/assets/scss/variables.scss" as *;

$bg-item: #7d8597;
$bg-sidebar: #33415c;
$color-item-hover: #ffffff;
$color-hover-icon: #ffffff;
$color-item: #ffffff;

.navigation {
  position: fixed;
  height: 100%;
  background-color: $bg-sidebar;
  overflow: hidden;
  z-index: 2030;

  &.active {
    width: $widthCollapse;
  }

  .logo-sidebar {
    height: 64px;
    padding: 12px 18px;
    margin-bottom: 16px;

    &.collapse {
      padding: 12px 8px;
    }

    .big-arxia {
      width: 176px;
      height: 60px;
    }
  }

  .item-menu {
    height: calc(100% - 64px - 16px);
  }

  :deep(.el-menu) {
    --el-menu-border-color: $bg-sidebar;
    --el-menu-base-level-padding: 18px;
    width: 270px;

    .el-menu-item {
      --el-menu-item-height: 48px;
    }

    &.el-menu--collapse {
      --el-menu-icon-width: 20px;
      --el-menu-base-level-padding: 20px;
      width: 60px;
    }

    .el-menu-item.is-active {
      background: $bg-item;
      color: $white-color;
    }

    .el-sub-menu .el-menu {
      background: $bg-sidebar;
    }

    .el-sub-menu .el-menu--inline {
      .el-menu-item {
        --el-menu-base-level-padding: 30px;
        --el-menu-level-padding: 20px;
      }
    }
  }
}
</style>
