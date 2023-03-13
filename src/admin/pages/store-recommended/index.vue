<template>
  <ListScreenComponent class="list-recommend">
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("list_recommend") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("admin.recommended_store") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <recommend-table-data :type="POSITION_RECOMMEND.TOP" />
      <div class="space-block-table"></div>
      <recommend-table-data :type="POSITION_RECOMMEND.BOTTOM" />
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { POSITION_RECOMMEND } from "~/../../src/shared/constants/positionRecommend";
</script>

<style lang="scss" scoped>
.space-block-table {
  height: 20px;
  background-color: #f8fbff;
  margin: 0 -20px;
}

.list-recommend {
  :deep(.scroll-content) {
    height: calc(100% - 50px) !important;
  }
}

:deep(.content) {
  padding: 0 20px;
}
</style>
