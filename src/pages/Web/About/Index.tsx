// src/pages/Web/About/Index.tsx
import { useCallback, useEffect, useState } from "react";
import { FaLink, FaUser } from "react-icons/fa";

import LayoutWeb from "@/layouts/Web";
import SEO from "@/components/general/SEO";
import Loading from "@/components/web/Loading";
import AccordionItem from "@/components/general/AccordionItem";
import ContentRenderer from "@/components/general/ContentRenderer";
import { publicWebApi } from "@/features/web/shared/api/publicWebApi";
import WebSafeImage from "@/features/web/shared/components/WebSafeImage";
import type {
  WebContact,
  WebExperience,
  WebProfile,
} from "@/features/web/shared/types";

function formatMonthYear(date: string | null | undefined) {
  if (!date) return "Present";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Present";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function AboutPage() {
  document.title = "About | Portfolio";

  const [profile, setProfile] = useState<WebProfile | null>(null);
  const [experiences, setExperiences] = useState<WebExperience[]>([]);
  const [contacts, setContacts] = useState<WebContact[]>([]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [loading, setLoading] = useState({
    profile: true,
    experiences: true,
    contacts: true,
  });

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  // ---- Fetchers (same pattern vibe as Post/Index.tsx) ----
  const fetchProfile = useCallback(async () => {
    setLoading((p) => ({ ...p, profile: true }));
    try {
      const profiles = await publicWebApi.getProfiles();
      setProfile(profiles?.[0] ?? null);
    } catch (error) {
      console.error("Failed to load public profile:", error);
      setProfile(null);
    } finally {
      setLoading((p) => ({ ...p, profile: false }));
    }
  }, []);

  const fetchExperiences = useCallback(async () => {
    setLoading((p) => ({ ...p, experiences: true }));
    try {
      const list = await publicWebApi.getExperiences();

      const sorted = [...list].sort(
        (a, b) =>
          new Date(b.start_date || "").getTime() - new Date(a.start_date || "").getTime()
      );

      setExperiences(sorted);
    } catch (error) {
      console.error("Failed to load public experiences:", error);
      setExperiences([]);
    } finally {
      setLoading((p) => ({ ...p, experiences: false }));
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading((p) => ({ ...p, contacts: true }));
    try {
      const list = await publicWebApi.getContacts();
      setContacts(list);
    } catch (error) {
      console.error("Failed to load public contacts:", error);
      setContacts([]);
    } finally {
      setLoading((p) => ({ ...p, contacts: false }));
    }
  }, []);

  useEffect(() => {
    // parallel fetch, but each has its own loading flag
    fetchProfile();
    fetchExperiences();
    fetchContacts();
  }, [fetchProfile, fetchExperiences, fetchContacts]);

  const currentImage = profile?.image;
  const isBusy = loading.experiences || loading.contacts;

  if (loading.profile) {
    return (
      <LayoutWeb>
        <SEO />
        <Loading
          message="Loading about page..."
          variant="section"
          className="mt-24 min-h-[20rem]"
        />
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />

      {/* Header */}
      <header className="text-center">
        <h1 className="font-bold text-3xl mt-24 md:text-5xl mb-12 text-slate-700 dark:text-white">
          About Me
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          A closer look into my journey, experiences, and inspirations.
        </p>
      </header>

      {!profile ? (
        <div className="mt-12 rounded-xl border border-stroke dark:border-strokedark p-6 text-center">
          <p className="text-slate-600 dark:text-slate-300">Profile not found.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Please check the API response or seeded data.
          </p>
        </div>
      ) : (
        <section className="mt-10 md:mt-12">
          <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-12">
            {/* Left column: profile card */}
            <aside className="lg:col-span-4">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <WebSafeImage
                  src={currentImage}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover shadow-md transition-opacity"
                  fallbackClassName="h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-slate-100 text-slate-500 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
                  loading="eager"
                  maxRetries={8}
                >
                  <FaUser className="text-4xl" />
                </WebSafeImage>

                <h2 className="mt-4 text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                  {profile.name}
                </h2>

                {profile.title ? (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{profile.title}</p>
                ) : null}

                {/* Contacts */}
                <div className="mt-5 w-full">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                    Connect
                  </p>

                  {loading.contacts ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Loading contacts...
                    </p>
                  ) : contacts.length ? (
                    <ul className="flex flex-wrap justify-center lg:justify-start gap-3">
                      {contacts.map((c) => (
                        <li key={c.id}>
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 dark:border-gray-700 dark:bg-white"
                            aria-label={c.name}
                            title={c.name}
                          >
                            <WebSafeImage
                              src={c.image || "/no-image.png"}
                              alt={c.name}
                              className="h-7 w-7 object-contain transition-opacity group-hover:scale-105"
                              fallbackClassName="h-7 w-7 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-100 dark:text-slate-700"
                            >
                              <FaLink className="text-sm" />
                            </WebSafeImage>
                            <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-2 ring-sky-400/50 transition" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No contact links yet.
                    </p>
                  )}
                </div>
              </div>
            </aside>

            {/* Right column: content */}
            <article className="lg:col-span-8">
              <div className="rounded-2xl border border-stroke dark:border-strokedark bg-white dark:bg-boxdark p-6 sm:p-8 shadow-sm">
                {/* About */}
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                  Hello! I'm {profile.name}
                </h3>

                <ContentRenderer content={profile.about || ""} className="mt-4" />

                {/* Why */}
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-10">
                  Why this blog?
                </h3>
                <ContentRenderer content={profile.description || ""} className="mt-4" />

                {/* Career */}
                <div className="mt-10">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                      Career Journey
                    </h3>

                    {/* optional subtle status */}
                    {isBusy ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Syncing...</span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    {loading.experiences ? (
                      <p className="text-slate-500 dark:text-slate-400">
                        Loading experiences...
                      </p>
                    ) : experiences.length ? (
                      <div className="space-y-3">
                        {experiences.map((exp, i) => (
                          <AccordionItem
                            key={exp.id}
                            exp={exp}
                            index={i}
                            isOpen={openIndex === i}
                            onClick={toggle}
                            formatDate={(d) => formatMonthYear(d)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">
                        No experiences available.
                      </p>
                    )}
                  </div>
                </div>

                {/* Tech */}
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-10">
                  Tech Stack
                </h3>
                <ContentRenderer content={profile.tech_description || ""} className="mt-4" />
              </div>
            </article>
          </div>
        </section>
      )}
    </LayoutWeb>
  );
}
