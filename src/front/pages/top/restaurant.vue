<template>
  <el-container class="top-container" direction="vertical">
    <Head>
      <Title>{{ $t("site_name_title") }}{{ $t("title_screen.top") }}</Title>
    </Head>
    <div class="section-slide-top">
      <SlideCategoryComponent :array-image="arrayImageSlider" />
    </div>
    <SectionIntroductionRecommended />
    <div class="section-content divider">
      <hr />
    </div>
    <SectionMapAndNews :show-type-store-in-modal="false" />
    <SectionBannerSmall />
    <SectionRecommendedStore />
    <SectionBannerLarge />
    <SectionRankingStore />

    <ExternalAds />
  </el-container>
</template>

<script lang="ts" setup>
import SlideCategoryComponent from "~/../../src/front/components/pages/home/SlideCategoryComponent.vue";
import SectionIntroductionRecommended from "../../components/pages/home/SectionIntroductionRecommended.vue";
import SectionMapAndNews from "../../components/pages/home/SectionMapAndNews.vue";
import SectionBannerLarge from "../../components/pages/home/SectionBannerLarge.vue";
import SectionRecommendedStore from "../../components/pages/home/SectionRecommendedStore.vue";
import SectionBannerSmall from "../../components/pages/home/SectionBannerSmall.vue";
import { onMounted } from "#imports";
import scrollToTop from "~/../../src/shared/utils/scroll";
import SectionRankingStore from "../../components/pages/home/SectionRankingStore.vue";
import ExternalAds from "../../components/common/ExternalAds.vue";

import { ref } from "vue";

//TODO:phase 2
const arrayImageSlider = ref([
  {
    src: "home/restaurant/restaurant1.jpg",
    content: "焼肉",
  },
  {
    src: "home/restaurant/restaurant2.jpg",
    content: "寿司",
  },
  {
    src: "home/restaurant/restaurant3.jpg",
    content: "居酒屋",
  },
  {
    src: "home/restaurant/restaurant4.jpg",
    content: "イタリアン",
  },
  {
    src: "home/restaurant/restaurant5.jpg",
    content: "ラーメン",
  },
  {
    src: "home/restaurant/restaurant6.jpg",
    content: "カフェ",
  },
]);

onMounted(() => {
  scrollToTop();
});
</script>

<style lang="scss" scoped>
.top-container {
  .section-slide-top {
    z-index: 2026;
    margin-bottom: 80px;
  }

  .divider {
    hr {
      margin: 0px;
      padding: 0px;
    }
  }
}
</style>
<style lang="scss">
@import url("../../assets/scss/page/top.scss");
</style>
