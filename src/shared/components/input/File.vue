<template>
  <div class="custom-upload">
    <client-only>
      <el-upload
        class="upload-demo"
        action="#"
        list-type="picture-card"
        accept="image/*"
        :auto-upload="false"
        :on-preview="previewImage"
        :on-remove="removeImage"
        :on-change="changeImage"
        :disabled="disableUpload"
        :file-list="data"
        :limit="limit"
        :class="{
          'hide-upload': hideUploadImage,
          'hide-preview': hidePreview,
          'avatar-default': isAvatar,
        }"
      >
        <div v-if="isAvatar" class="inner-upload">
          <icon-add />
          <div class="el-upload__text">
            {{ $t("front.booking.change_avatar") }}
          </div>
        </div>
        <div v-if="!isAvatar" class="inner-upload">
          <icon-add />
          <div class="el-upload__text">{{ $t("upload") }}</div>
        </div>
      </el-upload>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, toRefs, watch } from "vue";
import type { UploadProps } from "element-plus";
import { messageError } from "~/../../src/shared/utils/notification";
import { ImageUpload } from "~/../../src/shared/models";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { MAX_SIZE_FILE } from "~/../../src/shared/utils/validate";
import IconAdd from "~/../../src/shared/components/icon/Add.vue";
import { IMAGE_TYPE } from "~/../../src/shared/utils/validate";

const { t } = i18n.global;

interface Prop {
  data: ImageUpload[];
  limit: number;
  hidePreview?: boolean;
  isAvatar: boolean;
  background_size?: string;
  height?: string;
  disableUpload?: boolean;
  acceptType?: any;
  errType?: string;
  errSize?: string;
  width?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  data: () => [],
  limit: 5,
  hidePreview: true,
  isAvatar: false,
  height: "105px",
  width: "105px",
  disableUpload: false,
  errType: "errors.type_file",
  errSize: "errors.type_size",
  acceptType: IMAGE_TYPE,
});

const { data, limit, errType, errSize, acceptType } = toRefs(props);
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
  const isLt5M = file.size / 1024 / 1024 <= MAX_SIZE_FILE;
  if (!isLt5M) {
    messageError(t(errSize.value));
  }

  const isIMAGE = acceptType.value.includes(file.raw.type);
  if (!isIMAGE) {
    messageError(t(errType.value));
  }

  return isIMAGE && isLt5M;
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
  :deep(.avatar-default .el-upload--picture-card) {
    border: 1px dashed $green-40;
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
    background-color: $gray-80;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .upload-demo {
    :deep(.el-upload-list--picture-card) {
      --el-upload-list-picture-card-size: v-bind(width);
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

          div {
            color: $black-40;
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
