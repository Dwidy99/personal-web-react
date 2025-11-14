import Api from "./Api";
import Cookies from "js-cookie";
import { AuthCredentials, ForgotPasswordPayload, ResetPasswordPayload } from "../types/auth";

const authService = {
    async login(data: AuthCredentials) {
        const res = await Api.post("/api/login", data);
        Cookies.set("token", res.data.token);
        Cookies.set("user", JSON.stringify(res.data.user));
        Cookies.set("permissions", JSON.stringify(res.data.permissions));
        return res.data;
    },

    async forgotPassword(data: ForgotPasswordPayload) {
        const res = await Api.post("/api/forgot-password", data);
        return res.data;
    },

    async resetPassword(data: ResetPasswordPayload) {
        const res = await Api.post("/api/reset-password", data);
        return res.data;
    },

    logout() {
        Cookies.remove("token");
        Cookies.remove("user");
        Cookies.remove("permissions");
    },
};

export default authService;
