import oFetchApi from "../composables/ofetchApi";
import { User } from "../types/model";
import { ForgotPasswordForm, LoginForm, TokenResponse } from "./types";

class AuthRequest {
  readonly resource: string = "/auth";

  async login(data: LoginForm) {
    return oFetchApi<TokenResponse>(`${this.resource}/login`, {
      method: "POST",
      body: data,
    });
  }

  async forgotPassword(data: ForgotPasswordForm) {
    return oFetchApi(`${this.resource}/forgot-password`, {
      method: "POST",
      body: data,
    });
  }

  async resetPassword(data: ForgotPasswordForm) {
    return oFetchApi(`${this.resource}/reset-password`, {
      method: "POST",
      body: data,
    });
  }

  async getMyInfo() {
    return oFetchApi<User>(`/me`, {
      method: "GET",
    });
  }

  async logout() {
    return oFetchApi(`/me/logout`, {
      method: "POST",
    });
  }
}

const authRequest = new AuthRequest();

export default authRequest;
