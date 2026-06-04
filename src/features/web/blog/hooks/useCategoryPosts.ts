import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import type { WebCategory, WebPaginationMeta, WebPost } from "@/features/web/shared/types";

type UseCategoryPostsResult = {
  posts: WebPost[];
  category: WebCategory | null;
  pagination: WebPaginationMeta;
  loading: boolean;
  fetchPostsByCategory: (page?: number) => Promise<void>;
};

export function useCategoryPosts(slug?: string): UseCategoryPostsResult {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<WebPost[]>([]);
  const [category, setCategory] = useState<WebCategory | null>(null);
  const [pagination, setPagination] = useState<WebPaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchPostsByCategory = useCallback(
    async (page = 1) => {
      if (!slug) {
        return;
      }

      try {
        setLoading(true);
        const data = await publicWebApi.getPostsByCategory(slug, page);

        setPosts(data.posts.data);
        setCategory(data.category);
        setPagination({
          current_page: data.posts.current_page,
          per_page: data.posts.per_page,
          total: data.posts.total,
          last_page: data.posts.last_page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load category posts";
        toast.error(message);
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    },
    [navigate, slug]
  );

  useEffect(() => {
    fetchPostsByCategory();
  }, [fetchPostsByCategory]);

  return {
    posts,
    category,
    pagination,
    loading,
    fetchPostsByCategory,
  };
}
