import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import type { WebProfile } from "@/types/web";

type HomeAuthorSectionProps = {
  profile: WebProfile;
};

const AUTO_TYPING_PARAGRAPHS = [
  [
    "I started learning to code in 2016 when I started college.",
    "I landed my first job as an IT Operation BI Fast Payment in 2022.",
  ].join("\n\n"),
  [
    "I have a passion for JavaScript and website development.",
    "I started this blog to practice my skill and share my knowledge.",
  ].join("\n\n"),
];

function HomeQuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      className="rounded-full border border-slate-200 bg-white/70 px-4 py-3 text-center transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-400 dark:hover:text-white"
      to={to}
    >
      {label}
    </Link>
  );
}

export default function HomeAuthorSection({ profile }: HomeAuthorSectionProps): JSX.Element {
  return (
    <section className="mb-[4.5rem] lg:mb-24">
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
          <article className="order-2 grid min-w-0 gap-6 text-center md:order-1 md:text-left">
            <div className="mx-auto min-h-[9.5rem] w-full rounded-lg border border-slate-200/80 bg-white/75 p-5 text-left shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06] sm:min-h-[8.5rem] sm:p-6 lg:mx-0">
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl">
                <Typewriter
                  words={AUTO_TYPING_PARAGRAPHS}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={42}
                  deleteSpeed={24}
                  delaySpeed={1800}
                />
              </p>
            </div>

            <p className="text-center text-lg font-semibold italic text-slate-800 underline underline-offset-4 dark:text-white sm:text-xl md:text-left">
              Happy Reading!!!
            </p>

            <nav className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-4 md:max-w-xl">
              <HomeQuickLink to="/blog" label="Writings" />
              <HomeQuickLink to="/projects" label="Projects" />
              <HomeQuickLink to="/about" label="About" />
              <HomeQuickLink to="/about" label="Career" />
            </nav>
          </article>

          {profile.image && (
            <figure className="order-1 grid min-w-0 place-items-center md:order-2 md:place-items-end lg:-ml-4 xl:-ml-8">
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
    </section>
  );
}
