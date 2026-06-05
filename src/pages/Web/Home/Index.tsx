import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Loading from "@/components/web/Loading";
import HomeAuthorSection from "@/features/web/home/components/HomeAuthorSection";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import WebCategoryPill from "@/features/web/shared/components/WebCategoryPill";
import WebPostListItem from "@/features/web/shared/components/WebPostListItem";
import WebSectionHeader from "@/features/web/shared/components/WebSectionHeader";
import type { WebCategory, WebPost, WebProfile } from "@/types/web";

export default function HomePage() {
  const [profile, setProfile] = useState<WebProfile | null>(null);
  const [categories, setCategories] = useState<WebCategory[]>([]);
  const [posts, setPosts] = useState<WebPost[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  document.title = "Home | Portfolio";

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profiles = await publicWebApi.getProfiles();
        if (isMounted) setProfile(profiles?.[0] || null);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const cats = await publicWebApi.getCategories();
        if (isMounted) setCategories(Array.isArray(cats) ? cats : []);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const postsData = await publicWebApi.getPostsHome();
        const safePosts = (Array.isArray(postsData) ? postsData : []).map((post, index) => ({
          id: post?.id ?? `post-${index}`,
          slug: post?.slug ?? "#",
          title: post?.title ?? "Untitled Post",
          content: typeof post?.content === "string" ? post.content : "",
          category: post?.category ?? null,
          created_at: post?.created_at ?? null,
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

      <header className="mx-auto mb-14 max-w-5xl pt-14 text-center md:mb-20 md:pt-20 lg:pt-24">
        <p className="mx-auto inline-flex rounded-full border border-sky-200 bg-sky-50/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-sky-200">
          Personal Web Journal
        </p>
        <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          Hello, folks! <br className="hidden sm:block" /> Discover my stories and creative ideas.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl">
          Explore thoughts, projects, and reflections in one fast, focused digital space.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Read writings
            <GoArrowRight className="text-base" />
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-white"
          >
            View projects
            <GoArrowRight className="text-base" />
          </Link>
        </div>
      </header>

      {profile && <HomeAuthorSection profile={profile} />}

      <section className="mb-16 lg:mb-24">
        <WebSectionHeader
          eyebrow="Topics"
          title="Popular Tags"
          description="Quick entry points into the topics I write about most often."
          action={{ label: "Explore blog", to: "/blog" }}
        />

        <div className="flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-4 md:gap-5">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <WebCategoryPill
                key={cat.id ?? cat.slug ?? index}
                name={cat.name || "Category"}
                image={cat.image || ""}
                slug={cat.slug || ""}
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
        <WebSectionHeader
          eyebrow="Latest"
          title="Recent Posts"
          description="Fresh notes, lessons, and practical thoughts from the blog."
          action={{ label: "View all posts", to: "/blog" }}
        />

        {posts.length > 0 ? (
          <ul className="grid gap-4">
            {posts.map((post) => (
              <WebPostListItem key={post.id} post={post} />
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">No posts available.</p>
        )}
      </section>
    </LayoutWeb>
  );
}
