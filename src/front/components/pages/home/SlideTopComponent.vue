<template>
  <div>
    <el-carousel
      ref="_refCarousel"
      :interval="5000"
      arrow="always"
      indicator-position="none"
      :autoplay="false"
      class="main-carousel"
      :initial-index="arrayImage.length - 1"
      @change="handleChange"
    >
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
      <!--hidden ipad-->
      <div
        v-if="deviceStore.breakPoint >= BreakPointDevice.MD"
        class="smail-image"
      >
        <div
          v-for="(item, index) in filterImagePC"
          :key="index"
          class="smail-image-item"
          @click="handleClick(index)"
          @mouseover="handleHover(index)"
        >
          <el-image :src="useAssets(item.src)" fit="cover" :lazy="true">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div class="gallery">
            <p class="description">{{ item.content.description }}</p>
            <p v-show="item.content?.description_detail" class="description">
              {{ item.content.description_detail }}
            </p>
            <el-divider />
            <p class="title">{{ item.content.title }}</p>
          </div>
        </div>
      </div>
    </el-carousel>
    <!--Thumbnail Image in Mobile < 1025px-->
    <div
      v-if="deviceStore.breakPoint < BreakPointDevice.MD"
      class="smail-image"
    >
      <div
        v-for="(item, index) in filterImagePC"
        :key="index"
        class="smail-image-item"
        @click="handleClick(index)"
      >
        <el-image :src="useAssets(item.src)" fit="cover" :lazy="true">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="gallery">
          <p class="description">{{ item.content.description }}</p>
          <p v-show="item.content?.description_detail" class="description">
            {{ item.content.description_detail }}
          </p>
          <el-divider />
          <p class="title">{{ item.content.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref } from "vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import typeStoreCategory from "~/../../src/shared/constants/category";
import { BreakPointDevice } from "~/../../src/shared/constants";
import { useRouter } from "#imports";
import useAssets from "~/../../src/front/composables/useAssets";
import { useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";

const router = useRouter();
const _refCarousel = ref();
const positionSliderActive = ref(-1);
const deviceStore = useDeviceStore();
const categorySelected = ref(inject("categorySelectedGlobal", ""));

//TODO:phase 2
const arrayImage = ref([
  {
    src: "home/salon/salon1-min.webp",
    content: {
      description: "ヘアサロン ネイルサロン エステサロン",
      description_detail: "りらくサロン まつげサロン",
      title: "美容・リラク",
    },
  },
  {
    src: "home/restaurant/restaurant1-min.webp",
    content: {
      description: "レストラン 飲食店 宴会予約",
      title: "飲食",
    },
  },
  {
    src: "home/medical.jpg",
    content: {
      description: "クリニック 歯科医院 整骨院",
      title: "医療",
    },
  },
  {
    src: "home/education.jpg",
    content: {
      description: "ヨガ教室 塾 料理教室 スポーツクラブ",
      title: "教室",
    },
  },
  {
    src: "home/consultation.jpg",
    content: {
      description: "弁護士 社労士 行政書士 結婚相談",
      title: "相談",
    },
  },
  {
    src: "home/event.jpg",
    content: {
      description: "工場見学 レジャー お見合いパーティー",
      title: "イベント",
    },
  },
  {
    src: "home/top.png",
    content: {
      description: "総合予約システム",
      title: "予約ARXIA",
    },
  },
]);

const filterImagePC = computed(() =>
  arrayImage.value.filter((item, index) => index < 6)
);

const handleChange = (index) => {
  positionSliderActive.value = index;
};

const handleClick = (index) => {
  categorySelected.value = `${+index + 1}`;
  switch (index + 1) {
    case typeStoreCategory.RESTAURANT:
      router.push({ name: "top-restaurant" });
      break;
    case typeStoreCategory.SALON:
      router.push({ name: "top-salon" });
      break;
    case typeStoreCategory.MEDIAL_CARE:
      router.push({ name: "top-medical-care" });
      break;
    case typeStoreCategory.CLASSROOM:
      router.push({ name: "top-school" });
      break;
    case typeStoreCategory.EVENT:
      router.push({ name: "top-event" });
      break;
    case typeStoreCategory.CONSULTATION:
      router.push({ name: "top-consultation" });
      break;
    default:
      router.push({ name: "top-restaurant" });
      break;
  }
};

const handleHover = (index) => {
  categorySelected.value = `${+index + 1}`;
  useCookie(persistKeys.MENU).value = categorySelected.value;
};

onBeforeUnmount(() => {
  categorySelected.value = "";
});
</script>
<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "../../../../shared/assets/scss/variables.scss";

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

  &.el-carousel--horizontal {
    overflow-y: hidden;
  }

  :deep(.el-carousel__container) {
    height: 100%;

    .el-carousel__arrow {
      display: none;

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

.smail-image {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 0;

  .root-slider {
    display: none;
  }

  .smail-image-item {
    position: relative;
    cursor: pointer;
    flex: 1;
    height: 240px;

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
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      font-size: 32px;
      color: $white-color;
      font-weight: 400;
      padding-left: 24px;
      padding-right: 80px;
      padding-bottom: 24px;

      .description {
        font-size: 12px;
        line-height: 18px;
      }

      .el-divider {
        width: 100px;
        margin: 8px 0 4px;
        border: 2px solid $white-color;
      }

      .title {
        font-size: 20px;
        font-weight: 700;
        line-height: 28px;
      }
    }

    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .main-carousel {
    height: 840px;

    :deep(.el-carousel__container) {
      height: 100%;
    }
  }

  .smail-image {
    height: 160px;

    .smail-image-item {
      height: 100%;

      .gallery {
        padding-left: 16px;
        padding-right: 30px;

        .description {
          font-size: 11px;
          line-height: 18px;
        }

        .el-divider {
          width: 100px;
          margin: 8px 0 4px;
          border: 1px solid $white-color;
        }

        .title {
          font-size: 18px;
          font-weight: 700;
          line-height: 26px;
        }
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
        line-height: 66px;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 760px;

    :deep(.el-carousel__container) {
      height: 100%;
    }
  }

  .slider-image {
    .content-main-slider {
      top: calc(50% - 134px / 2);
      transform: translateY(-50%) translateX(-50%);

      h3 {
        font-size: 50px;
        line-height: 76px;
      }
    }
  }

  .smail-image {
    flex-wrap: wrap;

    .smail-image-item {
      .gallery {
        font-size: 24px;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .main-carousel {
    height: 640px;

    :deep(.el-carousel__container) {
      height: 100%;
    }
  }

  .smail-image {
    position: relative;
    height: 100%;
    flex-wrap: wrap;

    .smail-image-item {
      height: 180px;
      flex: 1 1 calc(100% / 3);

      .gallery {
        padding-bottom: 16px;
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
        line-height: 76px;
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
    height: 556px;
  }

  .smail-image {
    position: relative;
    height: 100%;
    flex-wrap: wrap;

    .smail-image-item {
      height: 140px;
      flex: 1 1 calc(100% / 2);

      .gallery {
        padding-bottom: 12px;
        padding-left: 12px;
        padding-right: 12px;

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .el-divider {
          width: 100px;
          margin: 8px 0 4px;
          border: 1px solid $white-color;
        }

        .title {
          font-size: 20px;
          font-weight: 700;
          line-height: 28px;
        }
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
}

@include res("xs-phone", $custom-breakpoints-spec) {
  .slider-image {
    :deep(.el-image) {
      img {
        object-position: -425px;
      }
    }
  }
}
</style>
