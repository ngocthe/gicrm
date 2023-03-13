<template>
  <div class="external-ads">
    <div class="external-ads__side left-side">
      <template v-for="(ads, index) in leftAds" :key="index">
        <div ref="refLeftAds" class="ads">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="ads.data"></div>
          <div class="btn-close" @click="() => handleCloseLeftAds(index)">
            <el-icon><CircleCloseFilled /></el-icon>
          </div>
        </div>
      </template>
    </div>
    <div class="external-ads__side right-side">
      <template v-for="(ads, index) in rightAds" :key="index">
        <div ref="refRightAds" class="ads">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="ads.data"></div>
          <div class="btn-close" @click="() => handleCloseRightAds(index)">
            <el-icon>
              <CircleCloseFilled />
            </el-icon>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { useCookie } from "#app";

import { persistKeys } from "../../../shared/constants/persist-key";
import GuestAdSenseRequest from "../../../shared/requests/GuestAdSenseRequest";
import { IAds } from "../../models/ads";
import { CircleCloseFilled } from "@element-plus/icons-vue";

const dataAds = ref<IAds[]>([]);
const leftAds = ref<IAds[]>([]);
const rightAds = ref<IAds[]>([]);

const refLeftAds = ref<HTMLElement[]>([]);
const refRightAds = ref<HTMLElement[]>([]);

const props = defineProps<{ storeId?: number | null }>();

const typeStore = ref<number>(Number(useCookie(persistKeys.MENU).value));

const getAds = async () => {
  dataAds.value = await GuestAdSenseRequest.getAdsStore(
    props.storeId,
    typeStore.value
  );
  const shuffledAds = dataAds.value.sort(() => 0.5 - Math.random());
  leftAds.value = shuffledAds.slice(0, 5);
  rightAds.value = shuffledAds.slice(5, 10);
};

const handleCloseLeftAds = (index: number) => {
  if (refLeftAds.value && refLeftAds.value.length > 0) {
    refLeftAds.value[index].style.display = "none";
  }
};

const handleCloseRightAds = (index: number) => {
  if (refRightAds.value && refRightAds.value.length > 0) {
    refRightAds.value[index].style.display = "none";
  }
};

onBeforeMount(async () => {
  await getAds();
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.external-ads {
  .external-ads__side {
    position: fixed;
    z-index: 2025;
    top: 0vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .ads {
      position: relative;

      .btn-close {
        position: absolute;
        top: -7px;
        right: -2px;
        width: 10px;
        height: 10px;
        cursor: pointer;
      }
    }
  }
  .left-side {
    left: 0px;
  }

  .right-side {
    right: 0px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .external-ads {
    .right-side {
      display: none;
    }
  }
}
</style>
