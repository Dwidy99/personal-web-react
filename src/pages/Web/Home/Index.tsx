import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { GoArrowRight } from "react-icons/go";
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

type HomeCategory = {
  id?: number | string;
  slug?: string;
  name?: string;
  image?: string;
};

type HomePost = {
  id: number | string;
  slug: string;
  title: string;
  content: string;
  category: {
    name?: string;
  } | null;
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
    <div className="mx-auto min-h-[9.5rem] w-full rounded-lg border border-slate-200/80 bg-white/75 p-5 text-left shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06] sm:min-h-[8.5rem] sm:p-6 lg:mx-0">
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

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
  };
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-500 dark:text-sky-300">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
          {description}
        </p>
      </div>

      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-white"
        >
          {action.label}
          <GoArrowRight className="text-base" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<HomeCategory[]>([]);
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

      <section className="mb-[4.5rem] lg:mb-24">
        {profile && (
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-8 max-w-3xl text-center md:mx-0 md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-500 dark:text-sky-300">
                About the author
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                Hi, I am <span className="text-slate-900 dark:text-white">{profile.name}</span>
                {profile.caption ? ` - ${profile.caption}` : ""}
              </h2>
            </div>

            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] lg:gap-12">
              <article className="order-2 flex min-w-0 flex-col justify-center text-center md:order-1 md:text-left">
              <AutoTypingIntroText />

              <p className="pt-6 text-center text-lg font-semibold italic text-slate-800 underline underline-offset-4 dark:text-white sm:text-xl md:text-left">
                Happy Reading!!!
              </p>

              <nav className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-4 md:max-w-xl">
                <Link
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400 dark:hover:text-white"
                  to="/blog"
                >
                  Writings
                </Link>
                <Link
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400 dark:hover:text-white"
                  to="/projects"
                >
                  Projects
                </Link>
                <Link
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400 dark:hover:text-white"
                  to="/about"
                >
                  About
                </Link>
                <Link
                  className="rounded-full border border-slate-200 bg-white/70 px-4 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400 dark:hover:text-white"
                  to="/about"
                >
                  Career
                </Link>
              </nav>
            </article>

            {profile.image && (
              <figure className="order-1 flex min-w-0 justify-center md:order-2 md:justify-end lg:-ml-4 xl:-ml-8">
                <img
                  src={profile.image}
                  alt={profile.name || "Profile"}
                  className="aspect-[4/3] w-full max-w-[520px] rounded-lg object-cover shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl md:max-w-none lg:max-w-[680px]"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}
            </div>
          </div>
        )}
      </section>

      <section className="mb-16 lg:mb-24">
        <SectionHeader
          eyebrow="Topics"
          title="Popular Tags"
          description="Quick entry points into the topics I write about most often."
          action={{ label: "Explore blog", to: "/blog" }}
        />

        <div className="flex flex-wrap justify-center gap-3 sm:justify-start sm:gap-4 md:gap-5">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <CardCategory
                key={cat.id ?? cat.slug ?? index}
                name={cat.name || "Category"}
                image={cat.image || ""}
                colorClass="bg-slate-900"
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
        <SectionHeader
          eyebrow="Latest"
          title="Recent Posts"
          description="Fresh notes, lessons, and practical thoughts from the blog."
          action={{ label: "View all posts", to: "/blog" }}
        />

        {posts.length > 0 ? (
          <ul className="grid gap-4">
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
