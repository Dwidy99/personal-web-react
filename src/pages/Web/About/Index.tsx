import { useState, useEffect, useCallback } from "react"; // Added useCallback for consistency
import Api from "../../../services/Api";
import toast from "react-hot-toast";
import AccordionItem from "../../../components/general/AccordionItem";
import SEO from "../../../components/general/SEO";
import LayoutWeb from "../../../layouts/Web";

export default function Index() {
  const [profiles, setProfiles] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingExperiences, setLoadingExperiences] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  document.title = "About Dwi | Blogs";

  const toggle = useCallback(
    (index) => {
      // Wrapped in useCallback
      if (openIndex === index) {
        setOpenIndex(null);
      } else {
        setOpenIndex(index);
      }
    },
    [openIndex]
  ); // Dependency for useCallback

  // Format date to display as "Month Year"
  const formatDate = useCallback((dateString) => {
    // Wrapped in useCallback
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }, []); // No dependencies for useCallback

  const fetchDataProfiles = useCallback(async () => {
    // Wrapped in useCallback
    setLoadingProfiles(true);
    try {
      const response = await Api.get(`/api/public/profiles`);
      setProfiles(response.data.data[0]);
    } catch (error) {
      toast.error(`Failed to load profile data: ${error.message}`, {
        // Use error.message for cleaner output
        position: "top-center",
        duration: 5000,
      });
    } finally {
      setLoadingProfiles(false);
    }
  }, []); // No dependencies for useCallback

  const fetchDataExperiences = useCallback(async () => {
    // Wrapped in useCallback
    setLoadingExperiences(true);
    try {
      const response = await Api.get(`/api/public/experiences`);
      const sortedExperiences = response.data.data?.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      );
      setExperiences(sortedExperiences || []);
    } catch (error) {
      toast.error(`Failed to load experience data: ${error.message}`, {
        // Use error.message
        position: "top-center",
        duration: 5000,
      });
    } finally {
      setLoadingExperiences(false);
    }
  }, []); // No dependencies for useCallback

  const fetchDataContacts = useCallback(async () => {
    // Wrapped in useCallback
    setLoadingContacts(true);
    try {
      const response = await Api.get(`/api/public/contacts`);
      // Assuming response.data.data.data is correct based on your API structure
      setContacts(response.data.data.data);
    } catch (error) {
      toast.error(`Failed to load contact data: ${error.message}`, {
        // Use error.message
        position: "top-center",
        duration: 5000,
      });
    } finally {
      setLoadingContacts(false);
    }
  }, []); // No dependencies for useCallback

  useEffect(() => {
    fetchDataProfiles();
    fetchDataExperiences();
    fetchDataContacts();
  }, [fetchDataProfiles, fetchDataExperiences, fetchDataContacts]); // Added dependencies for useCallback

  useEffect(() => {
    if (experiences.length > 0) {
      setOpenIndex(0);
    }
  }, [experiences]);

  if (loadingProfiles || !profiles || loadingContacts) {
    return (
      <LayoutWeb>
        <div className="container mt-20 text-gray-600 dark:text-gray-300 text-center">
          {" "}
          {/* Added text-center here */}
          Loading profiles...
        </div>
      </LayoutWeb>
    );
  }

  return (
    <LayoutWeb>
      <SEO />
      <div className="container mx-auto px-4">
        {" "}
        {/* Added mx-auto and px-4 for better responsiveness */}
        <main className="mb-auto mt-20 lg:mx-25.5">
          <div className="about divide-y divide-gray-200 dark:divide-gray-700">
            {" "}
            {/* Dark mode divider */}
            {/* Title Section */}
            <div className="space-y-2 pb-8 pt-6 md:space-y-5">
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">
                {" "}
                {/* Dark mode text */}
                About
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400">
                {" "}
                {/* Dark mode text */}
                Further insights into who I am and the purpose of this blog.
              </p>
            </div>
            <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
              {/* Profile */}
              <div className="flex flex-col items-center pt-8 sm:pt-28">
                <div className="relative overflow-hidden h-48 w-48 rounded-full">
                  <img
                    alt={profiles.title}
                    loading="lazy"
                    width="192"
                    height="192"
                    className="transition-all object-cover object-center"
                    src={profiles.image}
                  />
                </div>
                <h3 className="pt-4 text-2xl text-gray-900 dark:text-gray-100">
                  {" "}
                  {/* Dark mode text */}
                  {profiles.name}
                </h3>
                <div className="text-gray-500 dark:text-gray-400">
                  {profiles.title}
                </div>{" "}
                {/* Dark mode text */}
                <ul className="flex flex-row mt-2 justify-between">
                  {contacts &&
                  Array.isArray(contacts) &&
                  contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700 dark:text-gray-400"
                      >
                        {contact.image ? (
                          <a
                            href={contact.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:underline"
                          >
                            {" "}
                            {/* block to make the whole area clickable */}
                            <div className="relative p-1 rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700">
                              {" "}
                              {/* Added relative and padding */}
                              <img
                                src={contact.image}
                                alt={contact.name}
                                className="w-10 h-10 object-cover mx-2 rounded-full color bg-teal-50"
                              />
                            </div>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            No Image
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No contacts available.
                    </p>
                  )}
                </ul>
              </div>

              {/* About & Experiences */}
              <div className="prose max-w-none xl:col-span-2 text-gray-800 dark:text-gray-300">
                {" "}
                {/* Applied base text color for the whole section */}
                <h2 className="mt-4 font-bold text-4xl text-gray-900 dark:text-gray-100">
                  {" "}
                  {/* Dark mode text */}
                  Hello, folks! 👋 I am {profiles.name}
                </h2>
                <div
                  className="custom-content-style prose dark:prose-invert max-w-none" // Rely on parent's text color for now, or add dark:prose-invert if you have that setup
                  dangerouslySetInnerHTML={{ __html: profiles.about }}
                />
                <h2 className="font-bold text-4xl text-gray-900 dark:text-gray-100">
                  {" "}
                  {/* Dark mode text */}
                  Why have this blog?
                </h2>
                <div
                  className="custom-content-style" // Rely on parent's text color
                  dangerouslySetInnerHTML={{ __html: profiles.description }}
                />
                {/* Assuming blogPurpose is an array of strings, apply text color to paragraphs */}
                {profiles.blogPurpose?.map((text, i) => (
                  <p key={i} className="">
                    {text}
                  </p> // Added mb-2 for spacing
                ))}
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {" "}
                    {/* Dark mode text */}
                    My Career
                  </h2>
                </div>
                {/* Experiences */}
                {loadingExperiences ? (
                  <div className="text-gray-600 dark:text-gray-300 mt-6">
                    {" "}
                    {/* Dark mode text */}
                    Loading experiences...
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {experiences.map((exp, index) => (
                      <AccordionItem
                        key={index}
                        exp={exp}
                        index={index}
                        isOpen={openIndex === index}
                        onClick={toggle}
                        formatDate={formatDate}
                        // Ensure AccordionItem itself handles dark mode for its internal elements
                      />
                    ))}
                  </ul>
                )}
                <hr className="border-gray-300 dark:border-gray-700" />{" "}
                {/* Dark mode border */}
                <div className="text-gray-800 dark:text-gray-200">
                  {" "}
                  {/* Added light mode text color, adjusted dark mode */}
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {" "}
                    {/* Dark mode text, changed from dark:text-gray-200 to gray-100 */}
                    Tech stack
                  </h2>
                  <div
                    className="custom-content-style prose dark:prose-invert max-w-none pb-8 xl:col-span-2" // Rely on parent's text color
                    dangerouslySetInnerHTML={{
                      __html: profiles.tech_description,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </LayoutWeb>
  );
}
