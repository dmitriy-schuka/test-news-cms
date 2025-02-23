import { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
// import { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { checkUserAuth } from "~/utils/checkUserAuth.server";
import { checkIsArray, getFileNameFromUrl } from "~/utils/common";
import { getTags } from "~/repositories/tagRepository.server";
import { uploadFile } from "~/services/minio.server";
import { createNews, deleteNews, getNewsById, updateNews } from "~/repositories/newsRepository.server";
import NewsForm from "~/components/NewsForm/NewsForm";
import type { News } from "~/@types/news";

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
  // await checkUserAuth(request);

  const fetchedTags = await getTags();

  if (params?.id !== 'new' && params?.id !== 'null') {
    const newsData = await getNewsById(Number(params.id));

    return json({ newsData: newsData, tagsData: fetchedTags, });
  } else {
    return json({ newsData: null, tagsData: fetchedTags, });
  }
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  try {
    const user = await checkUserAuth(request);

    console.log('user in action:')
    console.log(user)

    const body = await request.formData();
    const newsId = body.get("id");
    const newsTitle = body.get("title")?.toString();
    const newsContent = body.get("content")?.toString();
    const isNewsPublished = body.get("published")?.toString();
    const newsTags = JSON.parse(body.get("tags") || "[]");
    const media = JSON.parse(body.get("media") || "[]");

    const newsFiles = body.getAll("files");

    let mediaUrl;
    let mediaType;

    if (checkIsArray(newsFiles) && newsFiles[0] instanceof File) {
      const uploadedFile = newsFiles[0];
      const fileName = uploadedFile?.name?.replaceAll(" ", "");
      mediaType = uploadedFile.type;

      const resUploadImage = await uploadFile(fileName, uploadedFile);
      console.log("resUploadImage:", resUploadImage);

      mediaUrl = `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${fileName}`;
    }

    switch (request.method) {
      case "POST": {
        const news = await createNews(
          {
            title: newsTitle,
            content: newsContent,
            published: isNewsPublished ? isNewsPublished === "true" : undefined,
            // userId: user?.id,
            userId: 1,
          },
          newsTags,
          {
            url: mediaUrl,
            mediaType: mediaType,
          },
        );

        if (news?.id) {
          return redirect("/app/news/list");
        } else {
          return json({ error: "Error creating news data" }, { status: 400 });
        }
      }
      case "PUT": {
        const news = await updateNews(
          Number(newsId),
          {
            title: newsTitle,
            content: newsContent,
            published: isNewsPublished ? isNewsPublished === "true" : undefined,
            // userId: user?.id,,
            userId: 1,
          },
          newsTags,
          {
            url: mediaUrl,
            mediaType: mediaType,
          },
          checkIsArray(media) ? media[0].id : null,
        );

        if (news?.id) {
          return redirect("/app/news/list");
        } else {
          return json({ error: "Error updating news data" }, { status: 400 });
        }
      }
      case "DELETE": {
        const oldMediaData = checkIsArray(media)
          ?
            {
              mediaName: getFileNameFromUrl(media[0]?.url),
              mediaId: media[0]?.id,
            }
          : null;

        const news = await deleteNews(
          Number(newsId),
          newsTags,
          oldMediaData,
        );

        if (news?.id) {
          return redirect("/app/news/list");
        } else {
          return json({ error: "Error deleting news" }, { status: 400 });
        }
      }
      default: {
        return json({ error: "Method not allowed" }, { status: 405 });
      }
    }
  } catch (err) {
    return json({ error: "Internal Server Error", message: err }, { status: 500 });
  }
};

export default function News() {
  const [newsData, setNewsData] = useState<News>({});
  const [actionError, setActionError] = useState<string | undefined>();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.error) {
      setActionError(actionData?.error);
    }

    if (actionData?.result) {
      // show some toast
    }
  }, [actionData, setActionError]);

  useEffect(() => {
    if (loaderData?.newsData?.id) {
      setNewsData(loaderData.newsData);
    }
  }, [loaderData, setNewsData]);

  const handleChange = useCallback(
    (newValue: string, fieldName: string) => {
      setNewsData((prevState) => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setNewsData],
  );

  const handleSubmit = useCallback((method: "POST" | "PUT", formData) => {
    submit(formData, { method, encType: "multipart/form-data" });
  }, [submit]);

  const prepareFormData = (newsData: News) => {
    const formData = new FormData();

    if (newsData.files) {
      newsData.files.forEach((file: File) => {
        formData.append(`files`, file, file.name);
      });
    }

    Object.keys(newsData).forEach((key) => {
      if (key !== "files") {
        if (checkIsArray(newsData[key])) {
          formData.append(key, JSON.stringify(newsData[key]));
        } else {
          formData.append(key, newsData[key] as string);
        }
      }
    });

    return formData;
  };

  const handleCreateNews = useCallback(() => {
    const formData = prepareFormData(newsData);
    handleSubmit("POST", formData);
  }, [newsData, handleSubmit, prepareFormData]);

  const handleEditNews = useCallback(() => {
    const formData = prepareFormData(newsData);
    handleSubmit("PUT", formData);
  }, [newsData, handleSubmit, prepareFormData]);

  const handleDeleteNews = useCallback(() => {
    const formData = new FormData();

    formData.append('id', newsData?.id);
    newsData.media && formData.append('media', JSON.stringify(newsData.media));

    submit(formData, { method: "DELETE", encType: "multipart/form-data" });
  }, [newsData, submit]);

  return (
    <Page
      title={"Create/edit news"}
      backAction={{
        content: 'Go back',
        onAction() {
          navigate(-1)
        }
      }}
    >
      <NewsForm
        newsData={newsData}
        handleChange={handleChange}
        tags={loaderData?.tagsData?.tags}
        handleCreateNews={handleCreateNews}
        handleEditNews={handleEditNews}
        handleDeleteNews={handleDeleteNews}
      />
    </Page>
  );
}
