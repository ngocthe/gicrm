<template>
  <div v-loading="loadingDetail">
    <el-form
      ref="formRef"
      :rules="noticeRules"
      :model="formData"
      class="form-notice"
      require-asterisk-position="right"
    >
      <el-form-item v-if="id" :label="$t('number')">
        <input-text v-model="formData.id" :disabled="true" />
      </el-form-item>
      <el-form-item :label="$t('type')">
        <client-only>
          <el-select v-model="formData.type" :disabled="true">
            <el-option
              v-for="item in noticeOptions"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></el-option>
          </el-select>
        </client-only>
      </el-form-item>
      <el-form-item
        :label="$t('title_keyword')"
        prop="title"
        :error="errorData.title?.[0]"
      >
        <input-text
          v-model="formData.title"
          :placeholder="$t('placeholder.title_notice')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('content')"
        prop="body"
        :error="errorData.body?.[0]"
      >
        <el-input
          v-model="formData.body"
          type="textarea"
          rows="3"
          :placeholder="$t('placeholder.content_notice')"
          :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
        />
      </el-form-item>
      <div>
        <ClientOnly>
          <el-form-item
            :label="$t('start_date')"
            prop="start_date"
            :error="errorData.start_date?.[0]"
          >
            <el-date-picker
              v-model="formData.start_date"
              :editable="false"
              type="datetime"
              :disabled-date="disabledDate"
              format="YYYY年MM月DD日 HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :clearable="false"
              @change="checkValueDate"
            />
          </el-form-item>
        </ClientOnly>
        <ClientOnly>
          <el-form-item
            :label="$t('end_date')"
            prop="due_date"
            :error="errorData.due_date?.[0]"
          >
            <el-date-picker
              v-model="formData.due_date"
              :editable="false"
              type="datetime"
              :disabled-date="disabledDate"
              format="YYYY年MM月DD日 HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :clearable="false"
              @change="checkValueDate"
            />
          </el-form-item>
        </ClientOnly>
      </div>
      <div v-if="id">
        <ClientOnly>
          <el-form-item :label="$t('created_at')">
            <el-date-picker
              v-model="formData.created_at"
              :editable="false"
              type="datetime"
              format="YYYY年MM月DD日 HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :disabled="id"
              :clearable="false"
            />
          </el-form-item>
        </ClientOnly>
        <ClientOnly>
          <el-form-item :label="$t('updated_at')">
            <el-date-picker
              v-model="formData.updated_at"
              :editable="false"
              type="datetime"
              format="YYYY年MM月DD日 HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :disabled="id"
              :clearable="false"
            />
          </el-form-item>
        </ClientOnly>
      </div>

      <client-only>
        <el-form-item
          :label="$t('status')"
          prop="status"
          :error="errorData.status?.[0]"
        >
          <el-select
            v-model="formData.status"
            :placeholder="$t('placeholder.status_notice')"
          >
            <el-option
              v-for="item in typeStatusOptions"
              :key="item.value"
              :value="item.value"
              :label="$t(item.label)"
            ></el-option>
          </el-select>
        </el-form-item>
      </client-only>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount } from "vue";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import { MAX_LENGTH_DEFAULT_TEXTAREA } from "~/../../src/shared/utils/validate";
import noticeRules from "../../validates/notice";
import { noticeOptions, TYPE } from "~/../../src/shared/constants/notices";
import { typeStatusOptions } from "~/../../src/shared/constants";
import moment from "moment";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { Notice } from "~/../../src/shared/types/notice";
import NoticesRequest from "~/../../src/shared/requests/NoticeRequest";
import {
  createSuccess,
  createError,
  updateSuccess,
  updateError,
  deleteSuccess,
} from "~/../../src/shared/utils/notification";

interface Prop {
  id?: number;
}

const noticeData = ref<Notice>(null);
const props = defineProps<Prop>();
const { id } = toRefs(props);
const router = useRouter();
const formRef = ref(null);
const errorData = ref({});
const loadingDetail = ref(false);
const isLoadingAction = ref(false);
const formData = reactive({
  id: null,
  title: null,
  type: TYPE.NOTICES,
  body: null,
  status: null,
  created_at: null,
  start_date: null,
  due_date: null,
  updated_at: null,
});

const disabledDate = (time: Date) => {
  return moment(time) < moment().subtract(1, "days");
};

const checkValueDate = () => {
  if (formData.start_date > formData.due_date) {
    return (formData.due_date = formData.start_date);
  }
};

const createNotices = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        await NoticesRequest.post(formData);
        createSuccess();
        await router.push("/notices");
      } catch (error) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        createError();
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

const detailNotices = async () => {
  try {
    loadingDetail.value = true;
    noticeData.value = (await NoticesRequest.show(id.value)).data as Notice;

    formData.id = noticeData.value.id;
    formData.title = noticeData.value.title;
    formData.type = noticeData.value.type;
    formData.body = noticeData.value.body;
    formData.status = noticeData.value.status;
    formData.created_at = noticeData.value.created_at;
    formData.updated_at = noticeData.value.updated_at;
    formData.due_date = noticeData.value.due_date;
    formData.start_date = noticeData.value.start_date;
  } catch (e) {
    return e;
  } finally {
    loadingDetail.value = false;
  }
};

const editNotices = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        await NoticesRequest.put(id.value, formData);
        updateSuccess();
        await router.push("/notices");
      } catch (error) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        updateError();
      } finally {
        loadingDetail.value = false;
      }
    }
  });
};

const deleteNotice = async (id) => {
  try {
    await NoticesRequest.delete(id);
    deleteSuccess();
    await router.push("/notices");
  } catch (e) {
    deleteSuccess();
    return e;
  }
};

defineExpose({
  editNotices,
  createNotices,
  deleteNotice,
  formRef,
  isLoadingAction,
});

onBeforeMount(() => {
  if (id.value) {
    detailNotices();
  } else {
    formData.start_date = moment().format("YYYY-MM-DD HH:mm:ss");
    formData.due_date = moment().format("YYYY-MM-DD HH:mm:ss");
  }
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-notice) {
  width: 780px;

  .el-form-item {
    .el-form-item__label {
      width: 200px;
      justify-content: flex-start;
    }

    .el-form-item__content {
      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }

      .el-input {
        width: 100%;
      }

      .el-textarea {
        min-height: 80px;

        .el-textarea__inner {
          min-height: 80px !important;
        }
      }
    }
  }
}
:deep(.el-date-editor.el-input) {
  --el-date-editor-width: 100%;
  height: 40px;
  .el-input__wrapper {
    flex-direction: row-reverse;
    padding-right: 0;
  }
}
</style>
