import Api from "./Api";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const permissionService = {
    async getAll(page = 1, search = "") {
        const res = await Api.get(`/api/admin/permissions?search=${search}&page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.data;
    },
};

export default permissionService;
