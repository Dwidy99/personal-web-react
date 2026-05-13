import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
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

const HOME_AUTO_TYPING_LINES = [
  [
    "I started learning to code in 2016 when I started college.",
    "I landed my first job as an IT Operation BI Fast Payment in 2022.",
  ].join("\n\n"),
  [
    "I have a passion for JavaScript and website development.",
    "I started this blog to practice my skill and share my knowledge.",
  ].join("\n\n"),
];

function AutoTypingIntroText() {
  return (
    <div className="mx-auto mt-7 min-h-[9.5rem] w-full rounded-xl border border-slate-200/80 bg-white/70 p-5 text-left shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:min-h-[8.5rem] sm:p-6 lg:mx-0">
      <p className="whitespace-pre-line text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl">
        <Typewriter
          words={HOME_AUTO_TYPING_LINES}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={42}
          deleteSpeed={24}
          delaySpeed={1800}
        />
      </p>
    </div>
  );
}

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
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-14 xl:gap-16">
            <article className="min-w-0 space-y-5 px-2 text-center sm:px-4 md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white sm:text-3xl md:text-4xl">
                Hi, I am <span className="text-slate-900 dark:text-white">{profile.name}</span>
                {profile.caption ? ` - ${profile.caption}` : ""}
              </h2>

              <AutoTypingIntroText />

              <p className="pt-2 text-center text-lg font-semibold italic text-slate-800 underline underline-offset-4 dark:text-white sm:text-xl md:text-left">
                Happy Reading!!!
              </p>

              <nav className="mt-6 grid grid-cols-2 gap-3 font-medium text-gray-700 dark:text-gray-300 sm:grid-cols-4 sm:gap-6 md:max-w-xl">
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

            {profile.image && (
              <figure className="flex min-w-0 justify-center md:justify-end lg:-ml-6 xl:-ml-10">
                <img
                  src={profile.image}
                  alt={profile.name || "Profile"}
                  className="w-full max-w-[420px] rounded-lg object-cover shadow-md transition-shadow duration-300 hover:shadow-xl sm:max-w-[520px] md:max-w-none lg:max-w-[640px]"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}
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
