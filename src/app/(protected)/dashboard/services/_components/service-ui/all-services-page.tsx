import { getAllNews } from "../../news-action";
import { getEnabledCategories } from "../../../categories/categories-action";
import NewsList from "./news-list";

export default async function NewsListPage() {
  const [allNews, categories] = await Promise.all([
    getAllNews(),
    getEnabledCategories(),
  ]);

  return <NewsList allNews={allNews} categories={categories} />;
}
