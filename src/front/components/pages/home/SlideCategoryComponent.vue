<template>
  <div>
    <!-- START Component for PC -->
    <el-carousel
      ref="_refCarousel"
      :interval="5000"
      arrow="always"
      indicator-position="none"
      :autoplay="true"
      class="main-carousel"
      @change="handleChange"
    >
      <!-- START Large image top -->
      <el-carousel-item v-for="(item, key) in arrayImage" :key="key">
        <div class="slider-image">
          <el-image :src="useAssets(item.src)" fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="content-main-slider">
            <p>総合予約システム</p>
            <h3>いいね！</h3>
            <h6>予約ARXIA</h6>
          </div>
        </div>
      </el-carousel-item>
      <!-- END Large image top -->
      <!-- START Small image bottom -->
      <div v-if="!deviceStore.isMobile()" class="small-image">
        <div
          v-for="(item, index) in filterImagePC"
          :key="index"
          class="small-image-item"
          @mouseover="handleHover(index)"
          @click="() => handleClickSmallImage(item.content)"
        >
          <el-image :src="useAssets(item.src)" fit="cover">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="gallery">
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
      <!-- END Small image bottom -->
    </el-carousel>
    <!-- END Component for PC -->
    <!-- START Component for mobile (width < 768px) -->
    <div v-if="deviceStore.isMobile()" class="small-image">
      <div class="pre-slide" @click="handlePreSlide">
        <el-icon color="#ffffff">
          <ArrowLeft />
        </el-icon>
      </div>
      <div
        v-for="(item, index) in filterImageMobile"
        :key="index"
        class="small-image-item"
        @mouseover="handleHover(index)"
      >
        <el-image :src="useAssets(item.src)" fit="cover">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="gallery">
          <p>{{ item.content }}</p>
        </div>
      </div>
      <div
        class="next-slide"
        :class="{ 'is-focus': isFocus }"
        @click="handleNextSlide"
      >
        <el-icon color="#ffffff">
          <ArrowRight />
        </el-icon>
      </div>
    </div>
    <!-- END Component for mobile (width < 768px) -->
    <div class="indicator">
      <div
        v-for="i in filterImagePC.length"
        :key="i - 1"
        class="indicator-item"
        :class="{ active: i - 1 === positionSliderActive }"
        @mouseenter="handleBlur(i - 1)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { useNuxtApp, useRouter } from "nuxt/app";

import {
  ArrowLeft,
  ArrowRight,
  Picture as IconPicture,
} from "@element-plus/icons-vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import useAssets from "~/../../src/front/composables/useAssets";
import { useStoreSearch } from "~/../../src/front/store/store";

const router = useRouter();
const storeSearch = useStoreSearch();
const { $bus } = useNuxtApp();

const _refCarousel = ref();
const positionSliderActive = ref(0);
const deviceStore = useDeviceStore();

interface Image {
  src: string;
  content: string;
}

interface Prop {
  arrayImage?: Image[];
}

const props = withDefaults(defineProps<Prop>(), {
  arrayImage: () => [],
});

const isFocus = ref(false);

const filterImageMobile = computed(() => {
  const nextIndex =
    positionSliderActive.value >= 5 ? 0 : positionSliderActive.value + 1;
  return [
    props.arrayImage.at(positionSliderActive.value - 1),
    props.arrayImage.at(positionSliderActive.value),
    props.arrayImage.at(nextIndex),
  ];
});

const filterImagePC = computed(() =>
  props.arrayImage.filter((item, index) => index < 6)
);

const handleChange = (index: any) => {
  positionSliderActive.value = index;
};

const handleHover = (index: any) => {
  _refCarousel.value?.setActiveItem(index);
};

const handleBlur = (index: any) => {
  _refCarousel.value?.setActiveItem(index);
};

const handlePreSlide = () => {
  _refCarousel.value.prev();
};

const handleNextSlide = () => {
  _refCarousel.value.next();
};

const handleClickSmallImage = async (content: string) => {
  storeSearch.headerSearch.keyword_name = content;
  $bus.$emit("searchStore", storeSearch.headerSearch);
  await router.push({ name: "store" });
};
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/variables.scss";

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.main-carousel {
  height: 1040px;

  :deep(.el-carousel__container) {
    height: 100%;

    .el-carousel__arrow--right {
      right: 160px;
    }

    .el-carousel__arrow--left {
      left: 160px;
    }

    .el-carousel__arrow {
      border-radius: 0;
      background-color: #303133cc;
      width: 80px;
      height: 80px;
      top: calc(50% - (216px / 2 - 120px / 2));
      transform: translateY(-50%);

      &:hover {
        background-color: #303133ff;
      }

      .el-icon {
        height: 22px;
        width: 22px;
      }

      svg {
        height: 22px;
        width: 22px;
      }
    }
  }
}

.slider-image {
  position: relative;
  width: 100%;
  height: 100%;

  .content-main-slider {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: $white-color;
    position: absolute;
    left: 50%;
    top: calc(50% - (216px / 2 - 120px / 2));
    transform: translateY(-50%) translateX(-50%);
    font-family: variables.$fontFamily;

    p {
      font-size: 16px;
      font-weight: 500;
    }

    h3 {
      color: $white-color;
      font-size: 80px;
      line-height: 116px;
      font-weight: 700;
    }

    h6 {
      font-size: 32px;
      line-height: 46px;
      font-weight: 500;
    }
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }

  .image-slot .el-icon {
    font-size: 30px;
  }
}

.small-image {
  display: flex;
  width: 100%;
  height: 216px;
  justify-content: center;
  align-items: center;
  background-color: $black-80;
  position: absolute;
  bottom: 0;
  left: 0;

  .root-slider {
    display: none;
  }

  .small-image-item {
    position: relative;
    margin: 0 8px;
    cursor: pointer;
    flex: 1;
    height: 184px;

    &:hover {
      .gallery {
        background-color: $black-80;
        width: 100%;
        height: 100%;
      }
    }

    .gallery {
      font-family: variables.$fontFamily;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      color: $white-color;
      font-weight: 400;
    }

    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

.indicator {
  height: 48px;
  background-color: $black-100;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  .indicator-item {
    width: 16px;
    height: 16px;
    background-color: $pink-color;
    border-radius: 100%;
    position: relative;
    cursor: pointer;

    &:after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 70%;
      height: 70%;
      border-radius: 100%;
      transform: translateX(-50%) translateY(-50%);
      background-color: $black-100;
      transition: 0.2s ease-in;
    }

    &.active,
    &:hover {
      &:after {
        width: 0;
        height: 0;
      }
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .main-carousel {
    height: 840px;

    :deep(.el-carousel__container) {
      height: 100%;

      .el-carousel__arrow--right {
        right: 90px;
      }

      .el-carousel__arrow--left {
        left: 90px;
      }

      .el-carousel__arrow {
        width: 50px;
        height: 50px;
        top: calc(50% - (134px / 2 - 116px / 2));
        transform: translateY(-50%);
      }
    }
  }

  .small-image {
    height: 134px;

    .small-image-item {
      height: 110px;

      .gallery {
        font-size: 24px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      top: calc(50% - (160px / 2 - 116px / 2));
      transform: translateY(-50%) translateX(-50%);

      h3 {
        font-size: 60px;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 760px;

    :deep(.el-carousel__container) {
      height: 100%;

      .el-carousel__arrow--right {
        right: 60px;
      }

      .el-carousel__arrow--left {
        left: 60px;
      }

      .el-carousel__arrow {
        top: calc(50% - 134px / 2);
        transform: translateY(calc(-50%));
      }
    }
  }

  .small-image {
    height: 134px;

    .small-image-item {
      .gallery {
        font-size: 24px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      top: calc(50% - 134px / 2);
      transform: translateY(-50%) translateX(-50%);

      h3 {
        font-size: 50px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 640px;
  }

  .small-image {
    .small-image-item {
      .gallery {
        font-size: 16px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .slider-image {
    .content-main-slider {
      left: 50%;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);

      p {
        font-size: 16px;
      }

      h3 {
        color: $white-color;
        font-size: 50px;
        line-height: 116px;
      }

      h6 {
        font-size: 32px;
        line-height: 46px;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .main-carousel {
    height: 480px;

    :deep(.el-carousel__container) {
      .el-carousel__arrow {
        display: none;
      }
    }
  }

  .small-image {
    position: relative;
    height: 92px;

    .pre-slide,
    .next-slide {
      display: flex;
      width: 25px;
      height: 25px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: absolute;
      z-index: 9;
      background-color: #303133cc;

      &:hover {
        background-color: #303133ff;
      }
    }

    .pre-slide {
      left: 10px;
    }

    .next-slide {
      right: 10px;
    }

    .small-image-item {
      height: 68px;

      .gallery {
        font-size: 16px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .slider-image {
    .content-main-slider {
      left: 50%;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);

      p {
        font-size: 16px;
        margin-bottom: 16px;
      }

      h3 {
        color: $white-color;
        font-size: 56px;
        line-height: 56px;
        margin-bottom: 24px;
      }

      h6 {
        font-size: 34px;
        line-height: 34px;
      }
    }
  }

  .indicator {
    height: 16px;
    gap: 8px;

    .indicator-item {
      width: 8px;
      height: 8px;

      &:after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 80%;
        height: 80%;
        border-radius: 100%;
        transform: translateX(-50%) translateY(-50%);
        background-color: $black-100;
        transition: 0.2s ease-in;
      }

      &.active,
      &:hover {
        &:after {
          width: 0;
          height: 0;
        }
      }
    }
  }
}

@include res("xs-phone", $custom-breakpoints-spec) {
  .slider-image {
    :deep(.el-image) {
      img {
        object-position: -300px;
      }
    }
  }
}
</style>
