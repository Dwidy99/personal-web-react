// Web/Home/Index.tsx
import { useEffect, useState } from "react";
import LayoutWeb from "../../../layouts/Web";
import { publicService } from "../../../services/publicService";
import CardCategory from "../../../components/general/CardCategory";
import CardPost from "../../../components/general/CardPost";
import RandomColors from "../../../utils/RandomColors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SEO from "../../../components/general/SEO";
import Loader from "@/components/general/Loader";

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  document.title = "Home | Portfolio Blogs";

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [profiles, cats, postsData] = await Promise.all([
          publicService.getProfiles(),
          publicService.getCategories(),
          publicService.getPostsHome(),
        ]);

        setProfile(profiles[0] || null);
        setCategories(Array.isArray(cats) ? cats : []);

        const safePosts = (Array.isArray(postsData) ? postsData : []).map((post) => ({
          id: post?.id ?? Math.random(),
          slug: post?.slug ?? "#",
          title: post?.title ?? "Untitled Post",
          content: typeof post?.content === "string" ? post.content : "",
          category: post?.category ?? null,
          date: post?.created_at ?? null,
        }));

        setPosts(safePosts);
      } catch (err: any) {
        toast.error(err.message || "Failed to load home data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader />;

  return (
    <LayoutWeb>
      <SEO />

      <main className="container mx-auto px-6 sm:px-8 md:px-10 mt-10 md:mt-16 lg:mt-25.5">
        {/* Hero */}
        <header className="text-center mb-12 md:mb-20">
          <h1 className="font-extrabold text-3xl mt-24 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-slate-700 dark:text-sky-400 leading-tight tracking-tight mb-4">
            Hello, folks! <br className="hidden sm:block" /> Discover my stories and creative ideas.
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore thoughts, projects, and reflections — all in one digital space.
          </p>
        </header>

        {/* Profile Intro */}
        {profile && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
            <figure className="flex justify-center order-1 md:order-none">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full max-w-[380px] sm:max-w-[420px] md:max-w-[480px] rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 object-cover"
              />
            </figure>

            <article className="space-y-5 text-center md:text-left px-2 sm:px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100">
                Hi, I’m <span className="text-sky-600 dark:text-sky-400">{profile.name}</span> —{" "}
                {profile.caption}
              </h2>

              <div
                className="text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm sm:prose-base md:prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: profile.content }}
              />

              <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-6 font-medium text-gray-700 dark:text-gray-300">
                <Link to="/blog" className="hover:underline hover:text-sky-600 transition-colors">
                  📝 Writings
                </Link>
                <Link
                  to="/projects"
                  className="hover:underline hover:text-sky-600 transition-colors"
                >
                  🛠️ Projects
                </Link>
                <Link to="/about" className="hover:underline hover:text-sky-600 transition-colors">
                  🧐 About
                </Link>
                <Link to="/about" className="hover:underline hover:text-sky-600 transition-colors">
                  💼 Career
                </Link>
              </nav>
            </article>
          </section>
        )}

        {/* Categories */}
        <section className="mb-16 lg:mb-24">
          <header className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-gray-200">
              Popular Tags
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-1">
              Most loved topics from my readers.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
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
              <p className="text-gray-500 dark:text-gray-400 text-center w-full">
                No categories available.
              </p>
            )}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <header className="mb-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-gray-200">
              Recent Posts
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-1">
              Latest insights and thoughts.
            </p>
          </header>

          {posts.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {posts.map((post) => (
                <CardPost
                  key={post.id}
                  date={post.date}
                  title={post.title}
                  content={post.content}
                  slug={post.slug}
                  category={post.category}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10">
              No posts available.
            </p>
          )}
        </section>
      </main>
    </LayoutWeb>
  );
}
