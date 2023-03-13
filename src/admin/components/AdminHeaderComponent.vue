<template>
  <div class="admin-header">
    <div class="left">
      <div
        class="toggle cursor-pointer d-flex justify-content-center align-items-center"
        @click="toggleSidebar"
      >
        <el-tooltip
          v-if="!isCollapse"
          :content="$t('close_dashboard')"
          placement="top-start"
        >
          <IconToggle />
        </el-tooltip>
        <el-tooltip
          v-else
          :content="$t('open_dashboard')"
          placement="top-start"
        >
          <unexpand-sidebar />
        </el-tooltip>
      </div>
      <div class="breadcrumb">
        <el-breadcrumb :separator-icon="ArrowRight">
          <template
            v-for="(item, key) in breadcrumbStore.breadcrumb"
            :key="key"
          >
            <el-breadcrumb-item
              v-if="item.name && item?.name !== route?.name"
              :to="{ name: item?.name }"
            >
              {{ item?.title }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-else>{{ item?.title }}</el-breadcrumb-item>
          </template>
        </el-breadcrumb>
      </div>
    </div>
    <div class="right">
      <div class="noti cursor-pointer">
        <ClientOnly>
          <CommonDropdownNotification />
        </ClientOnly>
      </div>
      <el-divider direction="vertical" />
      <div ref="_refInfo" class="info d-flex align-items-center cursor-pointer">
        <div v-if="meStore.getAvatar">
          <el-avatar
            :size="24"
            shape="square"
            class="avatar-customer"
            :src="avatarUrl"
            @error="() => true"
          >
            <img src="/assets/image/no-avatar.png" alt="" />
          </el-avatar>
        </div>
        <div v-else>
          <IconUserInfo />
        </div>
        <ClientOnly>
          <div
            class="user-name text-long-elise"
            @click="$router.push({ name: 'index' })"
          >
            {{ meStore.info?.fullname }}
          </div>
          <el-icon>
            <ArrowDown />
          </el-icon>
          <el-popover
            :teleported="false"
            :virtual-ref="_refInfo"
            :width="50"
            popper-class="custom-dropdown-info"
          >
            <ul class="list-item">
              <li @click="$router.push({ name: 'profile' })">
                {{ $t("title_screen.profile") }}
              </li>
              <li @click="$router.push({ name: 'change-password' })">
                {{ $t("title_screen.change_password") }}
              </li>
              <li @click="logout">{{ $t("logout") }}</li>
            </ul>
          </el-popover>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "#imports";
import { BreadcrumbStore } from "~/../../src/admin/store/breadcrumb";
import { adminRouters } from "~/../../src/admin/router";
import { useMeStore } from "~/../../src/shared/stores/me";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import resetStore from "~/../../src/admin/composables/resetStore";
import { useNuxtApp } from "nuxt/app";
import UnexpandSidebar from "~/../../src/shared/components/icon/UnexpandSidebar.vue";
import authRequest from "~~/../../src/shared/requests/AuthRequest";

const meStore = useMeStore();
const route = useRoute();
const breadcrumbStore = BreadcrumbStore();
const emits = defineEmits(["toggleSidebar"]);
const isCollapse = ref(false);
const { $bus } = useNuxtApp();

const router = useRouter();
const _refInfo = ref();

const avatarUrl = computed(() => meStore.getAvatar);

const logout = async () => {
  try {
    await authRequest.logout();
  } catch (e) {
  } finally {
    const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
    cookieToken.value = null;
    resetStore();
    router.push({ name: "login" });
  }
};

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
  emits("toggleSidebar", isCollapse.value);
  let toggle = document.querySelector(".toggle");
  let navigator = document.querySelector(".navigation");
  let main = document.querySelector(".main-container");

  toggle.classList.toggle("active");
  navigator.classList.toggle("active");
  main.classList.toggle("active");
  setTimeout(() => {
    $bus.$emit("resizeHeader");
  }, 200);
};

const getAncestors = (target, routers, ancestors = []) => {
  if (!routers) return undefined;
  for (let router of routers) {
    if (router.name === target) {
      return ancestors.concat(router);
    }
    const found = getAncestors(
      target,
      router.children,
      ancestors.concat(router)
    );
    if (found) {
      return found;
    }
  }
};

const getBreadcrumb = () => {
  breadcrumbStore.setBreadcrumb(getAncestors(route.name, adminRouters));
};

watch(route, () => {
  getBreadcrumb();
});

onMounted(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/admin/assets/scss/variables.scss" as *;

$bg-header: #ffffff;

.admin-header {
  width: 100%;
  background: $bg-header;
  height: $height-header;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-name {
    max-width: 250px;
  }

  .toggle {
    position: relative;
    display: inline-flex;
    width: 37px;
    height: 100%;
  }

  .breadcrumb {
    display: inline-block;
  }

  .right {
    display: inline-flex;
    float: right;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-right: 20px;

    .info {
      gap: 8px;

      :deep(.el-popper.custom-dropdown-info) {
        padding: 7px 0;
      }

      .el-popper.custom-dropdown-info ul li {
        cursor: pointer;
        padding: 7px 20px;
      }

      .el-popper.custom-dropdown-info ul li:hover {
        background-color: $background-li-menu;
        color: $color-menu-item;
      }
    }
  }

  .el-divider--vertical {
    margin: 0 19px;
  }

  :deep(svg) {
    &:focus {
      outline: none !important;
    }
  }
}
</style>
