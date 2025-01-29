import { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
// import { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Page, InlineStack } from "@shopify/polaris";
import { checkUserAuth } from "~/utils/checkUserAuth.server";
import type { News } from "~/@types/news";
import { deleteUser, getUserById, updateUser } from "~/repositories/userRepository.server";
import NewsTable from "~/components/NewsTable/NewsTable";
import { getNews } from "~/repositories/newsRepository.server";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  // const user = await checkUserAuth(request);
  // const fetchedUser = await getUserById(user?.id);
  //
  // return json({ user: fetchedUser });

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const newsTags = url.searchParams.get("newsTags") ?? "";

  const newsTagsArr = newsTags
    ?.split(',')
    ?.map((tag) => {
      return Number(tag);
    });

  const fetchedNews = await getNews(
    newsTags.length > 0
      ? newsTagsArr
      : [],
    {
      page,
      sortOrder: url.searchParams.get("sort") as "asc" | "desc",
      sortColumn: url.searchParams.get("column") ?? "id",
    }
  );

  return json({ newsData: fetchedNews });
};

export default function NewsList() {
  const { newsData } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  console.log('newsData in NewsList:')
  console.log(newsData)

  const handleNewsEdit = useCallback(
    (id: number) => {
      navigate(`/app/news/${id}`)
    },
    [navigate],
  );

  return (
    <Page
      title={"News list"}
      primaryAction={{
        content: "Create news",
        onAction: () => navigate('/app/news/new'),
      }}
    >
      <NewsTable
        news={newsData?.news}
        page={newsData?.page}
        handleNewsEdit={handleNewsEdit}
        sortDirection={newsData?.sortDirection}
        sortColumn={newsData?.sortColumn}
        hasNextPage={newsData?.hasNextPage}
        hasPreviousPage={newsData?.hasPreviousPage}
      />
    </Page>
  );
}
