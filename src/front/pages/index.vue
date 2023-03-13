<template>
  <el-container class="top-container" direction="vertical">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("title_screen.top") }}</Title>
    </Head>
    <div class="section-slide-top">
      <SlideTopComponent />
    </div>
    <SectionBannerLarge />
    <SectionMapAndNews :show-type-store-in-modal="true" />
    <SectionBannerSmall />
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useCookie } from "nuxt/app";

import SlideTopComponent from "~/../../src/front/components/pages/home/SlideTopComponent.vue";
import SectionBannerSmall from "~/../../src/front/components/pages/home/SectionBannerSmall.vue";
import SectionBannerLarge from "~/../../src/front/components/pages/home/SectionBannerLarge.vue";
import SectionMapAndNews from "../components/pages/home/SectionMapAndNews.vue";

import { persistKeys } from "~/../../src/shared/constants/persist-key";
import scrollToTop from "~/../../src/shared/utils/scroll";

const menu = useCookie(persistKeys.MENU);

onMounted(() => {
  scrollToTop();
});
if (menu.value) {
  menu.value = "";
}
</script>

<style lang="scss" scoped>
.top-container {
  .section-slide-top {
    z-index: 2026;
    margin-bottom: 80px;
  }
}
</style>
<style lang="scss">
@import url("../assets/scss/page/top.scss");
</style>
