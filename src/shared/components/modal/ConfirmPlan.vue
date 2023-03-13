<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :before-close="handleClose"
        :title="$t('upgrade')"
        align-center
        :show-close="showClose"
      >
        <template #header>
          <div class="header-confirm">{{ $t("upgrade") }}</div>
        </template>
        <template #footer>
          <div class="text-left font-weight-700 text-upgrade">
            {{ $t("title_upgrade_plan") }}
          </div>
          <div class="title-plan">
            <IconQuestion />
            <div class="text-left">{{ $t("plan_information_details") }}</div>
          </div>
          <span class="dialog-footer">
            <button-white
              :name="$t('button.cancel')"
              :disabled="loading"
              @click="handleClose"
            />
            <button-blue
              width="170px"
              :name="$t('button.to_upgrade')"
              :loading="loading"
              @click="handleConfirm"
            />
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import ButtonBlue from "../../../shared/components/button/ButtonBlue";
import IconQuestion from "../../../shared/components/icon/Question.vue";
import ButtonWhite from "../../../shared/components/button/ButtonWhite.vue";
interface Prop {
  dialogVisible: boolean;
  width?: string;
  loading?: boolean;
  showClose?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "480px",
  showClose: true,
});
const { dialogVisible, width } = toRefs(props);
const emits = defineEmits(["handleClose", "handleConfirm"]);

const handleClose = () => {
  emits("handleClose");
};

const handleConfirm = () => {
  emits("handleConfirm");
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__header {
    font-weight: 400;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.text-upgrade {
  font-weight: 700;
  text-align: left;
}

.header-confirm {
  font-size: 18px;
}

.title-plan {
  display: flex;
  margin-top: 20px;
  margin-bottom: 35px;
  gap: 10px;
  font-size: 16px;
  align-items: center;
}
</style>
