<template>
  <div v-loading="isLoadingData">
    <el-form
      ref="formRef"
      :rules="categoryRules"
      :model="formCategory"
      class="form-category"
    >
      <el-form-item
        v-if="checkTypeStore(dataCheck, store?.model_has_type?.type_id)"
        :label="$t('store.category_title')"
        :error="errorData.parent_id?.[0]"
        prop="parent_id"
      >
        <client-only>
          <el-select
            v-model="formCategory.parent_id"
            :placeholder="$t('placeholder.category')"
          >
            <el-option
              v-for="item in dataCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </client-only>
      </el-form-item>
      <el-form-item :label="$t('store.item_name')" prop="name">
        <input-text
          v-model="formCategory.name"
          :error="errorData.name?.[0]"
          :maxlength="MAX_LENGTH_CATEGORY_NAME"
          :placeholder="$t('placeholder.item_name')"
        />
      </el-form-item>
      <el-form-item :label="$t('description')" prop="description">
        <input-text
          v-model="formCategory.description"
          type="textarea"
          :placeholder="$t('placeholder.enter_explain')"
          :maxlength="MAX_LENGTH_CATEGORY_DESCRIPTION"
        />
      </el-form-item>
      <el-form-item :label="$t('status')">
        <el-checkbox
          v-model="formCategory.status"
          :label="$t('display')"
          size="large"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>

      <el-form-item v-if="id" :label="$t('created_at')">
        <el-input
          :suffix-icon="IconDate"
          disabled
          :model-value="
            formatDate(formCategory.created_at, 'YYYY年MM月DD日 HH:mm')
          "
        />
      </el-form-item>
      <el-form-item v-if="id" :label="$t('updated_at')">
        <el-input
          :suffix-icon="IconDate"
          disabled
          :model-value="
            formatDate(formCategory.updated_at, 'YYYY年MM月DD日 HH:mm')
          "
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted } from "vue";
import { useRouter } from "nuxt/app";
import type { FormInstance } from "element-plus";
import categoryRules from "../../validates/category";
import dataCategoryFilter from "../../../shared/constants/category";
import {
  MAX_LENGTH_CATEGORY_NAME,
  MAX_LENGTH_CATEGORY_DESCRIPTION,
} from "../../../shared/utils/validate";
import CategoryRequest from "../../../shared/requests/CategoryRequest";
import categoryRequest from "../../../shared/requests/CategoryRequest";
import InputText from "../../../shared/components/input/InputText";
import IconDate from "~/../../src/store/components/Icon/IconDate.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { useMeStore } from "../../../shared/stores/me";
import { Category } from "../../models";
import { ACTIVE } from "~/../../src/shared/constants";
import {
  updateSuccess,
  updateError,
  createError,
  createSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { SALON, RESTAURANT } from "../../../shared/constants/category";
import { checkTypeStore } from "~/../../src/shared/constants/typeStore";

interface Prop {
  id?: number;
}

const props = defineProps<Prop>();
const { id } = toRefs(props);
const emits = defineEmits(["changeLoadingData"]);

const storeUser = useMeStore();
const store = storeUser.info?.store;
const router = useRouter();
const formRef = ref(null);
const dataCategory = ref([]);
const errorData = ref({});
const isLoadingData = ref(false);
const dataCheck = ref([RESTAURANT]);

const formCategory = reactive({
  name: "",
  description: "",
  parent_id: null,
  status: ACTIVE,
  created_at: "",
  updated_at: "",
});

const createCategory = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        emits("changeLoadingData", true);
        await CategoryRequest.post(formCategory);
        createSuccess();
        await router.push("/store/category");
      } catch (error: any) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        createError();
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

//TODO id
const detailCategory = async () => {
  try {
    isLoadingData.value = true;
    const data = (await CategoryRequest.show(id.value)).data as Category;
    formCategory.created_at = data.created_at;
    formCategory.updated_at = data.updated_at;
    formCategory.status = data.status;
    formCategory.parent_id = data.parent_id;
    formCategory.description = data.description;
    formCategory.name = data.name;
  } catch (_) {
    await router.push({ name: "store-category" });
  } finally {
    isLoadingData.value = false;
  }
};

const getDataCategory = () => {
  dataCategory.value =
    dataCategoryFilter.OPTION_FILTER_CATEGORY[store.model_has_type?.type_id];
};

const editCategory = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        emits("changeLoadingData", true);
        await categoryRequest.put(id.value, formCategory);
        updateSuccess();
        router.push("/store/category");
      } catch (error: any) {
        errorData.value = {};
        errorData.value = error?.data?.errors;
        if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          messageError("errors.cant_be_performed");
          await router.push({ name: "store-category" });
        } else {
          updateError();
        }
      } finally {
        emits("changeLoadingData", false);
      }
    }
  });
};

defineExpose({
  editCategory,
  createCategory,
  formRef,
});

onMounted(() => {
  getDataCategory();
});

onBeforeMount(() => {
  if (id.value) {
    detailCategory();
  }
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss" as *;

:deep(.form-category) {
  width: 780px;

  .el-form-item {
    .el-form-item__label {
      width: 200px;
      justify-content: flex-start;
    }

    .el-form-item__content {
      .el-input,
      .el-textarea {
        width: 100%;
      }

      .el-select {
        width: 100%;

        .el-input {
          height: 40px;
        }
      }

      .date-picker {
        width: 100%;

        .el-input {
          width: 100%;
        }
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
</style>
