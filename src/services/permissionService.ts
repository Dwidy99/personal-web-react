import Api from "./Api";
import Cookies from "js-cookie";
import { Permission } from "@/types/permission";

const token = Cookies.get("token");

export const permissionService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get(`/api/admin/permissions?search=${search}&page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },
};
