<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :limit="1"
    :disabled="isImportFile"
    accept=".csv"
    :auto-upload="false"
    :on-change="changeFile"
    :file-list="data"
  >
    <template #trigger>
      <el-button :loading="isImportFile" type="primary"
        ><IconImport />{{ $t("import_file") }}</el-button
      >
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { i18n } from "~/../../src/shared/plugins/i18n";
import IconImport from "~/../../src/shared/components/icon/Import";
import { ElMessage, UploadProps } from "element-plus";
import { defineProps, toRefs } from "vue";
import { MAX_SIZE_FILE } from "~/../../src/shared/utils/validate";

const { t } = i18n.global;

const CSV_TYPE = ["text/csv"];

interface Prop {
  data: [];
  isImportFile?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  isImportFile: false,
});

toRefs(props);

const emits = defineEmits(["handleChangeFile"]);

const changeFile: UploadProps["onChange"] = (file, fileList) => {
  if (validateFile(file)) {
    emits("handleChangeFile", file, fileList);
    fileList.pop();
  } else {
    fileList.pop();
  }
};

const validateFile = (file) => {
  const isCSV = CSV_TYPE.includes(file.raw.type);
  const isLt5M = file.size / 1024 / 1024 <= MAX_SIZE_FILE;

  if (!isCSV) {
    ElMessage.error(t("errors.type_file_csv"));
    return false;
  }

  if (!isLt5M) {
    ElMessage.error(t("errors.size_file"));
    return false;
  }

  return isCSV && isLt5M;
};
</script>

<style lang="scss" scoped>
@import "~/../../src/shared/assets/scss/variables.scss";

.upload-demo button {
  background-color: $white-color;
  color: $black-15;
}

:deep(.el-upload-list) {
  display: none;
}

:deep(.el-button) {
  border: 1px solid $border-color;
  padding: 9px 22px;
  font-weight: 400;
}
</style>
