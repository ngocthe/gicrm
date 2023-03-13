import { defineStore } from "pinia";
import { Admin } from "../models";

interface UserAdminState {
  user: Admin;
}

export const useAdminStore = defineStore("user", {
  state: () =>
    ({
      user: null,
    } as UserAdminState),
});
