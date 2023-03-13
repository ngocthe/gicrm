<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :before-close="handleClose"
        :show-close="false"
        :close-on-click-modal="false"
        align-center
      >
        <template #header>
          <div>{{ title }}</div>
          <div v-if="headerName">{{ headerName }}</div>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <button-gray
              :name="nameCancel"
              :disabled="loading"
              @click="handleClose"
            />
            <button-blue
              :name="nameConfirm"
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
import ButtonGray from "../../../shared/components/button/ButtonGray";
import ButtonBlue from "../../../shared/components/button/ButtonBlue";

interface Prop {
  dialogVisible: boolean;
  title: string;
  nameCancel?: string;
  nameConfirm?: string;
  width?: string;
  loading?: boolean;
  headerName?: string;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  nameCancel: "",
  nameConfirm: "",
  headerName: "",
  width: "30%",
  loading: false,
});
const { dialogVisible, title, nameConfirm, nameCancel, width, loading } =
  toRefs(props);
const emits = defineEmits(["handleClose", "handleConfirm"]);
const handleClose = () => {
  emits("handleClose");
};

const handleConfirm = () => {
  emits("handleConfirm");
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  :deep(.el-overlay) {
    z-index: 2051 !important;
  }

  :deep(.el-dialog) {
    .el-dialog__header {
      font-weight: 400;
    }

    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
