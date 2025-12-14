// src/pages/Web/Post/Index.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Loader from "@/components/general/Loader";
import Pagination from "@/components/general/Pagination";

import CardCategory from "@/components/general/CardCategory";
import CardProjects from "@/components/general/CardProjects";

import RandomColors from "@/utils/RandomColors";
import toast from "react-hot-toast";
import { publicService } from "@/services/publicService";

// ---- Types (simple & beginner-friendly) ----
type Category = {
  id: number;
  name: string;
  slug: string;
  image?: string;
};

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  image?: string; // optional: depends on your API
  category?: { name: string; slug: string };
};

type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function truncate(text: string, max = 140) {
  const clean = stripHtml(text || "");
  return clean.length > max ? clean.slice(0, max) + "..." : clean;
}

export default function BlogIndex() {
  document.title = "Blog | Portfolio";

  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 2,
    total: 10,
  });

  // Cache random colors for categories (avoid changing on every render)
  const categoryColors = useMemo(() => {
    const map = new Map<number, string>();
    return (id: number) => {
      if (!map.has(id)) map.set(id, RandomColors());
      return map.get(id)!;
    };
  }, []);

  // ---- Fetch categories once ----
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        const cats = await publicService.getCategories();
        setCategories(cats || []);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load categories");
      } finally {
        setLoadingCats(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchPosts = async (page = 1) => {
    setLoadingPosts(true);
    try {
      const data = await publicService.getPosts(page, 6); // ✅ 6 per halaman

      setPosts(data.data);
      setPagination({
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts(pagination.current_page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    // Update UI immediately, then fetch the page
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <LayoutWeb>
      <SEO />

      <header className="text-center">
        <h1 className="font-bold text-3xl mt-24 md:text-5xl mb-12 text-slate-700 dark:text-sky-400">
          Latest Posts & Topics
        </h1>
      </header>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-gray-300">Popular Tags</h2>
        <p className="text-gray-500 mb-4">Browse by category and explore diverse ideas.</p>

        {loadingCats ? (
          <Loader />
        ) : categories.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <CardCategory
                key={cat.id}
                name={cat.name}
                image={cat.image ?? "/no-image.png"}
                colorClass={categoryColors(cat.id)}
                slug={cat.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </section>

      {/* Posts list as cards */}
      <section>
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-gray-300">Recent Posts</h2>
        <p className="text-gray-500 mb-6">Discover the newest articles and insights.</p>

        {loadingPosts ? (
          <Loader />
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post) => (
                  <CardProjects
                    key={post.id}
                    image={post.image || "/no-image.png"}
                    title={post.title}
                    caption={post.category?.name ? post.category.name : "Blog Post"}
                    description={truncate(post.content, 160)}
                    link={`/blog/${post.slug}`}
                  >
                    <p className="text-sm font-medium text-right text-blue-600 hover:underline mt-2">
                      <Link to={`/blog/${post.slug}`}>Read more →</Link>
                    </p>
                  </CardProjects>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                No posts available.
              </p>
            )}

            {/* ✅ Pagination rendered regardless of posts length */}
            <Pagination
              className="mt-10"
              currentPage={pagination.current_page}
              totalCount={pagination.total}
              pageSize={pagination.per_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </LayoutWeb>
  );
}
