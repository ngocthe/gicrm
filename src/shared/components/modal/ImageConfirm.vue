<template>
  <div class="modal-dialog">
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :width="width"
        :before-close="handleClose"
        :title="$t('in_develop')"
        :show-close="true"
      >
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  loading?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "30%",
});
const { dialogVisible, width } = toRefs(props);
const emits = defineEmits(["handleClose"]);
const handleClose = () => {
  emits("handleClose");
};
</script>

<style lang="scss" scoped>
.modal-dialog {
  :deep(.el-dialog) {
    .el-dialog__header {
      font-weight: 400;
      padding: 20px;
    }

    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
