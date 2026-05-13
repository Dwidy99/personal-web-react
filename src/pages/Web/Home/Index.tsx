import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LayoutWeb from "../../../layouts/Web";
import { publicService } from "../../../services/publicService";
import CardCategory from "../../../components/general/CardCategory";
import CardPost from "../../../components/general/CardPost";
import SEO from "../../../components/general/SEO";
import Loading from "@/components/web/Loading";

type Profile = {
  image?: string;
  name?: string;
  caption?: string;
  content?: string;
};

type HomePost = {
  id: number | string;
  slug: string;
  title: string;
  content: string;
  category: any;
  date: string | null;
};

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  document.title = "Home | Portfolio";

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profiles = await publicService.getProfiles();
        if (isMounted) setProfile(profiles?.[0] || null);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const cats = await publicService.getCategories();
        if (isMounted) setCategories(Array.isArray(cats) ? cats : []);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const postsData = await publicService.getPostsHome();
        const safePosts = (Array.isArray(postsData) ? postsData : []).map((post, index) => ({
          id: post?.id ?? `post-${index}`,
          slug: post?.slug ?? "#",
          title: post?.title ?? "Untitled Post",
          content: typeof post?.content === "string" ? post.content : "",
          category: post?.category ?? null,
          date: post?.created_at ?? null,
        }));

        if (isMounted) setPosts(safePosts);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    };

    fetchProfile();
    fetchCategories();
    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = loadingProfile || loadingCategories || loadingPosts;

  if (isLoading) {
    return (
      <LayoutWeb>
        <SEO />
        <Loading message="Loading homepage..." variant="section" className="mt-24 min-h-[24rem]" />
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />

      <header className="mx-auto mb-12 max-w-4xl text-center md:mb-20">
        <h1 className="mt-24 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          Hello, folks! <br className="hidden sm:block" /> Discover my stories and creative ideas.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg md:text-xl">
          Explore thoughts, projects, and reflections in one fast, focused digital space.
        </p>
      </header>

      <section className="mb-16 lg:mb-24">
        {profile && (
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
            {profile.image && (
              <figure className="order-1 flex justify-center md:order-none">
                <img
                  src={profile.image}
                  alt={profile.name || "Profile"}
                  className="w-full max-w-[380px] rounded-lg object-cover shadow-md transition-shadow duration-300 hover:shadow-xl sm:max-w-[420px] md:max-w-[480px]"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}

            <article className="space-y-5 px-2 text-center md:text-left sm:px-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white sm:text-3xl md:text-4xl">
                Hi, I am <span className="text-slate-900 dark:text-white">{profile.name}</span>
                {profile.caption ? ` - ${profile.caption}` : ""}
              </h2>

              <div
                className="prose prose-sm max-w-none leading-relaxed text-gray-600 dark:prose-invert dark:text-gray-300 sm:prose-base md:prose-lg"
                dangerouslySetInnerHTML={{ __html: profile.content || "" }}
              />

              <nav className="mt-6 grid grid-cols-2 gap-3 font-medium text-gray-700 dark:text-gray-300 sm:grid-cols-4 sm:gap-6">
                <Link
                  className="transition-colors hover:text-slate-950 dark:hover:text-white"
                  to="/blog"
                >
                  Writings
                </Link>
                <Link
                  className="transition-colors hover:text-slate-950 dark:hover:text-white"
                  to="/projects"
                >
                  Projects
                </Link>
                <Link
                  className="transition-colors hover:text-slate-950 dark:hover:text-white"
                  to="/about"
                >
                  About
                </Link>
                <Link
                  className="transition-colors hover:text-slate-950 dark:hover:text-white"
                  to="/about"
                >
                  Career
                </Link>
              </nav>
            </article>
          </div>
        )}
      </section>

      <section className="mb-16 lg:mb-24">
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Popular Tags
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 md:text-base">
            Most loved topics from my readers.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <CardCategory
                key={cat.id ?? cat.slug ?? index}
                name={cat.name}
                image={cat.image}
                colorClass="bg-slate-900"
                slug={cat.slug}
              />
            ))
          ) : (
            <p className="w-full text-center text-gray-500 dark:text-gray-400">
              No categories available.
            </p>
          )}
        </div>
      </section>

      <section>
        <header className="mb-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Recent Posts
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 md:text-base">
            Latest insights and thoughts.
          </p>
        </header>

        {posts.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-900">
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
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">No posts available.</p>
        )}
      </section>
    </LayoutWeb>
  );
}
