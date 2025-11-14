import Api from "./Api";
import Cookies from "js-cookie";
import {
    AuthResponse,
    ForgotPasswordPayload,
    LoginPayload,
    ResetPasswordPayload,
} from "../types/auth";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const PERMISSIONS_KEY = "permissions";

export const authService = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const { data } = await Api.post("/api/login", payload);
        Cookies.set(TOKEN_KEY, data.token);
        Cookies.set(USER_KEY, JSON.stringify(data.user));
        Cookies.set(PERMISSIONS_KEY, JSON.stringify(data.permissions));
        return data;
    },

    async forgotPassword(payload: ForgotPasswordPayload) {
        const { data } = await Api.post("/api/forgot-password", payload);
        return data;
    },

    async resetPassword(payload: ResetPasswordPayload) {
        const { data } = await Api.post("/api/reset-password", payload);
        return data;
    },

    logout() {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(USER_KEY);
        Cookies.remove(PERMISSIONS_KEY);
    },

    isAuthenticated(): boolean {
        return !!Cookies.get(TOKEN_KEY);
    },
};
