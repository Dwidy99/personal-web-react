import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Api from "@/services/Api";
import type { Post } from "@/types/post";
import type { PaginationMeta } from "@/types/post";

/**
 * Custom hook untuk mengambil daftar post berdasarkan kategori.
 * Reusable untuk halaman mana pun yang butuh data blog per kategori.
 */
export function useFetchPostsByCategory(slug?: string) {
    const navigate = useNavigate();

    // 🔹 States
    const [posts, setPosts] = useState<Post[]>([]);
    const [category, setCategory] = useState<{ id: number; name: string } | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta>({
        current_page: 1,
        per_page: 10,
        total: 0,
    });
    const [loading, setLoading] = useState<boolean>(false);

    // 🔹 Fetch Function
    const fetchPostsByCategory = async (page = 1): Promise<void> => {
        if (!slug) return;

        try {
            setLoading(true);
            const res = await Api.get(`/api/public/categories/${slug}/posts?page=${page}`);

            if (!res.data.success) {
                toast.error(res.data.message || "Failed to fetch posts");
                navigate("/blog");
                return;
            }

            const { posts, category } = res.data.data;
            setPosts(posts.data);
            setCategory(category);
            setPagination({
                current_page: posts.current_page,
                per_page: posts.per_page,
                total: posts.total,
            });
        } catch (err: any) {
            toast.error(`Failed to load category posts: ${err.message}`);
            navigate("/blog");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Auto fetch when slug changes
    useEffect(() => {
        if (slug) fetchPostsByCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    return {
        posts,
        category,
        pagination,
        loading,
        fetchPostsByCategory,
    };
}
