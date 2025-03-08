import { getAllBlogs } from "./_components/blog-ui/blog-action";
import BlogList from "./_components/blog-ui/blog-list";
import { getAllCategories } from "../categories/categories-action";

export const metadata = {
  title: "Dashboard : Blog Management",
};

export default async function BlogListPage() {
  const [allBlogs, categories] = await Promise.all([
    getAllBlogs(),
    getAllCategories(),
  ]);

  return <BlogList allBlogs={allBlogs} categories={categories} />;
}