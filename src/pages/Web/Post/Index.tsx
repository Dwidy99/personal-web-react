import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Loading from "@/components/web/Loading";
import Pagination from "@/components/general/Pagination";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import WebCategoryPill from "@/features/web/shared/components/WebCategoryPill";
import WebContentCard from "@/features/web/shared/components/WebContentCard";
import type {
  WebCategory,
  WebPaginationMeta,
  WebPost,
} from "@/features/web/shared/types";

export default function BlogIndex() {
  document.title = "Blog | Portfolio";

  const [categories, setCategories] = useState<WebCategory[]>([]);
  const [posts, setPosts] = useState<WebPost[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [pagination, setPagination] = useState<WebPaginationMeta>({
    current_page: 1,
    per_page: 6,
    total: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategories(await publicWebApi.getCategories());
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load categories";
        toast.error(message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoadingPosts(true);
      const data = await publicWebApi.getPosts(page, 6);

      setPosts(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
        last_page: data.last_page,
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoading = loadingCategories || loadingPosts;

  if (isLoading) {
    return (
      <LayoutWeb>
        <SEO />
        <Loading message="Loading blog..." variant="section" className="mt-24 min-h-[18rem]" />
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />

      <header className="text-center">
        <h1 className="mt-24 mb-12 text-3xl font-bold text-slate-700 dark:text-white md:text-5xl">
          Latest Posts & Topics
        </h1>
      </header>

      <section className="mb-16">
        <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-gray-300">
          Popular Tags
        </h2>
        <p className="mb-4 text-gray-500">Browse by category and explore diverse ideas.</p>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <WebCategoryPill
                key={category.id}
                name={category.name}
                image={category.image ?? "/no-image.png"}
                slug={category.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-gray-300">
          Recent Posts
        </h2>
        <p className="mb-6 text-gray-500">Discover the newest articles and insights.</p>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {posts.map((post) => (
              <WebContentCard
                key={post.id}
                image={post.image || "/no-image.png"}
                title={post.title}
                eyebrow={post.category?.name ? post.category.name : "Blog Post"}
                description={post.content}
                link={`/blog/${post.slug}`}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition hover:border-sky-300 hover:text-sky-600 dark:border-gray-700 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-300"
                >
                  Read more
                </Link>
              </WebContentCard>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-500 dark:text-sky-400">No posts available.</p>
        )}

        <Pagination
          className="mt-10"
          currentPage={pagination.current_page}
          totalCount={pagination.total}
          pageSize={pagination.per_page}
          onPageChange={handlePageChange}
        />
      </section>
    </LayoutWeb>
  );
}
