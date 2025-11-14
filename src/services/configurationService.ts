import Api from "./Api";
import Cookies from "js-cookie";
import { ConfigData } from "@/types/configuration";

const token = Cookies.get("token");

export const configurationService = {
    async getByUserId(userId: number) {
        const res = await Api.get<{ data: ConfigData }>(`/api/admin/configurations/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },

    async update(userId: number, data: FormData) {
        const res = await Api.post(`/api/admin/configurations/${userId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },
};
