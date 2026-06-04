// src/pages/Web/Post/Show.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";

import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Loading from "@/components/web/Loading";
import ContentRenderer from "@/components/general/ContentRenderer";
import formatDate from "@/utils/Date";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import type { WebPost } from "@/features/web/shared/types";

declare global {
  interface Window {
    hljs?: {
      highlightElement: (element: HTMLElement) => void;
    };
  }
}

export default function BlogShow() {
  const { slug } = useParams();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [post, setPost] = useState<WebPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<WebPost[]>([]);
  const [loading, setLoading] = useState(true);

  document.title = "Show | Portfolio";

  const fetchData = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);

      const [detail, allPosts] = await Promise.all([
        publicWebApi.getPostBySlug(slug),
        publicWebApi.getPostsHome(),
      ]);

      setPost(detail);
      setRelatedPosts((allPosts || []).filter((item) => item.slug !== slug));
    } catch (error) {
      setPost(null);
      const message = error instanceof Error ? error.message : "Failed to load post";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Highlight code blocks inside article content.
   */
  useEffect(() => {
    if (!post?.content) return;

    const container = contentRef.current;
    if (!container) return;

    const raf = requestAnimationFrame(() => {
      const blocks = container.querySelectorAll("pre.ql-syntax, pre code");

      blocks.forEach((block) => {
        const target =
          block.tagName.toLowerCase() === "pre"
            ? ((block.querySelector("code") as HTMLElement) ?? (block as HTMLElement))
            : (block as HTMLElement);

        // reset highlight state to avoid duplicate highlighting
        target.removeAttribute("data-highlighted");
        target.classList.remove("hljs");

        // make sure it stays safe/plain before re-highlight
        const raw = target.textContent ?? "";
        target.textContent = raw;

        window.hljs?.highlightElement(target);
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [post?.content]);

  if (loading) {
    return (
      <LayoutWeb>
        <Loading message="Loading post..." variant="section" className="my-20" />
      </LayoutWeb>
    );
  }

  if (!post) {
    return (
      <LayoutWeb>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500">Post not found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Blog
          </Link>
        </div>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO title={post.title} description={post.excerpt} />

      <div className="pt-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
        >
          <FaArrowLeft className="text-xs" />
          Back to blog
        </Link>
      </div>

      <div className="pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article */}
        <article className="lg:col-span-2">
          <div className="rounded-lg shadow-md bg-white dark:bg-gray-800 p-5 sm:p-6 md:p-8 text-gray-700 dark:text-gray-200">
            <header className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
              {post.user?.name && (
                <span className="inline-flex items-center gap-2">
                  <FaUserEdit />
                  {post.user.name}
                </span>
              )}
              {post.created_at && (
                <span className="inline-flex items-center gap-2">
                  <FaCalendarAlt />
                  {formatDate(new Date(post.created_at))}
                </span>
              )}
            </header>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 break-words">
              {post.title}
            </h1>

            {post.category?.slug && (
              <Link
                to={`/blog/category/${post.category.slug}`}
                className="inline-flex items-center bg-gray-800 text-white py-1 px-3 rounded-md hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 mb-5 text-sm"
              >
                #{post.category.name}
              </Link>
            )}

            <section
              ref={contentRef}
              className="mt-6 prose dark:prose-invert max-w-none break-words
                         [&_img]:max-w-full [&_img]:h-auto
                         [&_pre]:max-w-full [&_pre]:overflow-x-auto
                         [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
            >
              <ContentRenderer content={post.content} />
            </section>

            <footer className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
              >
                <FaArrowLeft className="text-xs" />
                Back to blog
              </Link>
            </footer>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Recent Articles
            </h2>

            <div className="space-y-4">
              {relatedPosts.length > 0 ? (
                relatedPosts.slice(0, 6).map((p, i) => (
                  <article key={i} className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <Link to={`/blog/${p.slug}`} className="block">
                        <h3 className="font-medium hover:underline text-gray-800 dark:text-gray-100 truncate">
                          {p.title}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {p.created_at ? formatDate(new Date(p.created_at)) : ""}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-gray-500">No other posts.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </LayoutWeb>
  );
}
