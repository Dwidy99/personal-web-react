import { lazy, Suspense, useEffect, type LazyExoticComponent } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Loader from "../components/general/Loader";
import PrivateRoutes from "./PrivateRoutes";

type PageComponent = LazyExoticComponent<() => JSX.Element>;

const Dashboard = lazy(() => import("../pages/Admin/Dashboard/Index"));
const PermissionsIndex = lazy(() => import("../pages/Admin/Permissions/Index"));
const RolesIndex = lazy(() => import("../pages/Admin/Roles/Index"));
const RolesCreate = lazy(() => import("../pages/Admin/Roles/Create"));
const RolesEdit = lazy(() => import("../pages/Admin/Roles/Edit"));
const UsersIndex = lazy(() => import("../pages/Admin/Users/Index"));
const UsersCreate = lazy(() => import("../pages/Admin/Users/Create"));
const UsersEdit = lazy(() => import("../pages/Admin/Users/Edit"));
const ProfilesIndex = lazy(() => import("../pages/Admin/Profiles/Index"));
const CategoriesIndex = lazy(() => import("../pages/Admin/Categories/Index"));
const CategoriesCreate = lazy(() => import("../pages/Admin/Categories/Create"));
const CategoriesEdit = lazy(() => import("../pages/Admin/Categories/Edit"));
const PostsIndex = lazy(() => import("../pages/Admin/Posts/Index"));
const PostsCreate = lazy(() => import("../pages/Admin/Posts/Create"));
const PostEdit = lazy(() => import("../pages/Admin/Posts/Edit"));
const ProjectsIndex = lazy(() => import("../pages/Admin/Projects/Index"));
const ProjectsCreate = lazy(() => import("../pages/Admin/Projects/Create"));
const ProjectsEdit = lazy(() => import("../pages/Admin/Projects/Edit"));
const ExperiencesIndex = lazy(() => import("../pages/Admin/Experiences/Index"));
const ExperiencesCreate = lazy(() => import("../pages/Admin/Experiences/Create"));
const ExperiencesEdit = lazy(() => import("../pages/Admin/Experiences/Edit"));
const ContactsIndex = lazy(() => import("../pages/Admin/Contacts/Index"));
const ContactsCreate = lazy(() => import("../pages/Admin/Contacts/Create"));
const ContactsEdit = lazy(() => import("../pages/Admin/Contacts/Edit"));
const ConfigurationsIndex = lazy(() => import("../pages/Admin/Configurations/Index"));

const Login = lazy(() => import("../pages/Auth/Login"));
const Forgot = lazy(() => import("../pages/Auth/Forgot"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const Forbidden = lazy(() => import("../pages/Auth/Forbidden"));

const Home = lazy(() => import("../pages/Web/Home/Index"));
const BlogsIndex = lazy(() => import("../pages/Web/Post/Index"));
const BlogsShow = lazy(() => import("../pages/Web/Post/Show"));
const CategoryPostsIndex = lazy(() => import("../pages/Web/Post/PostByCategory"));
const AboutIndex = lazy(() => import("../pages/Web/About/Index"));
const ProjectsHome = lazy(() => import("../pages/Web/Project/Index"));
const ProjectShow = lazy(() => import("../pages/Web/Project/Show"));

function withLoader(Component: PageComponent) {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
}

function withPrivateLoader(Component: PageComponent) {
  return <PrivateRoutes>{withLoader(Component)}</PrivateRoutes>;
}

export default function RoutesIndex() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={withLoader(Home)} />

      <Route path="/admin/dashboard" element={withPrivateLoader(Dashboard)} />
      <Route path="/admin/permissions" element={withPrivateLoader(PermissionsIndex)} />
      <Route path="/admin/roles" element={withPrivateLoader(RolesIndex)} />
      <Route path="/admin/roles/create" element={withPrivateLoader(RolesCreate)} />
      <Route path="/admin/roles/edit/:id" element={withPrivateLoader(RolesEdit)} />
      <Route path="/admin/users" element={withPrivateLoader(UsersIndex)} />
      <Route path="/admin/users/create" element={withPrivateLoader(UsersCreate)} />
      <Route path="/admin/users/edit/:id" element={withPrivateLoader(UsersEdit)} />
      <Route path="/admin/profiles/" element={withPrivateLoader(ProfilesIndex)} />
      <Route path="/admin/categories" element={withPrivateLoader(CategoriesIndex)} />
      <Route path="/admin/categories/create" element={withPrivateLoader(CategoriesCreate)} />
      <Route path="/admin/categories/edit/:id" element={withPrivateLoader(CategoriesEdit)} />
      <Route path="/admin/posts" element={withPrivateLoader(PostsIndex)} />
      <Route path="/admin/posts/create" element={withPrivateLoader(PostsCreate)} />
      <Route path="/admin/posts/edit/:id" element={withPrivateLoader(PostEdit)} />
      <Route path="/admin/projects" element={withPrivateLoader(ProjectsIndex)} />
      <Route path="/admin/projects/create" element={withPrivateLoader(ProjectsCreate)} />
      <Route path="/admin/projects/edit/:id" element={withPrivateLoader(ProjectsEdit)} />
      <Route path="/admin/experiences" element={withPrivateLoader(ExperiencesIndex)} />
      <Route path="/admin/experiences/create" element={withPrivateLoader(ExperiencesCreate)} />
      <Route path="/admin/experiences/edit/:id" element={withPrivateLoader(ExperiencesEdit)} />
      <Route path="/admin/contacts" element={withPrivateLoader(ContactsIndex)} />
      <Route path="/admin/contacts/create" element={withPrivateLoader(ContactsCreate)} />
      <Route path="/admin/contacts/edit/:id" element={withPrivateLoader(ContactsEdit)} />
      <Route path="/admin/configurations" element={withPrivateLoader(ConfigurationsIndex)} />

      <Route path="/login" element={withLoader(Login)} />
      <Route path="/forgot-password" element={withLoader(Forgot)} />
      <Route path="/reset-password/:token" element={withLoader(ResetPassword)} />
      <Route path="/forbidden" element={withLoader(Forbidden)} />

      <Route path="/blog" element={withLoader(BlogsIndex)} />
      <Route path="/blog/:slug" element={withLoader(BlogsShow)} />
      <Route path="/blog/category/:slug" element={withLoader(CategoryPostsIndex)} />
      <Route path="/about" element={withLoader(AboutIndex)} />
      <Route path="/projects" element={withLoader(ProjectsHome)} />
      <Route path="/projects/:slug" element={withLoader(ProjectShow)} />
    </Routes>
  );
}
