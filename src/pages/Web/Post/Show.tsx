import { useEffect, useState, useCallback } from "react";
import LayoutWeb from "../../../layouts/Web";
import { Link, useParams } from "react-router-dom";
import { FaCalendarAlt, FaUserEdit } from "react-icons/fa";
import formatDate from "../../../utils/Date";
import toast from "react-hot-toast";
import SEO from "../../../components/general/SEO";
import ContentRenderer from "../../../components/general/SanitizedHTML";
import hljs from "highlight.js";

import { publicService } from "../../../services";
import Loader from "@/components/general/Loader";

export default function BlogShow() {
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  document.title = "Show | Portfolio";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [detail, allPosts] = await Promise.all([
        publicService.getPostBySlug?.(slug),
        publicService.getPostsHome(),
      ]);
      setPost(detail);
      setRelatedPosts(allPosts.filter((p: any) => p.slug !== slug));
    } catch (err: any) {
      toast.error("Failed to load post: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!post?.content) return;

    const t = window.setTimeout(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll("pre.ql-syntax, pre code").forEach((el) => {
          hljs.highlightElement(el as HTMLElement);
        });
      });
    }, 0);

    return () => window.clearTimeout(t);
  }, [post?.content]);

  if (loading) return <Loader />;

  if (!post) {
    return (
      <LayoutWeb>
        <main className="container text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">Post not found</h1>
          <a href="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Blog
          </a>
        </main>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb disableSnow>
      <SEO title={post.title} description={post.excerpt} />

      <div className="lg:grid pt-12 lg:grid-cols-3 gap-8">
        {/* Article */}
        <article className="lg:col-span-2">
          <div className="rounded-lg shadow-md bg-white dark:bg-gray-800 p-6 text-gray-700 dark:text-gray-200">
            <header className="flex flex-wrap gap-5 mb-4 text-sm text-gray-500 dark:text-gray-400">
              {post.user && (
                <span>
                  <FaUserEdit className="inline mr-1" />
                  {post.user.name}
                </span>
              )}
              <span>
                <FaCalendarAlt className="inline mr-1" />
                {formatDate(new Date(post.created_at))}
              </span>
            </header>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {post.title}
            </h1>

            {post.category && (
              <Link
                to={`/blog/category/${post.category.slug}`}
                className="inline-block bg-gray-700 text-white py-1 px-3 rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 mb-4"
              >
                #{post.category.name}
              </Link>
            )}

            <section className="mt-6 prose dark:prose-invert max-w-none">
              <ContentRenderer content={post.content} isQuillContent />
            </section>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 mt-10 lg:mt-0">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Recent Articles
            </h2>

            <div className="space-y-4">
              {relatedPosts.length > 0 ? (
                relatedPosts.map((p, i) => (
                  <article key={i} className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <Link to={`/blog/${p.slug}`}>
                        <h3 className="font-medium hover:underline text-gray-800 dark:text-gray-100">
                          {p.title.length > 40 ? `${p.title.slice(0, 40)}...` : p.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {p.created_at && formatDate(new Date(p.created_at))}
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
