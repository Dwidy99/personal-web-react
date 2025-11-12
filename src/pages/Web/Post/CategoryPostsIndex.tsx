import LayoutWeb from "../../../layouts/Web";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../../../services/Api";
import CardBlog from "../../../components/general/CardBlog";
import LoadingTailwind from "../../../components/general/LoadingTailwind";
import Pagination from "../../../components/general/Pagination";
import toast from "react-hot-toast";
import SEO from "../../../components/general/SEO";

export default function CategoryPostsIndex() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  document.title = "Category Posts | Blogs";

  const fetchPostsByCategory = async (page = 1) => {
    try {
      setLoading(true);
      const response = await Api.get(
        `/api/public/categories/${slug}/posts?page=${page}`
      );

      if (!response.data.success) {
        toast.error(response.data.message);
        navigate("/blog");
        return;
      }

      setPosts(response.data.data.posts.data);
      setCategory(response.data.data.category);
      setPagination({
        currentPage: response.data.data.posts.current_page,
        perPage: response.data.data.posts.per_page,
        total: response.data.data.posts.total,
      });
    } catch (error) {
      toast.error(`Failed to load category posts: ${error.message}`);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchPostsByCategory(pageNumber);
  };

  useEffect(() => {
    fetchPostsByCategory();
  }, [slug]);

  if (!category && !loading) {
    return (
      <LayoutWeb>
        <div className="container text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">
            Category not found
          </h1>
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
    <LayoutWeb>
      <SEO />
      <div className="container mt-22.5 mx-7.5">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Posts in Category: {category?.name || "Loading..."}
        </h1>

        {loading ? (
          <LoadingTailwind />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mt-8">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <CardBlog
                    key={post.id}
                    title={post.title}
                    category={post.category}
                    content={post.content}
                    image={post.image}
                    slug={post.slug}
                  >
                    <p className="text-sm font-medium text-right text-blue-600 hover:underline">
                      <Link to={`/blog/${post.slug}`}>Read more →</Link>
                    </p>
                  </CardBlog>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">
                    No posts found in this category
                  </p>
                  <Link
                    to="/blog"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Back to Blog
                  </Link>
                </div>
              )}
            </div>

            {posts.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalCount={pagination.total}
                  pageSize={pagination.perPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </LayoutWeb>
  );
}
