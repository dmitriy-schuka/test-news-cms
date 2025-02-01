import { getMainPageNews, getNews } from "~/repositories/newsRepository.server";

const prepareNewsQuery = (request) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const newsTags = url.searchParams.get("newsTags") ?? "";

  const newsTagsArr = newsTags
    ?.split(',')
    ?.map((tag) => {
      return Number(tag);
    });

  return [
    newsTags.length > 0
      ? newsTagsArr
      : [],
    {
      page,
      sortOrder: url.searchParams.get("sort") as "asc" | "desc",
      sortColumn: url.searchParams.get("column") ?? "id",
    }
  ];
}

export const newsLoader = async (request) => {
  return await getNews(...prepareNewsQuery(request));
};

export const mainPageNewsLoader = async (request) => {
  return await getMainPageNews(...prepareNewsQuery(request));
};