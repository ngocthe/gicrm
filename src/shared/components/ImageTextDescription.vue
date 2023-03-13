<template>
  <div class="image-description">
    <div>
      <span>{{ $t("store.image_description_first") }}</span>
      <span>{{ priceDisplay(maxImage) }}</span>
      <span>{{ $t("store.image_description_first_after") }}</span>
    </div>
    <div>{{ $t("store.image_description_second") }}</div>
    <div>
      <span>{{ $t("store.image_description_third") }}</span>
      <span class="text-link" @click="$router.push({ name: 'plan' })"
        >{{ $t("here") }}
      </span>
      <span>{{ $t("store.is") }}</span>
    </div>
  </div>
  <ModalImageConfirm
    :dialog-visible="dialogVisible"
    @handle-close="dialogVisible = false"
  />
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import ModalImageConfirm from "~/../../src/shared/components/modal/ImageConfirm.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { maxImagePlanType } from "~/../../src/shared/constants";
import priceDisplay from "~/../../src/shared/utils/price";

interface Prop {
  typeImage?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  typeImage: maxImagePlanType.GALLERY,
});
const { typeImage } = toRefs(props);
const dialogVisible = ref(false);
const meStore = useMeStore();
const maxImage =
  typeImage.value === maxImagePlanType.GALLERY
    ? meStore.getMaxImageByPlan
    : meStore.getMaxImageByPlanStoreTop;

const showDialog = () => {
  dialogVisible.value = true;
};
</script>
<style lang="scss" scoped>
.image-description {
  width: 100%;
  line-height: 20px;

  .text-link {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
