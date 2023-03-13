<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="$t('detail')"
    width="680px"
    align-center
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <div class="box-review">
      <el-scrollbar max-height="680px">
        <div class="review-item align-items-center">
          <div class="label">{{ $t("store_name") }}</div>
          <div class="content">{{ dataReview.store?.name }}</div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("contributor") }}</div>
          <div class="content">{{ dataReview.customer?.fullname }}</div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("posted_date") }}</div>
          <div class="content">
            {{ formatDate(dataReview.created_at, "YYYY年MM月DD日 HH:mm:ss") }}
          </div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("evaluation_score") }}</div>
          <div class="content d-flex align-items-center">
            <EvaluateStartComponent :model-value="dataReview.star" />
          </div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("nick_name") }}</div>
          <div class="content">{{ dataReview.nickname }}</div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("gender") }}</div>
          <div class="content">
            {{
              findObj(genderOptions, "value", dataReview.gender)
                ? $t(findObj(genderOptions, "value", dataReview.gender).label)
                : ""
            }}
          </div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("era") }}</div>
          <div class="content">
            {{
              findObj(ageOptions, "value", dataReview.age)
                ? $t(findObj(ageOptions, "value", dataReview.age).label)
                : ""
            }}
          </div>
        </div>
        <div class="review-item align-items-center">
          <div class="label">{{ $t("title_keyword") }}</div>
          <div class="content">{{ dataReview.title }}</div>
        </div>
        <div class="review-item">
          <div class="label">{{ $t("content") }}</div>
          <div class="content">{{ dataReview.content }}</div>
        </div>
        <div v-if="dataReview.reply?.content" class="review-item">
          <div class="label">{{ $t("reply") }}</div>
          <div class="content">{{ dataReview.reply?.content }}</div>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <button-white :name="$t('button.cancel')" @click="handleClose" />
        <ButtonDelete
          :name="$t('button.delete')"
          class="btn-delete"
          :icon="IconDelete"
          @click="deleteReviewStore"
        />
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import EvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import IconDelete from "../Icon/Delete.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { ReviewStore } from "~/../../src/admin/models/reviewStore";
import { formatDate } from "~/../../src/shared/utils";
import { genderOptions, ageOptions } from "~/../../src/shared/constants/user";
import { findObj } from "~/../../src/shared/utils";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  dataReview: ReviewStore;
  loading?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "30%",
  loading: false,
});

const { t } = i18n.global;
const { dialogVisible, dataReview } = toRefs(props);
const emits = defineEmits(["handleCloseView", "showModalDelete"]);
const handleClose = () => {
  emits("handleCloseView");
};

const deleteReviewStore = () => {
  emits("showModalDelete", dataReview.value.id);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.box-review {
  color: $black-80;

  .review-item {
    display: flex;
    margin-bottom: 18px;
    margin-right: 15px;
  }

  .label {
    flex-basis: 200px;
    font-size: 14px;
    line-height: 22px;
  }

  .content {
    line-height: 22px;
    flex: 1;
    white-space: pre-wrap;

    :deep(.el-rate--large) {
      height: 16px;
    }

    .rate-star {
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
      color: $color-rating;
      margin-top: 2px;
      margin-left: 6px;
    }
  }
}

.btn-delete {
  :deep(.el-icon) {
    height: 15px;
    width: 15px;
  }
}
</style>
