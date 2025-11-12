import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function Index() {
  document.title = "Edit Configuration - My Portfolio";

  const navigate = useNavigate();
  const formRef = useRef(null);
  const token = Cookies.get("token");

  const [abbreviation, setAbbreviation] = useState("");
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [description, setDescription] = useState("");
  const [website_url, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [backup_email, setBackupEmail] = useState("");
  const [keywords, setKeywords] = useState("");
  const [meta_text, setMetaText] = useState("");
  const [google_map, setGoogleMap] = useState("");
  const [encryption, setEncryption] = useState("");
  const [link_text, setLinkText] = useState("");
  const [link_website, setLinkWebsite] = useState("");
  const [summary, setSummary] = useState("");

  const [site_name, setSiteName] = useState("");
  const [protocol, setProtocol] = useState("smtp");
  const [smtp_host, setSmtpHost] = useState("");
  const [smtp_port, setSmtpPort] = useState("");
  const [smtp_timeout, setSmtpTimeout] = useState("");
  const [smtp_user, setSmtpUser] = useState("");
  const [smtp_pass, setSmtpPass] = useState("");
  const [pagination, setPagination] = useState("");

  const [logo, setLogo] = useState("");
  const [icon, setIcon] = useState("");
  const [banner, setBanner] = useState("");

  const [previewLogo, setPreviewLogo] = useState("");
  const [previewIcon, setPreviewIcon] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");

  const [errors, setErrors] = useState([]);

  const user = JSON.parse(Cookies.get("user"));

  const fetchDataConfiguration = async () => {
    // Pastikan user dan token tersedia sebelum melakukan request
    if (!user?.id || !token) {
      toast.error("User authentication error!", { position: "top-center" });
      return;
    }

    try {
      const response = await Api.get(`/api/admin/configurations/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response?.data?.data;
      console.log("Banner " + data.banner);

      if (!data || Object.keys(data).length === 0) {
        toast.error("Configuration data not found!", {
          position: "top-center",
        });
        return;
      }

      setAbbreviation(data.abbreviation || "");
      setTagline(data.tagline || "");
      setAbout(data.about || "");
      setDescription(data.description || "");
      setWebsiteUrl(data.website_url || "");
      setEmail(data.email || "");
      setBackupEmail(data.backup_email || "");
      setKeywords(data.keywords || "");
      setMetaText(data.meta_text || "");
      setGoogleMap(data.google_map || "");
      setEncryption(data.encryption || "");
      setLinkText(data.link_text || "");
      setLinkWebsite(data.link_website || "");
      setSummary(data.summary || "");

      setSiteName(data.site_name || "");
      setProtocol(data.protocol || "smtp");
      setSmtpHost(data.smtp_host || "");
      setSmtpPort(data.smtp_port || "");
      setSmtpTimeout(data.smtp_timeout || "");
      setSmtpUser(data.smtp_user || "");
      setSmtpPass(data.smtp_pass || "");
      setPagination(data.pagination || "");

      setPreviewLogo(data.logo ? `${data.logo}` : "");
      setPreviewIcon(data.icon ? `${data.icon}` : "");
      setPreviewBanner(data.banner ? `${data.banner}` : "");
    } catch (error) {
      toast.error(`Failed to fetch configuration data: ${error}`, {
        position: "top-center",
      });
    }
  };

  const updateConfigurations = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("abbreviation", abbreviation);
    formData.append("tagline", tagline);
    formData.append("about", about);
    formData.append("description", description);
    formData.append("website_url", website_url);
    formData.append("email", email);
    formData.append("backup_email", backup_email);
    formData.append("keywords", keywords);
    formData.append("meta_text", meta_text);
    formData.append("google_map", google_map);
    formData.append("encryption", encryption);
    formData.append("link_text", link_text);
    formData.append("link_website", link_website);
    formData.append("summary", summary);

    formData.append("site_name", site_name);
    formData.append("protocol", protocol);
    formData.append("smtp_host", smtp_host);
    formData.append("smtp_port", smtp_port);
    formData.append("smtp_timeout", smtp_timeout);
    formData.append("smtp_user", smtp_user);
    formData.append("smtp_pass", smtp_pass);
    formData.append("pagination", pagination);

    if (logo) formData.append("logo", logo);
    if (icon) formData.append("icon", icon);
    if (banner) formData.append("banner", banner);

    formData.append("_method", "PUT");

    await Api.post(`/api/admin/configurations/${user.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
          duration: 6000,
        });
        console.log(response);

        navigate("/admin/configurations");
      })
      .catch((error) => {
        setErrors(error.response.data);
        console.log(error);
      });
  };

  const handleReset = () => {
    if (formRef.current) formRef.current.reset();
    setSiteName("");
    setProtocol("smtp");
    setSmtpHost("");
    setSmtpPort("");
    setSmtpTimeout("");
    setSmtpUser("");
    setSmtpPass("");
    setPagination("");

    setLogo(null);
    setIcon(null);
    setBanner(null);
    setErrors([]);
  };

  useEffect(() => {
    fetchDataConfiguration();
  }, []);

  return (
    <LayoutAdmin>
      <div className="rounded-lg border bg-white shadow-md mt-8 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Edit Configuration
        </h3>
        <form ref={formRef} onSubmit={updateConfigurations}>
          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                value={site_name}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Enter Site Name"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.site_name && (
                <p className="text-red-500 text-xs">{errors.site_name[0]}</p>
              )}
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Protocol / SMTP Mailer
              </label>
              <input
                type="text"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="smtp / mailgun / sendmail"
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {errors.protocol && (
                <p className="text-red-500 text-xs">{errors.protocol[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                SMTP Host
              </label>
              <input
                type="text"
                value={smtp_host}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.smtp_host && (
                <p className="text-red-500 text-xs">{errors.smtp_host[0]}</p>
              )}
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                SMTP Port
              </label>
              <input
                type="number"
                value={smtp_port}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.smtp_port && (
                <p className="text-red-500 text-xs">{errors.smtp_port[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                SMTP Timeout
              </label>
              <input
                type="number"
                value={smtp_timeout}
                onChange={(e) => setSmtpTimeout(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.smtp_timeout && (
                <p className="text-red-500 text-xs">{errors.smtp_timeout[0]}</p>
              )}
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                SMTP Username
              </label>
              <input
                type="text"
                value={smtp_user}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.smtp_user && (
                <p className="text-red-500 text-xs">{errors.smtp_user[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                SMTP Pass
              </label>
              <input
                type="text"
                value={smtp_pass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.smtp_pass && (
                <p className="text-red-500 text-xs">{errors.smtp_pass[0]}</p>
              )}
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Pagination
              </label>
              <input
                type="number"
                value={pagination}
                onChange={(e) => setPagination(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
              />
              {errors.pagination && (
                <p className="text-red-500 text-xs">{errors.pagination[0]}</p>
              )}
            </div>
          </div>

          {/* Upload logo, icon, banner */}
          {[
            ["Logo", previewLogo, setLogo, "logo"],
            ["Icon", previewIcon, setIcon, "icon"],
            ["Banner", previewBanner, setBanner, "banner"],
          ].map(([label, preview, setFile, name]) => (
            <div className="mb-6" key={name}>
              <label className="block text-sm font-bold text-gray-700">
                {label}
              </label>
              {preview && (
                <img
                  src={preview}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border rounded px-3 py-2"
              />
              {errors[name] && (
                <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Abbreviation
              </label>
              <input
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="Enter abbreviation"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="Enter tagline"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                About
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                rows={3}
                placeholder="About description"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                rows={3}
                placeholder="Site description"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Website URL
              </label>
              <input
                type="text"
                value={website_url}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="https://example.com"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Backup Email
              </label>
              <input
                type="email"
                value={backup_email}
                onChange={(e) => setBackupEmail(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="backup@example.com"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Meta Text
              </label>
              <textarea
                value={meta_text}
                onChange={(e) => setMetaText(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                rows={3}
                placeholder="Meta description"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Google Map Embed
              </label>
              <textarea
                value={google_map}
                onChange={(e) => setGoogleMap(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                rows={3}
                placeholder="<iframe> embed code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Encryption
              </label>
              <input
                type="text"
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="tls / ssl"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Link Text
              </label>
              <input
                type="text"
                value={link_text}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="Link label"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 my-4">
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Link Website
              </label>
              <input
                type="text"
                value={link_website}
                onChange={(e) => setLinkWebsite(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                placeholder="https://linkwebsite.com"
              />
            </div>
            <div className="basis-128">
              <label className="block text-sm font-bold text-gray-700">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300"
                rows={3}
                placeholder="Short summary"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex mt-5.5 items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-500 focus:outline-none"
            >
              <i className="fa-solid fa-save mr-2"></i> Save
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none"
            >
              <i className="fa-solid fa-redo mr-2"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </LayoutAdmin>
  );
}
