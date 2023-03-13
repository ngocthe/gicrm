<template>
  <!-- START MAP -->
  <div class="map">
    <!-- START Title map -->
    <div class="title-map">
      {{ $t("title_map") }}
    </div>
    <!-- END Title imagmap -->
    <!-- START Image map -->
    <img
      id="store__map"
      class="map-image noselect"
      src="../../../../assets/images/japan-map.png"
      usemap="#store__map"
    />
    <!-- END Image map -->
    <!-- START Map handle click -->
    <map name="store__map">
      <area
        shape="poly"
        coords="88,289,2,288,1,163,147,163,148,227"
        data-fancybox=""
        data-src="#map-okinawa"
        alt="沖縄県"
        title="沖縄県"
        @click="() => handleSelectArea(Area.OKINAWA)"
      />
      <area
        shape="poly"
        coords="218,641,208,578,177,543,130,526,113,473,87,469,24,460,22,639"
        data-fancybox=""
        data-src="#map-kyushu"
        alt="九州地方"
        title="九州地方"
        @click="() => handleSelectArea(Area.KYUSHU)"
      />
      <area
        shape="poly"
        coords="267,576,301,543,244,487,216,487,199,446,171,449,111,476,129,525"
        data-fancybox=""
        data-src="#map-shikoku"
        alt="四国地方"
        title="四国地方"
        @click="() => handleSelectArea(Area.SHIKOKU)"
      />
      <area
        shape="poly"
        coords="170,453,121,475,23,459,17,358,87,358,160,391"
        data-fancybox=""
        data-src="#map-chugoku"
        alt="中国地方"
        title="中国地方"
        @click="() => handleSelectArea(Area.CHUGOKU)"
      />
      <area
        shape="poly"
        coords="219,261,227,350,232,369,231,411,242,486,213,484,197,445,171,449,164,392,131,377,128,263"
        data-fancybox=""
        data-src="#map-kinki"
        alt="近畿地方"
        title="近畿地方"
        @click="() => handleSelectArea(Area.KINKI)"
      />
      <area
        shape="poly"
        coords="292,406,309,387,374,475,354,538,303,543,244,489,231,409,262,411,277,394"
        data-fancybox=""
        data-src="#map-tokai"
        alt="中部東海地方"
        title="中部東海地方"
        @click="() => handleSelectArea(Area.TOKAI)"
      />
      <area
        shape="poly"
        coords="311,388,336,349,378,362,524,362,534,452,530,485,525,503,508,501,487,501,443,501,370,461,335,428"
        data-fancybox=""
        data-src="#map-kanto"
        alt="関東地方"
        title="関東地方"
        @click="() => handleSelectArea(Area.KANTO)"
      />
      <area
        shape="poly"
        coords="223,317,219,243,233,231,272,235,323,224,333,256,332,351,290,410,278,391,259,409,225,409,233,368"
        data-fancybox=""
        data-src="#map-hokuriku"
        alt="北陸甲信越"
        title="北陸甲信越"
        @click="() => handleSelectArea(Area.HOKURIKU)"
      />
      <area
        shape="poly"
        coords="332,221,350,197,378,180,455,191,488,223,532,241,537,316,519,334,409,347,382,363,335,348,336,332"
        data-fancybox=""
        data-src="#map-tohoku"
        alt="東北地方"
        title="東北地方"
        @click="() => handleSelectArea(Area.TOHOKU)"
      />
      <area
        shape="poly"
        coords="346,17,410,4,443,11,456,35,473,44,533,60,538,136,468,194,381,172,346,194,294,176,291,45"
        data-fancybox=""
        data-src="#map-hokkaido"
        alt="北海道"
        title="北海道"
        @click="() => handleSelectArea(Area.HOKKAIDO)"
      />
    </map>
    <!-- END Map handle click -->
    <!-- START Search GPS -->
    <div class="search-gps">
      <el-button class="btn-search" @click="handleClickSearchGPS">
        <IconSearchCurrentPosition />
        <span class="text">
          {{ $t("search_from_current_location") }}
        </span>
      </el-button>
    </div>
    <!-- END Search GPS -->
  </div>
  <!-- END MAP -->
  <!-- START MODAL SEARCH -->
  <ModalSearchPortal :dialog-visible="dialogVisible">
    <template #body>
      <div v-show="props.showTypeStore" class="body-option">
        <el-radio-group v-model="typeStore">
          <el-radio
            v-for="item in dataTypeStore"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="city-option">
        <el-radio-group v-model="citySearch" size="large">
          <el-radio-button
            v-for="(item, index) in cityList"
            :key="index"
            :label="item"
          />
        </el-radio-group>
      </div>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <ButtonDefault
          :name="$t('close')"
          width="110px"
          :disabled="isLoading"
          @click="handleClose"
        />
        <ButtonYellow
          class="btn-confirm"
          :name="$t('button.search')"
          width="110px"
          :loading="isLoading"
          @click="handleConfirm"
        />
      </span>
    </template>
  </ModalSearchPortal>
  <!-- END MODAL SEARCH -->
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  defineAsyncComponent,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { useRouter, useRoute } from "nuxt/app";
import { useCookie } from "#app";
import { useNuxtApp } from "#imports";

import { i18n } from "~/../../src/shared/plugins/i18n";

import { ImageResize } from "../../../../helpers/imageMapResize";
import { useStoreSearch } from "~/../../src/front/store/store";
import { persistKeys } from "~/../../src/shared/constants/persist-key";

import {
  getPositionSuccess,
  getPositionFailure,
} from "../../../../composables/map";

import { dataTypeStore, SALON } from "~/../../src/shared/constants/category";
import { Area, CITY } from "../../../../../shared/constants/map";
import { Permission } from "~/../../src/shared/constants/browser";

import ButtonDefault from "~/../../src/shared/components/button/ButtonDefault.vue";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import { ElMessage } from "element-plus";

const ModalSearchPortal = defineAsyncComponent(
  () => import("~/../../src/front/components/modal/ModalSearchPortal.vue")
);

const storeSearch = useStoreSearch();
const router = useRouter();
const route = useRoute();

type Props = {
  showTypeStore: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  showTypeStore: true,
});

const isLoading = ref<boolean>(false);

const { $bus } = useNuxtApp();
const { t } = i18n.global;

const dialogVisible = ref<boolean>(false);

const categorySelected = computed(() => {
  return useCookie(persistKeys.MENU).value;
});
const typeStore = ref<number>(Number(categorySelected.value));
const citySearch = ref<string>("");
const cityList = ref<string[]>([]);
const permission = ref<PermissionStatus>();
/**
 * Handle select area in map
 *
 * @param {string} keyword keyword search
 *
 * @return void
 */
const handleSelectArea = (keyword: string) => {
  handleTypeStore();

  fillCityListByArea(keyword);
  citySearch.value = cityList.value[0] || "";
  dialogVisible.value = true;
};

/**
 * Handle search GPS in map
 */
const handleClickSearchGPS = async () => {
  if (navigator.geolocation) {
    permission.value = await navigator.permissions.query({
      name: "geolocation",
    });

    navigator.geolocation.getCurrentPosition(
      getPositionSuccess,
      getPositionFailure
    );

    handlePermissionGeoLocation(permission.value);

    permission.value.onchange = () => {
      if (permission.value) {
        handlePermissionGeoLocation(permission.value);
      }
    };
  } else {
    ElMessage.error(t("errors.geolocation_is_not_supported_by_this_browser"));
    throw new Error("Geolocation is not supported by this browser.");
  }
};

const handlePermissionGeoLocation = async (permission: PermissionStatus) => {
  if (permission.state === Permission.DENIED) {
    ElMessage.error(t("errors.can_not_get_coordinate"));
    throw new Error("Geolocation permission state is denied");
  } else if (permission.state === Permission.PROMPT) {
    throw new Error("Geolocation permission state is prompt");
  } else if (permission.state === Permission.GRANTED) {
    navigator.geolocation.getCurrentPosition(
      getPositionSuccess,
      getPositionFailure
    );

    /*
      COMPLETE: When router in portal site, popup select type store alway display, even though user hover to small image
    */
    if (route.name === "index") {
      useCookie(persistKeys.MENU).value = null;
    }

    nextTick(async () => {
      $bus.$emit("searchStore");
      nextTick(async () => {
        if (!useCookie(persistKeys.MENU).value) {
          return;
        }
        await router.push({ name: "store" });
      });
    });
  }
};

/**
 * Fill city list
 *
 * @param {string} area
 *
 * @return void
 */
const fillCityListByArea = (area: string) => {
  switch (area) {
    case Area.OKINAWA:
      cityList.value = CITY.OKINAWA;
      break;
    case Area.KYUSHU:
      cityList.value = CITY.KYUSHU;
      break;
    case Area.SHIKOKU:
      cityList.value = CITY.SHIKOKU;
      break;
    case Area.CHUGOKU:
      cityList.value = CITY.CHUGOKU;
      break;
    case Area.KINKI:
      cityList.value = CITY.KINKI;
      break;
    case Area.TOKAI:
      cityList.value = CITY.TOKAI;
      break;
    case Area.KANTO:
      cityList.value = CITY.KANTO;
      break;
    case Area.HOKURIKU:
      cityList.value = CITY.HOKURIKU;
      break;
    case Area.TOHOKU:
      cityList.value = CITY.TOHOKU;
      break;
    case Area.HOKKAIDO:
      cityList.value = CITY.HOKKAIDO;
      break;
    default:
      break;
  }
};

/**
 * Handle click confirm of modal
 */
const handleConfirm = async () => {
  isLoading.value = true;
  useCookie(persistKeys.MENU).value = String(typeStore.value);

  nextTick(async () => {
    storeSearch.headerSearch.transportation = citySearch.value;
    $bus.$emit("searchStore");
    storeSearch.cacheSearch();
    dialogVisible.value = false;

    isLoading.value = false;
    dialogVisible.value = false;

    await router.push({ name: "store" });
  });
};

/**
 * Handle click close of modal
 *
 * @return void
 */
const handleClose = () => {
  dialogVisible.value = false;
};

/**
 * Handle typeStore in modal
 */
const handleTypeStore = () => {
  typeStore.value = Number(categorySelected.value);

  if (!typeStore.value) {
    typeStore.value = SALON;
  }
};

onMounted(() => {
  new ImageResize({
    width: 540,
    height: 675,
    element: "#store__map",
  });
});

onBeforeUnmount(async () => {
  if (permission.value) {
    permission.value.onchange = () => null;
  }
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@import "~/../../src/shared/assets/scss/variables.scss";

.map {
  position: relative;

  .title-map {
    top: 0px;
    left: 0px;
    font-weight: 700;
    font-size: 24px;
  }

  .map-image {
    width: 100%;
  }

  area {
    &:hover {
      cursor: pointer;
    }
  }

  .search-gps {
    position: absolute;
    top: 48px;
    left: 0px;
    .el-button {
      width: 200px;
      height: 48px;
      border-radius: 12px;
      padding: 10px;
      background-image: linear-gradient(to bottom right, #15d5ff, #0578ff);
      .text {
        color: white;
        padding: 10px;
      }
    }
  }
}

.modal-dialog {
  :deep(.el-overlay) {
    .el-overlay-dialog {
      padding: 16px;

      .el-dialog {
        width: 650px;

        .body-option {
          padding: 0px 20px 20px 20px;

          .el-radio-group {
            display: flex;
            justify-content: space-around;
            align-items: flex-start;

            .el-radio__input {
              .el-radio__inner {
                width: 18px;
                height: 18px;

                &:after {
                  background-color: #0052d9;
                  height: 9px;
                  width: 9px;
                }
              }
            }
          }
        }

        .city-option {
          padding: 0px 20px 20px 20px;

          .el-radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;

            .el-radio-button {
              .el-radio-button__inner {
                border-left: var(--el-border);
                border-radius: var(--el-border-radius-base);
              }
              .el-radio-button__original-radio:checked
                + .el-radio-button__inner {
                border-left: none;
              }
            }
          }
        }
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .map {
    .title-map {
      font-size: 22px;
    }
    .search-gps {
      top: 44px;
      .el-button {
        width: 110px;
        height: 36px;

        .text {
          display: block;
          width: 76px;
          word-wrap: break-word;
          white-space: break-spaces;
          font-size: 10px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .map {
    .search-gps {
      .el-button {
        width: 160px;
        height: 36px;

        .text {
          display: initial;
          width: initial;
          word-wrap: inherit;
          white-space: inherit;
          font-size: 12px;
        }
      }
    }
  }

  .modal-dialog {
    :deep(.el-overlay) {
      .el-overlay-dialog {
        .el-dialog {
          width: 100%;

          .body-option {
            .el-radio-group {
              justify-content: flex-start;
            }
          }
        }
      }
    }
  }
}
</style>
