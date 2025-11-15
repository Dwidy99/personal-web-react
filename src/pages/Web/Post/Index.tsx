import { useEffect, useState } from "react";
import LayoutWeb from "../../../layouts/Web";
import { publicService } from "../../../services/publicService";
import CardCategory from "../../../components/general/CardCategory";
import RandomColors from "../../../utils/RandomColors";
import CardPost from "../../../components/general/CardPost";
import toast from "react-hot-toast";
import SEO from "../../../components/general/SEO";
import Loader from "@/components/general/Loader";

export default function BlogIndex() {
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  document.title = "Blog | Portfolio";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, postsData] = await Promise.all([
          publicService.getCategories(),
          publicService.getPostsHome(),
        ]);
        setCategories(cats);
        setPosts(postsData);
      } catch (err: any) {
        toast.error(err.message || "Failed to load blog data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <LayoutWeb>
      <SEO />
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-center font-bold text-3xl md:text-5xl mb-10 text-slate-700 dark:text-sky-400">
          Latest Posts & Topics
        </h1>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-gray-300">
            Popular Tags
          </h2>
          <p className="text-gray-500 mb-4">Browse by category and explore diverse ideas.</p>
          <div className="flex flex-wrap gap-4">
            {categories.length > 0 ? (
              categories.map((cat, i) => (
                <CardCategory
                  key={i}
                  name={cat.name}
                  image={cat.image}
                  colorClass={RandomColors()}
                  slug={cat.slug}
                />
              ))
            ) : (
              <p className="text-gray-500">No categories found.</p>
            )}
          </div>
        </section>

        {/* Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-gray-300">
            Recent Posts
          </h2>
          <p className="text-gray-500 mb-4">Discover the newest articles and insights.</p>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.length > 0 ? (
              posts.map((p, i) => (
                <CardPost
                  key={i}
                  index={i}
                  image={p.image}
                  slug={p.slug}
                  title={p.title}
                  category={p.category}
                  content={p.content}
                  date={p.created_at}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No posts available.</p>
            )}
          </ul>
        </section>
      </section>
    </LayoutWeb>
  );
}
