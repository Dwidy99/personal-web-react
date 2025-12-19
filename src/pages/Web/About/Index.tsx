// src/pages/Web/About/Index.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import LayoutWeb from "../../../layouts/Web";
import SEO from "../../../components/general/SEO";
import Loader from "@/components/general/Loader";
import AccordionItem from "../../../components/general/AccordionItem";
import { publicService } from "../../../services/publicService";

import type { Experience as ExperienceItem } from "@/types/experience";

// ---- Types (simple & beginner-friendly) ----
type Profile = {
  id: number;
  name: string;
  title?: string;
  image?: string;
  about?: string;
  description?: string;
  tech_description?: string;
};

type Experience = {
  id: number;
  title?: string;
  company?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
  // keep it open if AccordionItem expects more fields
  [key: string]: any;
};

type Contact = {
  id: number;
  name: string;
  link: string;
  image?: string;
};

function formatMonthYear(date: string | null | undefined) {
  if (!date) return "Present";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Present";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function AboutPage() {
  document.title = "About | Portfolio";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [loading, setLoading] = useState({
    profile: true,
    experiences: true,
    contacts: true,
  });

  const isBusy = useMemo(
    () => loading.profile || loading.experiences || loading.contacts,
    [loading]
  );

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  // ---- Fetchers (same pattern vibe as Post/Index.tsx) ----
  const fetchProfile = useCallback(async () => {
    setLoading((p) => ({ ...p, profile: true }));
    try {
      const profiles = await publicService.getProfiles();
      setProfile((profiles?.[0] as Profile) ?? null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading((p) => ({ ...p, profile: false }));
    }
  }, []);

  const fetchExperiences = useCallback(async () => {
    setLoading((p) => ({ ...p, experiences: true }));
    try {
      const res = await publicService.getExperiences();

      // kalau service kamu return array langsung:
      const list = (res as ExperienceItem[]) ?? [];

      // kalau service kamu return ExperienceResponse:
      // const list = (res?.data as ExperienceItem[]) ?? [];

      const sorted = [...list].sort(
        (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );

      setExperiences(sorted);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load experiences");
      setExperiences([]);
    } finally {
      setLoading((p) => ({ ...p, experiences: false }));
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading((p) => ({ ...p, contacts: true }));
    try {
      const list = await publicService.getContacts();
      setContacts((list as Contact[]) ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load contacts");
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

  const currentImage = profile?.image || "/no-image.png";

  return (
    <LayoutWeb>
      <SEO />

      {/* Header */}
      <header className="text-center">
        <h1 className="font-bold text-3xl mt-24 md:text-5xl mb-12 text-slate-700 dark:text-sky-400">
          About Me
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          A closer look into my journey, experiences, and inspirations.
        </p>
      </header>

      {/* Global loading (first load) */}
      {loading.profile && !profile ? (
        <div className="mt-12 flex justify-center">
          <Loader />
        </div>
      ) : !profile ? (
        <div className="mt-12 rounded-xl border border-stroke dark:border-strokedark p-6 text-center">
          <p className="text-slate-600 dark:text-slate-300">Profile not found.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Please check the API response or seeded data.
          </p>
        </div>
      ) : (
        <section className="mt-10 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Left column: profile card */}
            <aside className="lg:col-span-8">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <img
                  src={currentImage}
                  alt={profile.name}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover shadow-md"
                />

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
                    <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
                  ) : contacts.length ? (
                    <ul className="flex flex-wrap justify-center lg:justify-start gap-3">
                      {contacts.map((c) => (
                        <li key={c.id}>
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex"
                            aria-label={c.name}
                            title={c.name}
                          >
                            <img
                              src={c.image || "/no-image.png"}
                              alt={c.name}
                              className="w-10 h-10 rounded-full border border-stroke dark:border-strokedark object-cover group-hover:scale-105 transition"
                            />
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

                <div
                  className="prose dark:prose-invert max-w-none mt-4"
                  dangerouslySetInnerHTML={{ __html: profile.about || "" }}
                />

                {/* Why */}
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-10">
                  Why this blog?
                </h3>
                <div
                  className="prose dark:prose-invert max-w-none mt-4"
                  dangerouslySetInnerHTML={{ __html: profile.description || "" }}
                />

                {/* Career */}
                <div className="mt-10">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                      Career Journey
                    </h3>

                    {/* optional subtle status */}
                    {isBusy ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Syncing…</span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    {loading.experiences ? (
                      <p className="text-slate-500 dark:text-slate-400">Loading experiences...</p>
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
                <div
                  className="prose dark:prose-invert max-w-none mt-4"
                  dangerouslySetInnerHTML={{ __html: profile.tech_description || "" }}
                />
              </div>
            </article>
          </div>
        </section>
      )}
    </LayoutWeb>
  );
}
