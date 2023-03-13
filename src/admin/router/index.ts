import IconDashboard from "~/../../src/admin/components/Icon/Dashboard.vue";
import IconUserSetting from "~/../../src/admin/components/Icon/UserSetting.vue";
import IconStore from "~/../../src/admin/components/Icon/Store.vue";
import IconReservation from "~/../../src/admin/components/Icon/Reservation.vue";
import IconSale from "~/../../src/admin/components/Icon/Sale.vue";
import IconPayment from "~/../../src/admin/components/Icon/Payment.vue";
import IconNotificationSidebar from "~/../../src/admin/components/Icon/NotificationSidebar.vue";
import IconMessageSidebar from "~/../../src/admin/components/Icon/MessageSidebar.vue";
import IconRanking from "~/../../src/admin/components/Icon/Ranking.vue";
import IconReview from "~/../../src/admin/components/Icon/Review.vue";
import IconAdsSidebar from "~/../../src/admin/components/Icon/AdsSidebar.vue";
import IconPlan from "~/../../src/admin/components/Icon/Plan.vue";
import IconRecommended from "~/../../src/admin/components/Icon/Recommended.vue";
import IconAdsSettings from "~/../../src/admin/components/Icon/AdsSettings.vue";

import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;
export const adminRouters = [
  {
    name: "index",
    icon: IconDashboard,
    title: t("dashboard"),
  },
  {
    name: "customer",
    icon: IconUserSetting,
    title: t("admin.user_management"),
    children: [
      {
        name: "customer-edit-id",
        title: t("admin.user_management"),
        hidden: true,
      },
    ],
  },
  {
    name: "stores",
    icon: IconStore,
    title: t("admin.store_management"),
    children: [
      {
        name: "stores-create",
        title: t("title_screen.store_create"),
        hidden: true,
      },
      {
        name: "stores-edit-id",
        title: t("title_screen.store_detail"),
        hidden: true,
      },
    ],
  },
  {
    name: "reservations",
    icon: IconReservation,
    title: t("admin.reservation_management"),
    children: [
      {
        name: "reservations-detail-id",
        title: t("title_screen.booking_details"),
        hidden: true,
      },
    ],
  },
  {
    name: "revenues",
    icon: IconSale,
    title: t("admin.sales_management"),
    children: [
      {
        name: "revenues-detail-id",
        title: t("title_screen.details_revenue"),
        hidden: true,
      },
    ],
  },
  {
    name: "plans",
    icon: IconPlan,
    title: t("title_screen.list_plan"),
    children: [
      {
        name: "plans-edit-id",
        title: t("title_screen.detail_plan"),
        hidden: true,
      },
    ],
  },
  {
    name: "invoices",
    icon: IconPayment,
    title: t("admin.payment_management"),
    children: [
      {
        name: "invoices-detail-id",
        title: t("title_screen.payment_detail"),
        hidden: true,
      },
    ],
  },
  {
    name: "profile",
    hidden: true,
    title: t("title_screen.profile"),
  },
  {
    name: "change-password",
    hidden: true,
    title: t("title_screen.change_password"),
  },
  {
    name: "notices",
    icon: IconNotificationSidebar,
    title: t("title_screen.notice_management"),
    children: [
      {
        name: "notices-create",
        title: t("title_screen.notice_create"),
        hidden: true,
      },
      {
        name: "notices-edit-id",
        title: t("title_screen.notice_detail"),
        hidden: true,
      },
    ],
  },
  {
    name: "messages",
    icon: IconMessageSidebar,
    title: t("admin.send_message"),
    children: [
      {
        name: "messages-create",
        title: t("title_screen.create_message"),
        hidden: true,
      },
      {
        name: "messages-detail-id",
        title: t("title_screen.message_detail"),
        hidden: true,
      },
    ],
  },
  {
    name: "ranking",
    icon: IconRanking,
    title: t("admin.ranking_list"),
    children: [
      {
        name: "ranking-detail-id",
        title: t("title_screen.ranking_list"),
        hidden: true,
      },
    ],
  },
  {
    name: "reviews",
    icon: IconReview,
    title: t("title_screen.review_store"),
  },
  {
    name: "banner-ads",
    icon: IconAdsSidebar,
    title: t("admin.banner-ads"),
    children: [
      {
        name: "banner-ads-create",
        title: t("title_screen.banner_ads_create"),
        hidden: true,
      },
      {
        name: "banner-ads-edit-id",
        title: t("title_screen.banner_ads_detail"),
        hidden: true,
      },
    ],
  },
  {
    name: "store-recommended",
    icon: IconRecommended,
    title: t("admin.recommended_store"),
  },
  {
    name: "ads-settings",
    icon: IconAdsSettings,
    title: t("title_screen.ads_settings"),
  },
];
