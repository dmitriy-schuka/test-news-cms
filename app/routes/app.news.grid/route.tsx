import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useSearchParams, useSubmit } from "@remix-run/react";
import { Box, Page, Layout, InlineStack, BlockStack, InlineGrid, Grid } from "@shopify/polaris";
import { sessionStorage } from "~/services/session.server";
import NewsGrid from "~/components/NewsGrid/NewsGrid";
import { useCallback, useEffect, useState } from "react";
import { getNews } from "~/repositories/newsRepository.server";
import { mainPageNewsLoader } from "~/loaders/newsLoader";

import SearchBar from "~/components/common/SearchBar/SearchBar";
import NewsMenu from "~/components/NewsMenu/NewsMenu";
import styles from "./styles.module.css";

export const loader = async ({ request }: { request: Request }) => {
  const fetchedNews = await mainPageNewsLoader(request);

  return json({ fetchedNews: fetchedNews });
};

export default function NewsMainPage() {
  const [newsData, setNewsData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const { fetchedNews } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  useEffect(() => {
    fetchedNews && setNewsData(fetchedNews);
  }, [setNewsData, fetchedNews]);

  // const handleSort = useCallback(
  //   (_: number, direction: "ascending" | "descending") => {
  //     const sort = direction === "ascending" ? "asc" : "desc";
  //     setSearchParams({ sort, column: "id", page: "1" });
  //   },
  //   [setSearchParams],
  // );

  const handleSort = useCallback(
    (column: string | undefined, direction: "asc" | "desc" | undefined) => {
      setSearchParams({ sort: direction || "desc", column: column || "id", page: "1" });
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(
    (column: string | undefined, value: string | undefined) => {
      setSearchParams({ searchColumn: column, searchValue: value });
    },
    [setSearchParams],
  );

  const handleFilterByTags = useCallback(
    (tags: string | undefined) => {
      setSearchParams({ newsTags: tags });
    },
    [setSearchParams],
  );

  const handleNextPage = useCallback(() => {
    setSearchParams({
      sort: newsData?.sortDirection,
      column: newsData?.sortColumn,
      page: String(newsData?.page + 1),
    });
  }, [newsData, setSearchParams]);

  const handlePrevPage = useCallback(() => {
    setSearchParams({
      sort: newsData?.sortDirection,
      column: newsData?.sortColumn,
      page: String(newsData?.page - 1),
    });
  }, [newsData, setSearchParams]);

  return (
    <Page
      title={"News"}
      titleHidden
      fullWidth
    >
      <div className={styles.NewsContent__container}>
        <NewsMenu
          handleSearch={handleSearch}
        />

        <NewsGrid
          news={newsData?.news}
          latestNews={newsData?.latestNews}
          onSort={handleSort}
          page={newsData?.page}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          hasNextPage={newsData?.hasNextPage}
          hasPrevPage={newsData?.hasPreviousPage}
          totalNews={newsData?.totalNews}
          handleFilterByTags={handleFilterByTags}
        />
      </div>
    </Page>
  );
}