import { Link, useParams } from "react-router-dom";
import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import CardBlog from "@/components/general/CardBlog";
import Pagination from "@/components/general/Pagination";
import Loader from "@/components/general/Loader";
import { useFetchPostsByCategory } from "@/hooks/useFetchPostsByCategory";
import type { Post } from "@/types/post";

export default function CategoryPostsIndex(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const { posts, category, pagination, loading, fetchPostsByCategory } =
    useFetchPostsByCategory(slug);

  document.title = `Category: ${category?.name || "Loading..."} | Blogs`;

  const handlePageChange = (pageNumber: number): void => {
    fetchPostsByCategory(pageNumber);
  };

  if (!category && !loading) {
    return (
      <LayoutWeb>
        <main className="container text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">Category not found</h1>
          <a href="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Blog
          </a>
        </main>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />

      <main className="container mt-22.5 mx-7.5">
        <header>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Posts in Category: {category?.name || "Loading..."}
          </h1>
        </header>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Posts Listing */}
            <section
              aria-label="Posts by Category"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
            >
              {posts.length > 0 ? (
                posts.map((post: Post) => (
                  <article key={post.id}>
                    <CardBlog
                      title={post.title}
                      category={post.category}
                      content={post.content}
                      image={post.image}
                      slug={(post as any).slug ?? ""}
                    >
                      <p className="text-sm font-medium text-right text-blue-600 hover:underline">
                        <Link to={`/blog/${(post as any).slug}`}>Read more →</Link>
                      </p>
                    </CardBlog>
                  </article>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No posts found in this category</p>
                  <a href="/blog" className="text-blue-600 hover:underline mt-2 inline-block">
                    Back to Blog
                  </a>
                </div>
              )}
            </section>

            {/* Pagination */}
            {posts.length > 0 && (
              <nav aria-label="Pagination" className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  totalCount={pagination.total}
                  pageSize={pagination.per_page}
                  onPageChange={handlePageChange}
                />
              </nav>
            )}
          </>
        )}
      </main>
    </LayoutWeb>
  );
}
