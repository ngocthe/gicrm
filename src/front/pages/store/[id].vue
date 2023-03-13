<template>
  <div v-loading="loading" class="detail-store-list">
    <Head>
      <Title> {{ $t("site_name_title") }}{{ $t("front.list_store") }} </Title>
    </Head>
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum
            v-if="device === 'desktop'"
            :data-title="dataTitle"
            class-name="detail-store"
          />
          <StoreBreadCrumMb
            v-if="device === 'mobile'"
            class-name="detail-store"
            :title-close="dataStore?.name"
            @handle-close="backStore"
          >
            <template #icon>
              <IconLeft />
            </template>
            <template #show-icon>
              <div></div>
            </template>
          </StoreBreadCrumMb>
        </span>
      </Teleport>
    </ClientOnly>
    <div class="detail-store">
      <div class="detail-store__header">
        <div class="detail-store__title">
          <div
            v-if="
              device === DevicesEnum.MOBILE_DEVICE &&
              tabMenu === menuRestaurant.TOP
            "
            class="detail-store-top-mobile"
          >
            <StoreTopHeaderMb
              :id="idStore"
              :data="dataStore?.model_has_file"
              :name="dataStore?.name"
              :transportation="dataStore?.transportation"
            />
          </div>
          <div class="store-content">
            <StoreContentComponent :id="idStore" :data="dataStore" />
            <div v-if="dataStore?.news" class="detail-store__action">
              <div class="notice-user">{{ $t("notice_user") }}</div>
              <div>
                {{ dataStore?.news }}
              </div>
            </div>
            <div
              v-if="
                device === DevicesEnum.MOBILE_DEVICE &&
                tabMenu === menuRestaurant.TOP
              "
              class="name-mb"
            >
              <div class="top-header__title">
                {{ dataStore?.introduction }}
              </div>
              <div class="top-header__food">
                <div>{{ dataStore?.description }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-store__phone">
          <StorePhoneComponent
            :phone="dataStore?.phone_number"
            @handle-click="showModalDatePicker"
          />
          <div v-if="dataStore?.line_setting?.qr_code_url" class="qr-code">
            <div class="qr-code__label d-flex">
              <icon-line /> {{ $t("label_qr_code") }}
            </div>
            <el-image :src="dataStore?.line_setting?.qr_code_url"> </el-image>
          </div>
        </div>
      </div>
      <div class="detail-store__menu">
        <StoreMenu
          v-if="dataStore"
          :id="idStore"
          v-model="menuActive"
          :job-offer="dataStore?.plan?.plan_data?.job_offer"
          class="menu-item"
          :data-menu-category="dataStore?.menu_categories || []"
          :type-store="dataStore?.model_has_type?.type_id"
          :ref-body="_refBody"
          @handle-change-tab="handleChangeTab"
        />
      </div>
      <div ref="_refBody" class="detail-store__body">
        <div class="detail-store__content">
          <TopComponent
            v-if="checkActive(menuRestaurant.TOP) && dataStore"
            :data="dataStore"
            :id-store="idStore"
            :ref-body="_refBody"
            @show-data-course="showDataCourse"
            @show-data-image="showDataImage"
            @handle-click="showModalDate"
            @show-detail="showDetailCourse"
            @show-more-staff="showMoreStaff"
            @handle-click-menu-course="handleMenuShow"
            @handle-click-staff="changeHistoryQuery"
            @show-more-review="showMoreReview"
          />
          <SeatComponent
            v-else-if="checkActive(menuRestaurant.SEAT) && dataStore"
            :data="dataSeat"
          />
          <CourseComponent
            v-else-if="checkActive(menuRestaurant.COURSE_MENU) && dataStore"
            :id="idStore"
            ref="_refCourse"
            :id-course="idCourseDetail"
            :menu="dataStore?.menu_categories"
            :tab="menuActive"
            :type-store="dataStore?.model_has_type?.type_id"
            @show-data-image="showDataImage"
            @handle-click="showModalDate"
            @show-detail="showDetailCourse"
            @handle-click-menu="handleMenu"
            @handle-click-menu-course="handleMenuShow"
          />
          <PhotoComponent
            v-else-if="
              checkActive(menuRestaurant.PHOTO) &&
              dataStore &&
              dataStore?.model_has_type?.type_id !== SALON
            "
            :id="idStore"
            :tab-menu="menuActive"
            :ref-body="_refBody"
            :type-store="dataStore?.model_has_type?.type_id"
          />
          <PhotoSalonComponent
            v-else-if="
              checkActive(menuRestaurant.PHOTO) &&
              dataStore &&
              dataStore?.model_has_type?.type_id === SALON
            "
            :id="idStore"
            :tab-menu="menuActive"
            :ref-body="_refBody"
            :type-store="dataStore?.model_has_type?.type_id"
          />
          <RateComponent
            v-else-if="checkActive(menuRestaurant.RATE) && dataStore"
            :id-store="dataStore?.id"
            @update-rate="handleUpdateRate"
          />
          <ProfileComponent
            v-else-if="checkActive(menuRestaurant.INFORMATION) && dataStore"
            :data="dataStore"
            @handle-click="showModalDatePicker"
          />
          <StoreTabStaffComponent
            v-else-if="checkActive(menuRestaurant.STAFF) && dataStore"
            :staff="dataStore?.staffs"
            @handle-click="changeHistoryQuery"
          />
          <StoreTabRecruitmentComponent
            v-else-if="checkActive(menuRestaurant.RECRUITMENT) && dataStore"
            :id-store="dataStore?.id"
            @handle-click="changeHistoryQuery"
          />
        </div>
        <div class="detail-store__booking">
          <StoreDatePickerSelect
            v-if="dataStore"
            :type-store="dataStore?.model_has_type?.type_id"
            :open-time="dataStore?.opening_times"
            :closing-time="closingTime"
            :id-store="dataStore?.id"
            :submit-form="false"
            @handle-click="submitChangeMenu"
          />
        </div>
      </div>
      <div class="detail-store__footer">
        <StorePhoneComponent
          :phone="dataStore?.phone_number"
          :line-qr-code="dataStore?.line_setting?.qr_code_url"
          @handle-click="showModalDatePicker"
        />
      </div>
    </div>
    <modal-confirm
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      width="344px"
      @handle-close="handleClose"
    >
      <template #body>
        <StoreDatePickerSelect
          v-if="dataStore"
          :staff-id="staffId"
          :course-id="idCourse"
          :course-open-time="courseOpenTime"
          :id-store="dataStore?.id"
          :menu-id="menuId"
          :type-store="dataStore?.model_has_type?.type_id"
          :open-time="dataStore?.opening_times"
          :closing-time="closingTime"
          @handle-click="submitFormPicker"
        />
      </template>
    </modal-confirm>

    <ExternalAds :store-id="idStore" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter, useCookie } from "nuxt/app";
import { useDeviceStore } from "../../store/device";

import TopComponent from "../../components/store/tab/TopComponent.vue";
import SeatComponent from "../../components/store/tab/SeatComponent.vue";
import CourseComponent from "../../components/store/tab/CourseComponent.vue";
import PhotoComponent from "../../components/store/tab/PhotoComponent.vue";
import PhotoSalonComponent from "../../components/store/tab/PhotoSalonComponent.vue";
import RateComponent from "../../components/store/tab/RateComponent.vue";
import ProfileComponent from "../../components/store/tab/ProfileComponent.vue";
import { buildQuery } from "~/../../src/shared/utils/format";
import storeGuestRequest from "~/../../src/shared/requests/front/store";
import { DetailStore } from "~/../../src/front/models";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { getQuery } from "~/../../src/shared/utils/format";
import { DevicesEnum } from "~/../../src/shared/constants";
import scrollToTop from "~/../../src/shared/utils/scroll";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import IconLine from "~/../../src/shared/components/icon/Line.vue";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { useNuxtApp } from "nuxt/app";
import { i18n } from "~/../../src/shared/plugins/i18n";
import ExternalAds from "../../components/common/ExternalAds.vue";

const deviceTable = useDeviceStore();
const router = useRouter();
const route = useRoute();
const device = computed(() => {
  return deviceTable.device;
});
const loading = ref(false);
const { $bus } = useNuxtApp();
const _refCourse = ref(null);

const { t } = i18n.global;
const dataTitle = reactive([
  { name: t("title_screen.store_list"), path: "/store" },
  { name: "", path: "" },
]);

const valueActive = route.query.menu
  ? String(route.query.menu)
  : menuRestaurant.TOP;
const tab = ref(route.query.tab ? String(route.query.tab) : menuRestaurant.TOP);
const menuActive = ref(valueActive);
const tabMenu = ref(tab);
const dialogVisible = ref(false);
const idStore = ref(Number(route.params.id));
const idCourse = ref(route.query.course ? +route.query.course : null);
const idCourseDetail = ref(route.query.course ? +route.query.course : null);
const dataStore = ref<DetailStore>();
const closingTime = ref([]);
const menuShow = ref(false);
const menuId = ref();
const staffId = ref();
const _refBody = ref();
const courseOpenTime = ref([]);

const handleClose = () => {
  staffId.value = null;
  idCourse.value = null;
  menuId.value = null;
  staffId.value = null;
  dialogVisible.value = false;
};

const detailStore = async () => {
  try {
    loading.value = true;
    dataStore.value = (await storeGuestRequest.show(idStore.value))
      .data as DetailStore;
    dataTitle[1].name = dataStore.value.name;
    closingTime.value = dataStore.value.closing_times;
    if (
      Number(useCookie(persistKeys.MENU).value) !==
      dataStore.value?.model_has_type?.type_id
    ) {
      useCookie(persistKeys.MENU).value = String(
        dataStore.value?.model_has_type?.type_id
      );
      $bus.$emit("changeCookie", dataStore.value?.model_has_type?.type_id);
    }
  } catch (e) {
    if (e.response.status === STATUS_CODE.NOT_FOUND) {
      await router.push("/404");
    }
  } finally {
    loading.value = false;
  }
};

const handleUpdateRate = async () => {
  const response = (await storeGuestRequest.show(idStore.value))
    .data as DetailStore;
  if (dataStore.value) {
    dataStore.value.reviews = response.reviews;
  }
};

const showDataCourse = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  if (dataStore?.value.model_has_type?.type_id === SALON) {
    tab.value = menuRestaurant.COURSE_MENU;
    menuActive.value = menuRestaurant.COURSE_MENU;
    const obj = { tab: tabMenu.value, menu: menuActive.value };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  } else {
    tab.value = menuRestaurant.COURSE_MENU;
    menuActive.value = menuRestaurant.COURSE_MENU_TAB_COURSE;
    const obj = { tab: tabMenu.value, menu: menuActive.value };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  }
};

const showDataImage = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  if (dataStore?.value.model_has_type?.type_id === SALON) {
    tab.value = menuRestaurant.PHOTO;
    menuActive.value = menuRestaurant.PHOTO;
    const obj = { tab: tabMenu.value, menu: menuActive.value };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  } else {
    tab.value = menuRestaurant.PHOTO;
    menuActive.value = menuRestaurant.PHOTO_TAB_ALL;
    const obj = { tab: tabMenu.value, menu: menuActive.value };
    const query = "?" + buildQuery(obj);
    history.replaceState(null, null, `${query}`);
  }
};

const showMoreStaff = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  tab.value = menuRestaurant.STAFF;
  menuActive.value = menuRestaurant.STAFF;
  const obj = { tab: tabMenu.value, menu: menuActive.value };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, null, `${query}`);
};

const showMoreReview = async () => {
  await setTimeout(() => {
    window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 200);
  tab.value = menuRestaurant.RATE;
  menuActive.value = menuRestaurant.RATE;
  const obj = { tab: tabMenu.value, menu: menuActive.value };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

const backStore = () => {
  router.push({ name: "store" });
};

const updateAccess = async () => {
  await storeGuestRequest.accessData(idStore.value);
};

const handleChangeTab = async (tab: string[], value: string) => {
  route.query.course = "";
  idCourseDetail.value = null;
  tabMenu.value = tab[0];
  menuActive.value = value;
  const obj = { tab: tabMenu.value, menu: menuActive.value };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, null, `${query}`);
};
const checkActive = (value: string) => {
  return tabMenu.value === value;
};

const submitChangeMenu = () => {
  if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    changeHistoryQueryRestaurant();
  } else {
    changeHistoryQuery();
  }
};

const submitFormPicker = (activeDate: string, people: number, time: string) => {
  if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    const query = getQuery({
      date_booking: activeDate,
      people: people ? people : null,
      time_booking: time ? time : null,
      store_id: idStore.value,
      course_id: idCourse.value || null,
      type_store: dataStore.value?.model_has_type?.type_id,
    });
    dialogVisible.value = false;
    router.push({
      name: "reservation-booking",
      query: query,
    });
    menuShow.value = false;
    staffId.value = null;
    menuId.value = null;
    idCourse.value = null;
  } else {
    changeHistoryQuery();
  }
};
// TODO top

const handleMenu = (idMenu: number) => {
  router.push({
    name: "reservation-booking",
    query: {
      store_id: idStore.value,
      menu_id: idMenu,
      type_store: dataStore.value?.model_has_type?.type_id,
    },
  });
};

const handleMenuShow = (id: number) => {
  router.push({
    name: "reservation-booking",
    query: {
      store_id: idStore.value,
      menu_type: true,
      course_id: id,
      type_store: dataStore.value?.model_has_type?.type_id,
    },
  });
};

const showModalDate = (id: number) => {
  if (dataStore.value?.model_has_type?.type_id === RESTAURANT) {
    menuShow.value = false;
    staffId.value = null;
    menuId.value = null;
    idCourse.value = id;
    dialogVisible.value = true;
  } else {
    router.push({
      name: "reservation-booking",
      query: {
        store_id: idStore.value,
        course_id: id,
        type_store: dataStore.value?.model_has_type?.type_id,
      },
    });
  }
};

const showModalDatePicker = () => {
  if (dataStore.value?.model_has_type?.type_id === SALON) {
    changeHistoryQuery();
  } else {
    idCourse.value = null;
    menuShow.value = false;
    staffId.value = null;
    idCourse.value = null;
    // dialogVisible.value = true;
    changeHistoryQueryRestaurant();
  }
};

const changeHistoryQuery = () => {
  if (tabMenu.value === menuRestaurant.COURSE_MENU && _refCourse.value) {
    _refCourse.value.scrollTab();
  }
  tabMenu.value = menuRestaurant.COURSE_MENU;
  menuActive.value = menuRestaurant.COURSE_MENU;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

const changeHistoryQueryRestaurant = () => {
  if (tabMenu.value === menuRestaurant.COURSE_MENU && _refCourse.value) {
    _refCourse.value.scrollTab();
  }
  tabMenu.value = menuRestaurant.COURSE_MENU;
  menuActive.value = menuRestaurant.COURSE_MENU_TAB_COURSE;
  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

const showDetailCourse = (id: number) => {
  setTimeout(async () => {
    await window.scrollTo({
      top: _refBody.value.offsetTop - deviceTable.heightMenu - 110,
      behavior: "smooth",
    });
  }, 300);
  idCourse.value = id;
  idCourseDetail.value = id;
  tab.value = menuRestaurant.COURSE_MENU;
  route.query.course = String(id);
  if (dataStore.value?.model_has_type?.type_id === SALON) {
    menuActive.value = menuRestaurant.COURSE_MENU;
  } else {
    menuActive.value = menuRestaurant.COURSE_MENU_TAB_COURSE;
  }

  const obj = {
    tab: tabMenu.value,
    menu: menuActive.value,
    course: id,
  };
  const query = "?" + buildQuery(obj);
  history.replaceState(null, "", `${query}`);
};

// TODO seat
const dataSeat = computed(() => {
  const array: any[] = [];
  if (dataStore.value && dataStore.value.seats) {
    dataStore.value.seats.map((item) => {
      if (item.model_has_type) {
        let index = array.findIndex(
          (type) => type.type_id === item.model_has_type?.type_id
        );
        if (index === -1) {
          array.push({
            type_id: item.model_has_type.type_id,
            name: item.model_has_type.type?.name,
            file: [],
          });
          index = array.length - 1;
        }
        if (item.model_has_file.length > 0) {
          item.model_has_file.map((file) => {
            if (file.file) {
              array[index].file.push({
                name: item.name,
                url: file.file.url,
              });
            }
          });
        } else {
          array[index].file.push({
            name: item.name,
            url: null,
          });
        }
      }
    });
  }
  return array.sort((item, itemNew) => {
    return item.type_id - itemNew.type_id;
  });
});

onMounted(async () => {
  scrollToTop();
  await detailStore();
  await updateAccess();
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.detail-store-list {
  width: 100%;
  margin-bottom: 64px;
  min-height: 100px;

  .detail-store {
    max-width: 100%;
    padding: 0 15%;
    margin: 24px auto auto;

    .detail-store__header {
      display: flex;
      margin-bottom: 16px;

      .detail-store__title {
        width: calc(100% - 344px);
        padding-right: 30px;
        border-right: 1px solid $black-5;

        .detail-store-top-mobile {
          display: none;
        }

        .store-content {
          .name-mb {
            display: none;

            .top-header__title {
              color: $yellow-medium-color;
              margin: 16px 0;
              white-space: pre-line;
            }

            .top-header__food {
              margin-bottom: 16px;
              white-space: pre-line;
            }
          }

          .detail-store__action {
            display: flex;
            margin-top: 10px;
            align-items: center;

            .notice-user {
              width: 105px;
              min-width: 105px;
              margin-right: 8px;
              padding: 5px 12px;
              background-color: $orange;
              border-radius: 6px;
              text-align: center;
              color: white;
              font-size: 18px;
            }
          }
        }
      }

      .detail-store__phone {
        width: 344px;
        padding-left: 30px;

        .qr-code {
          margin-top: 20px;

          :deep(.el-image) {
            width: 100%;
          }

          img {
            max-width: 330px;
          }

          &__label {
            font-weight: bold;
            margin-bottom: 15px;
            align-items: center;

            svg {
              margin-right: 10px;
            }
          }
        }
      }
    }

    .detail-store__menu {
      margin-bottom: 16px;
      position: sticky !important;
      position: -webkit-sticky;
      top: 192px;
      z-index: 2025;
    }

    .detail-store__body {
      display: flex;

      .detail-store__content {
        width: calc(100% - 344px);
        padding-right: 30px;
        border-right: 1px solid $black-5;
      }

      .detail-store__booking {
        width: 344px;
        padding-left: 30px;
      }
    }

    .detail-store__footer {
      display: none;
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .detail-store__menu {
    top: 112px !important;
  }
}

@include res("md-only", $breakpoints-spec) {
  .detail-store-list {
    .detail-store {
      padding: 0 9%;

      .detail-store__header {
        .detail-store__title {
          width: calc(100% - 300px);
        }

        .detail-store__phone {
          width: 300px;
        }
      }

      .detail-store__body {
        .detail-store__content {
          width: calc(100% - 300px);
        }

        .detail-store__booking {
          width: 300px;
        }
      }
    }
  }
}

@include res("sm-only", $breakpoints-spec) {
  .detail-store-list {
    .detail-store {
      padding: 0 9%;

      .detail-store__header {
        .detail-store__title {
          width: calc(100% - 250px);
        }

        .detail-store__phone {
          width: 250px;
        }
      }

      .detail-store__body {
        .detail-store__content {
          width: calc(100% - 250px);
        }

        .detail-store__booking {
          width: 250px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .detail-store-list {
    margin-bottom: 0;

    .detail-store {
      background: #ffffff;
      padding: 0;
      margin-top: 0;

      .detail-store__header {
        .detail-store__title {
          width: 100%;
          padding: 0;
          border: unset;

          .detail-store-top-mobile {
            display: unset;
          }

          .store-content {
            padding: 0 16px;

            .detail-store__action {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }

            .name-mb {
              display: unset;
            }

            .content-header {
              :deep(.list-store__name) {
                display: none;
              }
            }
          }
        }

        .detail-store__phone {
          display: none;
        }
      }

      .detail-store__menu {
        top: 126px !important;
      }

      .detail-store__body {
        .detail-store__content {
          width: 100%;
          padding: 0;
        }

        .detail-store__booking {
          display: none;
        }
      }

      .detail-store__footer {
        display: block;
      }
    }
  }
}
</style>
