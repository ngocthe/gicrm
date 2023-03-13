<template>
  <div class="custom-upload">
    <client-only>
      <el-upload
        class="upload-demo"
        action="#"
        drag
        list-type="picture-card"
        accept="image/*"
        :auto-upload="false"
        :on-preview="previewImage"
        :on-remove="removeImage"
        :on-change="changeImage"
        :file-list="data"
        :limit="limit"
        :class="{
          'hide-upload': hideUploadImage,
          'hide-preview': hidePreview,
          'avatar-default': isAvatar,
        }"
      >
        <div class="inner-upload">
          <div class="upload-text">
            {{ $t("drop-and-upload") }}
          </div>
          <el-button class="change-file">{{
            $t("button.change-file")
          }}</el-button>
        </div>
      </el-upload>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, toRefs, watch } from "vue";
import type { UploadProps } from "element-plus";
import { ImageUpload } from "~/../../src/shared/models";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  MAX_SIZE_FILE,
  MIN_SIZE_FILE,
} from "~/../../src/shared/utils/validate";
import { messageError } from "~/../../src/shared/utils/notification";
import { IMAGE_TYPE } from "~/../../src/shared/utils/validate";

const { t } = i18n.global;

interface Prop {
  data: ImageUpload[];
  limit: number;
  hidePreview?: boolean;
  isAvatar: boolean;
  background_size?: string;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  data: () => [],
  limit: 5,
  hidePreview: true,
  isAvatar: false,
  height: "105px",
  width: "105px",
});

const { data, limit } = toRefs(props);
const hideUploadImage = ref(true);
hideUploadImage.value = data.value.length >= limit.value;

const emits = defineEmits([
  "handleChangeImage",
  "handleRemoveImage",
  "preview",
]);

const changeImage: UploadProps["onChange"] = (file, fileList) => {
  if (validateImage(file)) {
    emits("handleChangeImage", file, fileList);
    if (data.value.length >= limit.value) {
      hideUploadImage.value = true;
    }
  } else {
    fileList.pop();
  }
};

const removeImage: UploadProps["onRemove"] = (file, fileList) => {
  hideUploadImage.value = false;
  emits("handleRemoveImage", file, fileList);
};

const previewImage: UploadProps["onPreview"] = (file) => {
  emits("preview", file);
};

const validateImage = (file) => {
  const isIMAGE = IMAGE_TYPE.includes(file.raw.type);
  const isLt5M = file.size / 1024 / 1024 <= MAX_SIZE_FILE;
  const isMt150KB = file.size / 1024 / 1024 >= MIN_SIZE_FILE;
  if (!isIMAGE) {
    messageError(t("errors.type_file"));
  }
  if (!isLt5M) {
    messageError(t("errors.size_file"));
  }
  if (!isMt150KB) {
    messageError(t("errors.size_file_small"));
  }
  return isIMAGE && isLt5M && isMt150KB;
};

watch(
  data,
  (value) => {
    hideUploadImage.value = value.length >= limit.value;
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="scss">
@import "../../../shared/assets/scss/variables";

.custom-upload {
  margin-bottom: -5px;

  :deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
    object-fit: cover;
  }

  :deep(.avatar-default .el-upload--picture-card) {
    border: 1px dashed $black-30;
  }

  :deep(.el-upload-dragger) {
    height: 100%;
    border: none;

    .inner-upload {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  :deep(.el-upload) {
    width: v-bind(width);
    height: v-bind(height);
    border: 1px dashed $green-40;
    border-radius: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .upload-demo {
    :deep(.el-upload-list--picture-card) {
      --el-upload-list-picture-card-size: v-bind(width);

      .el-upload-list__item {
        height: v-bind(height);

        &-thumb {
          object-fit: cover;
        }
      }
    }

    :deep(.el-upload-list) {
      .el-upload-list__item {
        .el-upload-list__item-status-label {
          display: none;
        }
      }

      .el-upload {
        .inner-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;

          .upload-text {
            color: $black-30;
            width: 280px;
            text-align: center;
            line-height: 22px;
          }

          .change-file {
            height: 40px;
            font-size: 14px;
            font-weight: 500;
            background-color: $bg-change;
            color: $white-color;
          }
        }
      }
    }
  }

  .hide-preview {
    :deep(.el-upload-list__item-preview) {
      display: none;
    }

    :deep(.el-upload-list__item-delete) {
      margin-left: 0;
    }
  }
}

:deep(.el-upload__text) {
  font-weight: 500;
  line-height: 22px;
  color: $black-110 !important;
}

:deep(.hide-upload) {
  .el-upload {
    display: none;
  }
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  border-radius: 0 !important;
}
</style>
