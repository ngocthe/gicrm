<template>
  <ListScreenComponent v-loading="loading">
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.details_revenue") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.details_revenue") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <RevenueCancel
        v-if="data && data.type === REVENUE.CANCELLATION"
        :data="data"
      />
      <RevenueOnline v-if="data && data.type === REVENUE.ONLINE" :data="data" />
      <RevenueSubscription
        v-if="data && data.type === REVENUE.SUBSCRIPTION"
        :data="data"
      />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            class="btn-delete"
            :name="$t('button.back')"
            @click="handleBack"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ReportRevenueRequest from "~/../../src/shared/requests/ReportRevenueRequest";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import { useRoute, useRouter } from "#imports";
import { ref, onMounted } from "vue";
import { DetailReportRevenue } from "~/../../src/admin/models";
import RevenueCancel from "../../../components/form/Cancellation.vue";
import RevenueOnline from "../../../components/form/Online.vue";
import RevenueSubscription from "../../../components/form/Subscription.vue";
import { REVENUE } from "~/../../src/shared/constants/sale";

const route = useRoute();
const router = useRouter();
const data = ref<DetailReportRevenue>();
const loading = ref(false);

const detailReportRevenue = async () => {
  try {
    loading.value = true;
    data.value = (await ReportRevenueRequest.show(+route.params.id))
      .data as DetailReportRevenue;
  } catch (_) {
    router.push({ name: "revenues" });
  } finally {
    loading.value = false;
  }
};

const handleBack = () => {
  router.push({ name: "revenues" });
};

onMounted(() => {
  detailReportRevenue();
});
</script>

<style lang="scss" scoped>
@use "../src/front/assets/scss/variables" as *;

.btn-delete {
  background-color: $white-color;
  width: 68px;

  &:hover,
  :focus {
    border-color: $gray-100 !important;
    background-color: $gray-100;
    color: $black-80;
  }
}

.btn-save {
  width: 68px;
}
</style>
