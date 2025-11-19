import { useState, useEffect, useCallback } from "react";
import { publicService } from "../../../services/publicService";
import toast from "react-hot-toast";
import AccordionItem from "../../../components/general/AccordionItem";
import SEO from "../../../components/general/SEO";
import LayoutWeb from "../../../layouts/Web";
import Loader from "@/components/general/Loader";

export default function AboutPage() {
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState({
    profile: false,
    experiences: false,
    contacts: false,
  });

  document.title = "About | Portfolio Blogs";

  const toggle = useCallback(
    (index: number) => setOpenIndex(openIndex === index ? null : index),
    [openIndex]
  );

  const formatDate = useCallback((date: string | null) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading({ profile: true, experiences: true, contacts: true });
      try {
        const [profiles, exps, contactList] = await Promise.all([
          publicService.getProfiles(),
          publicService.getExperiences(),
          publicService.getContacts(),
        ]);
        setProfile(profiles[0]);
        setExperiences(
          exps.sort(
            (a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          )
        );
        setContacts(contactList);
      } catch (err: any) {
        toast.error("Failed to load About data: " + err.message);
      } finally {
        setLoading({ profile: false, experiences: false, contacts: false });
      }
    };
    fetchAll();
  }, []);

  if (loading.profile || !profile) {
    return (
      <LayoutWeb>
        <div className="container mt-20 text-center text-gray-600 dark:text-gray-300">
          <Loader />
        </div>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />
      <main className="container mx-auto px-6 sm:px-8 md:px-10 my-25">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Title Section */}
          <div className="space-y-3 pb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-sky-400">
              About Me
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              A closer look into my journey, experiences, and inspirations.
            </p>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col xl:grid xl:grid-cols-3 xl:gap-x-8">
            {/* === Left Profile Section === */}
            <div className="flex flex-col items-center my-10 text-center xl:items-start transition-colors duration-300">
              <img
                src={profile.image}
                alt={profile.name}
                className="h-48 w-48 rounded-full object-cover shadow-md dark:shadow-[0_4px_15px_rgba(56,189,248,0.15)] transition-all duration-300"
              />
              <h3 className="pt-4 text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {profile.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {profile.title}
              </p>

              {/* Social Contacts */}
              {/* Social Contacts */}
              <ul className="flex flex-wrap justify-center gap-3 mt-4">
                {contacts.map((c, i) => (
                  <li key={i}>
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-block"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="
            w-10 h-10 rounded-full 
            border border-gray-200 dark:border-gray-700 
            shadow-sm dark:bg-gray-3 dark:shadow-[0_0_10px_rgba(56,189,248,0.1)] 
            group-hover:scale-110 
            transition-all duration-300 ease-in-out 
            dark:group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]
          "
                      />
                      {/* Optional: subtle glow ring */}
                      <span
                        className="
            absolute inset-0 rounded-full 
            ring-0 group-hover:ring-2 
            ring-sky-400/50 dark:ring-sky-500/40 
            transition-all duration-300
          "
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* === About / Content Section === */}
            <div className="xl:col-span-2 mt-10 xl:mt-0 prose dark:prose-invert max-w-none transition-colors duration-300">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                Hello! 👋 I'm {profile.name}
              </h2>

              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: profile.about }}
              />

              <h2 className="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">
                Why this blog?
              </h2>
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: profile.description }}
              />

              <h2 className="text-3xl font-bold mt-8 mb-3 text-gray-900 dark:text-white">
                Career Journey
              </h2>
              {loading.experiences ? (
                <p className="text-gray-500 dark:text-gray-400">Loading experiences...</p>
              ) : (
                experiences.map((exp, i) => (
                  <AccordionItem
                    key={i}
                    exp={exp}
                    index={i}
                    isOpen={openIndex === i}
                    onClick={toggle}
                    formatDate={formatDate}
                  />
                ))
              )}

              <h2 className="text-3xl font-bold mt-8 mb-3 text-gray-900 dark:text-white">
                Tech Stack
              </h2>
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: profile.tech_description }}
              />
            </div>
          </div>
        </div>
      </main>
    </LayoutWeb>
  );
}
