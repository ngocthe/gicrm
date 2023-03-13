<template>
  <div v-if="isTitle" class="title-notice">
    <span>{{ shopName }}</span>
    <span>{{ $t("template_notice.to_the_store") }}</span>
    <span
      class="booking-number"
      @click="
        $router.push({
          name: 'reservation-detail-id',
          params: { id: idBooking },
        })
      "
      >{{ bookingNumber }}</span
    >
    <span>{{ $t("template_notice.tentative_reservation_canceled") }}</span>
  </div>
  <div v-else class="body-notice">
    <p>{{ userName }}{{ $t("template_notice.looks") }}</p>
    <br />
    <p>
      {{ $t("template_notice.everytime") }}{{ shopName
      }}{{ $t("template_notice.thank_you_for_using") }}
    </p>
    <p>{{ $t("template_notice.canceled_by_store") }}</p>
    <p></p>
    <br />
    <p>{{ $t("template_notice.store") }}：{{ shopName }}</p>
    <p>
      {{ $t("template_notice.date_and_time") }}：{{
        formatDate(bookingDateTime, "YYYY年MM月DD日 HH:mm")
      }}
    </p>
    <p v-if="bookingContent">{{ $t("course") }}：{{ bookingContent }}</p>
    <div v-if="typeCategory === SALON">
      <MenuSalon
        :list-menu="listMenu"
        :staff-name="staffName"
        :request-staff="requestStaff"
      />
    </div>
    <p v-if="typeCategory !== SALON">
      {{ $t("number_of_people") }}：{{ numberPeople }}（{{
        $t("reservations_for_multiple")
      }}）
    </p>
    <br />
    <p>
      {{ $t("template_notice.from_now_on") }}{{ shopName
      }}{{ $t("template_notice.thank_you_support") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { formatDate } from "~/../../src/shared/utils/format";
import { SALON } from "~/../../src/shared/constants/category";
import MenuSalon from "~/../../src/shared/components/template/notice/MenuSalon.vue";

const { t } = i18n.global;
interface Prop {
  bookingNumber?: string;
  idBooking?: number;
  isTitle?: boolean;
  userName?: string;
  siteName?: string;
  shopName?: string;
  bookingDateTime?: string;
  bookingContent?: string;
  numberPeople?: number;
  typeCategory?: number;
  staffName?: string;
  listMenu?: [];
  requestStaff?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  bookingNumber: "",
  idBooking: null,
  isTitle: false,
  userName: "",
  siteName: "",
  shopName: "",
  bookingDateTime: "",
  bookingContent: "",
  cancelFee: null,
  shopBookingUrl: "",
  numberPeople: 0,
  typeCategory: null,
  staffName: null,
  listMenu: null,
  requestStaff: 0,
});

toRefs(props);
</script>
