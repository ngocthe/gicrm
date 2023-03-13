<template>
  <el-dialog
    :model-value="dialog"
    :title="$t('store.confirm_cancel')"
    width="600px"
    :append-to-body="true"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleBack"
    class="dialog-cancel-booking"
    :destroy-on-close="true"
  >
    <el-form
      ref="_formRef"
      :model="formData"
      :rules="cancelBookingRules"
      :inline-message="true"
    >
      <el-form-item prop="reason" :error="errorForm['reason']?.[0]">
        <el-input
          v-model="formData.reason"
          :placeholder="$t('placeholder.enter_reason')"
          :maxlength="MAX_LENGTH_REASON"
          clearable
          @input="handleInputReason"
        />
      </el-form-item>
      <el-form-item :error="errorForm['reason']?.[0]">
        <el-input
          v-model="formData.memo"
          v-input-trim
          type="textarea"
          :rows="3"
          :placeholder="$t('placeholder.enter_memo')"
          :maxlength="MAX_LENGTH_TEXTAREA"
          @input="handleInputMemo"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <ButtonDefault
          :name="$t('button.back')"
          :disabled="isLoadingConfirm || isLoadingCancelAsUser"
          @click="handleBack"
        />
        <ButtonGray
          v-if="isUserCreate"
          :name="$t('button.cancel_as_user')"
          width="138px"
          :disabled="isLoadingConfirm"
          :loading="isLoadingCancelAsUser"
          @click="handleCancelAsUser(_formRef)"
        />
        <ButtonLightBlue
          :loading="isLoadingConfirm"
          :disabled="isLoadingCancelAsUser"
          :name="$t('store.cancel_reservation')"
          @click="handleCancelReservation(_formRef)"
        />
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import ButtonDefault from "~/../../src/shared/components/button/ButtonDefault.vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";
import {
  MAX_LENGTH_REASON,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import { cancelBookingRules } from "~/../../src/store/validates/booking";
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";

interface Prop {
  dialog: boolean;
  reason: string;
  memo: string;
  isLoadingConfirm?: boolean;
  isLoadingCancelAsUser?: boolean;
  errorForm?: object;
  isUserCreate?: boolean;
}

withDefaults(defineProps<Prop>(), {
  isLoadingConfirm: false,
  isLoadingCancelAsUser: false,
  errorForm: null,
  isUserCreate: false,
});

const emits = defineEmits([
  "close",
  "confirm",
  "update:reason",
  "update:memo",
  "update:dialog",
  "cancelAsUser",
]);

const _formRef = ref<FormInstance>();
const formData = reactive({
  reason: "",
  memo: "",
});

const handleBack = () => {
  emits("close");
  emits("update:dialog", false);
};

const handleCancelAsUser = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      emits("cancelAsUser");
    }
  });
};
const handleCancelReservation = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      emits("confirm");
    }
  });
};

const handleInputReason = (e) => {
  emits("update:reason", e);
};

const handleInputMemo = (e) => {
  emits("update:memo", e);
};
</script>
<style lang="scss">
.dialog-cancel-booking {
  .el-input {
    height: 40px;
  }
}
</style>
