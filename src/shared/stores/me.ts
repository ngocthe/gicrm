import { defineStore } from "pinia";
import { useCookie } from "nuxt/app";
import authRequest from "../requests/AuthRequest";
import BookingRequest from "../requests/BookingRequest";
import { Permission } from "../constants/permission";
import { persistKeys } from "../constants/persist-key";
import { User } from "../types/model";
import { ROLES } from "~/../../src/shared/constants/roles";
import getFullName from "~/../../src/shared/utils/getFullName";
import { StorePlan } from "../models/plan";

export interface MeState {
  info: User | null;
  role: string | null;
  permissions: Permission[] | [];
  typeStore: number | null;
  plan: StorePlan;
  totalWaiting: number;
  geolocationPosition: {
    latitude: number | null;
    longitude: number | null;
  };
}

// @ts-ignore
export const useMeStore = defineStore("me", {
  state: () =>
    ({
      info: null,
      role: null,
      permissions: [],
      typeStore: null,
      plan: {},
      totalWaiting: 0,
      geolocationPosition: {
        latitude: null,
        longitude: null,
      },
    } as MeState),
  getters: {
    getUserId(): number | undefined {
      return this.info?.id;
    },
    getStoreId: (state: MeState) => state.info?.store?.id,
    getStoreType: (state: MeState) =>
      state.info?.store?.model_has_type?.type_id,
    getClosingTimeStore: (state: MeState) => state.info?.store?.closing_times,
    getOpeningTimeStore: (state: MeState) => state.info?.store?.opening_times,
    getFullNameStore: (state: MeState) =>
      getFullName(
        state.info?.store?.first_company_name || "",
        state.info?.store?.last_company_name || ""
      ),
    getAvatar: (state: MeState) => state?.info?.avatar?.url || null,
    getTypeStore: (state: MeState) => state?.typeStore,
    getPlan: (state: MeState) => state?.plan,
    getTypeSocialLogin: (state: MeState) => state?.info?.social_type,
    getMaxImageByPlan: (state: MeState) => state?.plan?.plan_data?.number_photo,
    getMaxImageByPlanStaff: (state: MeState) =>
      state?.plan?.plan_data?.number_staff,
    getMaxImageByPlanStoreTop: (state: MeState) =>
      state?.plan?.plan_data?.number_store_top_photo,
    getGeolocationPosition: (state: MeState) => state.geolocationPosition,
  },
  actions: {
    async fetchUpdate() {
      const token = useCookie(persistKeys.ACCESS_TOKEN).value;
      if (token) {
        try {
          const data = await authRequest.getMyInfo();
          if (data) {
            const user = data.data;
            this.info = user;
            this.role = user?.role?.name || null;
            this.permissions = user?.role?.permissions || [];
            this.plan = user?.store?.plan || null;
            // role store
            if (this.role === ROLES.STORE) {
              this.typeStore =
                this.info?.store?.model_has_type?.type_id || null;
              await this.updateTotalWaiting();
            }
          }
        } catch (error) {}
      }
    },
    async updateTotalWaiting() {
      const totalWaiting = await BookingRequest.getTotalBooking();
      this.totalWaiting = totalWaiting.data;
    },
    async setData(data: any) {
      this.info = data;
      this.role = data?.role?.name || null;
      this.permissions = data?.role?.permissions || [];
      // role store
      if (this.role === ROLES.STORE) {
        this.typeStore = this.info?.store?.model_has_type?.type_id || null;
      }
    },
    setAvatar(avatar: { url: string; id: number | null; fileType: string }) {
      if (this.info) {
        this.info.avatar = {
          url: "",
          id: null,
          file_type: "",
        };
        this.info.avatar.url = avatar.url;
        this.info.avatar.id = avatar.id;
        this.info.avatar.file_type = avatar.fileType;
      }
    },
    clear() {
      this.info = null;
      this.role = null;
      this.permissions = [];
    },
    setGeolocationPosition(value: { latitude: number; longitude: number }) {
      this.geolocationPosition = value;
    },
  },
  // persist: true,
});
