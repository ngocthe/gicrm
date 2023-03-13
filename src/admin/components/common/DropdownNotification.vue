<template>
  <el-badge
    ref="_refNotification"
    :value="countNoticeListNews"
    :hidden="!countNoticeListNews"
    :max="99"
    class="item"
  >
    <IconNotification class="cursor-pointer" />
  </el-badge>
  <el-popover
    :teleported="false"
    :virtual-ref="_refNotification"
    trigger="hover"
    :width="360"
    popper-class="custom-dropdown-notification"
  >
    <div class="header d-flex">
      <div class="title">{{ $t("news") }}</div>
      <div class="number">({{ noticeListNews.length }})</div>
    </div>
    <el-scrollbar>
      <div class="body">
        <div v-for="i in noticeListNews" :key="i" class="item d-flex">
          <!--  TODO -->
        </div>
      </div>
    </el-scrollbar>
    <div
      v-if="noticeListNews && noticeListNews.length"
      class="footer d-flex justify-content-center"
    >
      <button-common
        name="see_more"
        width="150px"
        background-color="#0071BC"
        color="white"
      ></button-common>
    </div>
    <div v-else class="no-data">{{ $t("no_data") }}</div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
const countNoticeListNews = ref(0);
const _refNotification = ref();

const noticeListNews = ref([]);
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/variables.scss" as *;

.header {
  color: $blue-color;
  gap: 5px;
  border-bottom: 1px solid #e8e8e8;
  padding: 12px 10px;
}

.body {
  max-height: 310px;
  .item {
    gap: 16px;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;

    .item-image {
      width: 100px;
      height: 80px;

      .el-image {
        width: 100px;
        height: 80px;
      }
    }

    .item-body {
      .title {
        margin-bottom: 4px;

        p {
          color: $red-color;
          display: inline-block;
          max-width: 60px;
          vertical-align: middle;
        }
      }

      .time,
      .description {
        font-size: 12px;
        color: $black-60;
      }

      .time {
        margin-bottom: 8px;
      }
    }
  }
}

.footer {
  margin: 20px 0;
}

.no-data {
  padding: 12px 10px;
  color: $black-80;
}
</style>
