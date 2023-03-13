<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.notice_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.notice_detail") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormNotice :id="id" ref="_formRef" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            :name="$t('button.delete')"
            :loading="loadingDelete"
            @click="showModalDelete"
          />
          <ButtonCreateOrUpdate
            :loading="_formRef?.isLoadingAction"
            @click="editNotice"
          />
        </div>
      </div>
      <ModalConfirm
        :dialog-visible="modalDelete"
        :title="$t('title_delete')"
        :name-cancel="$t('button.cancel')"
        :name-confirm="$t('button.confirm')"
        :loading="loadingDelete"
        @handle-close="handleClose"
        @handle-confirm="deleteNotice"
      />
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "nuxt/app";
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";

definePageMeta({
  name: "notices-edit-id",
  title: "title_screen.notice_detail",
});

const route = useRoute();

const loadingDelete = ref(false);
const modalDelete = ref(false);
const _formRef = ref();
const id = ref(null);
id.value = Number(route.params.id);

const editNotice = async () => {
  await _formRef.value.editNotices(_formRef.value.formRef);
};

const handleClose = () => {
  modalDelete.value = false;
};

const showModalDelete = () => {
  modalDelete.value = true;
};

const deleteNotice = async () => {
  try {
    loadingDelete.value = true;
    await _formRef.value.deleteNotice(id.value);
  } catch (e) {
    return e;
  }
};
</script>
