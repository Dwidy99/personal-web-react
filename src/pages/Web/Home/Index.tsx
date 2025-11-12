import { useState, useEffect } from "react";
import LayoutWeb from "../../../layouts/Web";
import LoadingTailwind from "../../../components/general/LoadingTailwind";
import Api from "../../../services/Api";
import CardCategory from "../../../components/general/CardCategory";
import RandomColors from "../../../utils/RandomColors"; // Import RandomColors
import CardPost from "../../../components/general/CardPost";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import SEO from "../../../components/general/SEO";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  document.title = "Dwi's | Blogs";

  const fetchDataPosts = async () => {
    setLoadingPosts(true);

    try {
      const response = await Api.get(`/api/public/posts_home`);

      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts data:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchDataProfiles = async () => {
    setLoadingProfiles(true);

    try {
      const response = await Api.get(`/api/public/profiles`);
      setProfiles(response.data.data.map((profile) => ({ ...profile })));
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const fetchDataCategories = async () => {
    setLoadingCategories(true);

    try {
      const response = await Api.get(`/api/public/categories`);

      if (Array.isArray(response.data.data)) {
        setCategories(
          response.data.data.map((category, index) => ({
            ...category,
            myId: index,
          }))
        );
      } else {
        toast.error("Data categories tidak berupa array:");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchDataProfiles();
    fetchDataCategories();
    fetchDataPosts();
  }, []);

  return (
    <LayoutWeb>
      <SEO />
      <div className="container">
        <h4 className="flex items-center text-center font-bold lg:my-22.5 xsm:mt-22.5 lg:mx-25.5">
          <strong className="text-slate-600 dark:text-sky-700 xsm:text-5xl lg:text-7xl">
            Hello, folks! Discover my stories and creative ideas.
          </strong>
        </h4>
      </div>

      {loadingProfiles ? (
        <LoadingTailwind />
      ) : (
        <div className="container">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="grid grid-cols-2 gap-2 justify-items-center lg:mx-22.5 xsm:grid-cols-1 items-center mb-6 lg:grid-cols-2"
              >
                <div className="max-w-96 xsm:order-2 lg:order-1">
                  <img
                    src={profile?.image}
                    alt={profile.title}
                    className="w-full rounded-3xl"
                  />
                </div>
                <div className="w-full xsm:order-1 xsm:p-5 lg:order-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Hi I am {profile.name} - {profile.caption}
                    </h3>
                    <div
                      className="custom-content-style"
                      dangerouslySetInnerHTML={{ __html: profile.content }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6 font-semibold my-4">
                    <div>
                      📝
                      <Link
                        to="/blog"
                        className="hover:underline text-gray-600"
                      >
                        My writings
                      </Link>
                    </div>
                    <div>
                      🛠️
                      <Link
                        to="/projects"
                        className="hover:underline text-gray-600"
                      >
                        What have I build
                      </Link>
                    </div>
                    <div>
                      🧐
                      <Link
                        to="/about"
                        className="hover:underline text-gray-600"
                      >
                        More about me and myself
                      </Link>
                    </div>
                    <div>
                      💼
                      <Link
                        to="/about"
                        className="hover:underline text-gray-600"
                      >
                        My Career
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No profiles available.
            </div>
          )}
        </div>
      )}

      <div className="container">
        <div className="lg:mx-22.5">
          <div className="text-lg font-bold">
            <h4 className="flex items-center">
              <strong className="text-slate-900 text-4xl dark:text-gray-500">
                Popular Tag
              </strong>
            </h4>
            <h4 className="mb-4 dark:text-slate-300">
              Popular tags feature the most widely favored topics.
            </h4>
            <hr />
          </div>
          {loadingCategories ? (
            <LoadingTailwind />
          ) : (
            <div className="flex flex-wrap justify-between py-3">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <CardCategory
                    key={index}
                    name={category.name}
                    image={category.image}
                    colorClass={RandomColors()}
                    slug={category.slug}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No Categories available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="text-lg font-bold mt-8 lg:mx-22.5">
          <h4 className="flex items-center">
            <strong className="text-slate-900 text-4xl dark:text-gray-500">
              Recent Posts
            </strong>
          </h4>
          <h4 className="mb-4 dark:text-slate-300">
            My desire to practice my skills and share my acquired knowledge
            fuels my endeavors.
          </h4>
          <hr />
        </div>
        <div className="lg:mx-22.5">
          {loadingPosts ? (
            <LoadingTailwind />
          ) : (
            <ul role="list" className="divide-y divide-gray-100">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <CardPost
                    key={index}
                    index={index}
                    image={post.image}
                    slug={post.slug}
                    title={post.title}
                    category={post.category} // 👈 ini
                    content={post.content}
                    date={post.created_at}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No posts available.
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </LayoutWeb>
  );
}
