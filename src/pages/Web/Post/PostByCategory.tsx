import { Link, useParams } from "react-router-dom";

import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Pagination from "@/components/general/Pagination";
import Loading from "@/components/web/Loading";
import { useCategoryPosts } from "@/features/web/blog/hooks/useCategoryPosts";
import WebContentCard from "@/features/web/shared/components/WebContentCard";

export default function CategoryPostsIndex(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const { posts, category, pagination, loading, fetchPostsByCategory } = useCategoryPosts(slug);

  document.title = `Category: ${category?.name || "Loading..."} | Blogs`;

  const handlePageChange = (pageNumber: number): void => {
    fetchPostsByCategory(pageNumber);
  };

  if (loading) {
    return (
      <LayoutWeb>
        <SEO />
        <Loading message="Loading posts..." variant="section" className="mt-24 min-h-[18rem]" />
      </LayoutWeb>
    );
  }

  if (!category) {
    return (
      <LayoutWeb>
        <main className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500">Category not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </main>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />

      <header>
        <h1 className="mt-24 mb-12 text-2xl font-bold text-slate-700 dark:text-white md:text-5xl">
          Posts in Category: {category.name}
        </h1>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <WebContentCard
              key={post.id}
              title={post.title}
              eyebrow={post.category?.name || category.name}
              description={post.content}
              image={post.image}
              link={`/blog/${post.slug}`}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-900 transition hover:border-sky-300 hover:text-sky-600 dark:border-gray-700 dark:text-white dark:hover:border-sky-400 dark:hover:text-sky-300"
              >
                Read more
              </Link>
            </WebContentCard>
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-gray-500">No posts found in this category</p>
            <Link to="/blog" className="mt-2 inline-block text-blue-600 hover:underline">
              Back to Blog
            </Link>
          </div>
        )}
      </section>

      {posts.length > 0 && (
        <nav className="mt-8">
          <Pagination
            currentPage={pagination.current_page}
            totalCount={pagination.total}
            pageSize={pagination.per_page}
            onPageChange={handlePageChange}
          />
        </nav>
      )}
    </LayoutWeb>
  );
}
