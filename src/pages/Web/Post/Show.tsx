import { useEffect, useState, useCallback } from "react";
import LayoutWeb from "../../../layouts/Web";
import Api from "../../../services/Api";
import { Link, useParams } from "react-router-dom";
import LoadingTailwind from "../../../components/general/LoadingTailwind";
import { FaCalendarAlt, FaUserEdit } from "react-icons/fa";
import DateID from "../../../utils/DateID";
import toast from "react-hot-toast";
import SEO from "../../../components/general/SEO";
import ContentRenderer from "../../../components/general/SanitizedHTML"; // Assuming this is your custom component

export default function Show() {
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { slug } = useParams();

  document.title = "Show Post Dwi's | Blogs";

  const fetchDetailDataPost = useCallback(async () => {
    try {
      setLoadingPost(true);
      const response = await Api.get(`/api/public/posts/${slug}`);
      setPost(response.data.data || null);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setPost(null);
    } finally {
      setLoadingPost(false);
    }
  }, [slug]);

  const fetchAllPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const response = await Api.get(`/api/public/posts_home`);
      setPosts(response.data.data || []);
    } catch (error) {
      toast.error(`Failed to load articles: ${error.message}`, {
        position: "top-center",
      });
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchDetailDataPost();
    fetchAllPosts();
  }, [slug, fetchDetailDataPost, fetchAllPosts]);

  if (loadingPost) {
    return (
      <LayoutWeb>
        <div className="container">
          <LoadingTailwind />
        </div>
      </LayoutWeb>
    );
  }

  if (!post) {
    return (
      <LayoutWeb>
        <div className="container text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">Post not found</h1>
          <Link
            to="/blog"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Blog
          </Link>
        </div>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb disableSnow>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.tags?.join(",")}
      />
      <div className="container mx-auto px-4 mt-22.5 sm:px-6 md:px-8">
        {" "}
        {/* Adjusted container to mx-auto and added px-4 */}
        <div className="lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-lg p-6 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {" "}
              {/* Adjusted for dark mode background/text */}
              <div className="flex justify-start mt-2">
                {post.user && (
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}
                    {/* Adjusted for dark mode text */}
                    <FaUserEdit className="inline mr-2" />
                    {post.user.name}
                  </span>
                )}
                <span className="ml-5 text-gray-600 dark:text-gray-400">
                  {" "}
                  {/* Adjusted for dark mode text */}
                  <FaCalendarAlt className="inline mr-2" />
                  {DateID(new Date(post.created_at))}
                </span>
              </div>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-800 dark:text-gray-100 sm:text-5xl">
                {" "}
                {/* Adjusted for dark mode text */}
                {post.title}
              </h1>
              <hr className="border-gray-300 dark:border-gray-700 my-4" />{" "}
              {/* Adjusted for dark mode border */}
              {post.category && (
                <span className="text-gray-600">
                  {" "}
                  {/* Removed dark:text-gray-600 here as it conflicts with the button color */}
                  <Link
                    to={`/blog/category/${post.category.slug}`}
                    className="bg-gray-700 text-white py-1 px-3 rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500" // Added dark mode and hover for category button
                  >
                    #{post.category.name}
                  </Link>
                </span>
              )}
              <div className="mt-6 text-gray-800 dark:text-gray-300">
                {" "}
                {/* Adjusted for dark mode text */}
                <ContentRenderer
                  content={post.content}
                  className="custom-styles" // Remove dark:text-gray-600 here, let the ContentRenderer handle its internal styles or let the parent div dictate it.
                  isQuillContent={true}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white text-gray-700 rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-gray-300">
              {" "}
              {/* Adjusted for dark mode background/text */}
              <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 sm:text-2xl">
                {" "}
                {/* Adjusted for dark mode text */}
                Update News
              </h2>
              <hr className="border-gray-300 dark:border-gray-700 my-4" />{" "}
              {/* Adjusted for dark mode border */}
              {loadingPosts ? (
                <LoadingTailwind />
              ) : (
                <div>
                  {posts
                    .filter(
                      (p) => !(p.title === post.title && p.slug === post.slug)
                    )
                    .map((p, index) => (
                      <div key={index} className="mt-6">
                        <div className="flex items-center">
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-20 h-20 rounded-lg mr-4"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          <div>
                            <Link to={`/blog/${p.slug}`}>
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {" "}
                                {/* Adjusted for dark mode text */}
                                {p.title?.length > 30
                                  ? `${p.title.slice(0, 30)}...`
                                  : p.title}
                              </h3>
                            </Link>
                            <span className="text-gray-500 dark:text-gray-400">
                              {" "}
                              {/* Adjusted for dark mode text */}
                              {p.created_at && DateID(new Date(p.created_at))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWeb>
  );
}
