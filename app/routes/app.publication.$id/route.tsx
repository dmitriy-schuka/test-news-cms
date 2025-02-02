import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { getNewsById } from "~/repositories/newsRepository.server";
import type { News } from "~/@types/news";
import NewsSingle from "~/components/NewsSingle/NewsSingle";

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
  let newsData = null;

  if (params?.id) {
     newsData = await getNewsById(Number(params.id));
  }

  return json({ newsData });
};

export default function Publication() {
  const [newsData, setNewsData] = useState<News>({});
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaderData?.newsData?.id) {
      setNewsData(loaderData.newsData);
    }
  }, [loaderData, setNewsData]);

  return (
    <Page
      title={newsData?.title}
      backAction={{
        content: 'Go back',
        onAction() {
          navigate(-1)
        }
      }}
    >
      <NewsSingle newsData={newsData}/>
    </Page>
  )
};