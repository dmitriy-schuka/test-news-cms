import { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { checkUserAuth } from "~/utils/checkUserAuth.server";
import InjectionsForm from "~/components/InjectionsForm/InjectionsForm";
import { getNews } from "~/repositories/newsRepository.server";
import { checkIsArray } from "~/utils/common";
import {
  createInjection,
  deleteInjection,
  getInjectionById,
  updateInjection
} from "~/repositories/injectionRepository.server";
import { createUpdateSettings, getSettings } from "~/repositories/settingsRepository.server";

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
  // await checkUserAuth(request);

  const fetchedNews = await getNews();
  const fetchedSettings = await getSettings();

  if (params?.id !== 'new') {
    const injectionData = await getInjectionById(Number(params.id));

    return json({ injectionData: injectionData, settingsData: fetchedSettings, newsData: fetchedNews, });
  } else {
    return json({ injectionData: null, settingsData: fetchedSettings, newsData: fetchedNews, });
  }
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  try {
    // const user = await checkUserAuth(request);

    const formData = await request.formData();

    const injectionId = formData.get("id");
    const injectionType = formData.get("injectionType");
    const imageUrl = formData.get("imageUrl") || null;
    const linkUrl = formData.get("linkUrl") || null;
    const text = formData.get("text");
    const newsId = formData.get("newsId") ? Number(formData.get("newsId")) : null;
    const isDraft = formData.get("isDraft") === "true";
    const priority = formData.get("priority") ? Number(formData.get("priority")) : 0;
    const displayOn = formData.get("displayOn");
    const regex = formData.get("regex") || null;

    const settingsId = formData.get("settingsId") ? Number(formData.get("settingsId")) : 0;
    const listInjections = formData.get("listInjections") ? Number(formData.get("listInjections")) : null;
    const searchInjections = formData.get("searchInjections") ? Number(formData.get("searchInjections")) : null;

    switch (request.method) {
      case "POST": {
        const injection = await createInjection(
          {
            injectionType,
            imageUrl,
            linkUrl,
            text,
            isDraft,
            priority,
            displayOn,
            regex,
            newsId,
          },
        );

        await createUpdateSettings(
          settingsId,
          {
            listInjections,
            searchInjections,
          }
        );

        if (injection?.id) {
          break;
        } else {
          return json({ error: "Error creating injection data" });
        }
      }
      case "PUT": {
        const injection = await updateInjection(
          Number(injectionId),
          {
            injectionType,
            imageUrl,
            linkUrl,
            text,
            isDraft,
            priority,
            displayOn,
            regex,
            newsId,
          },
        );

        await createUpdateSettings(
          settingsId,
          {
            listInjections,
            searchInjections,
          }
        );

        if (injection?.id) {
          break;
        } else {
          return json({ error: "Error updating news data" });
        }
      }
      case "DELETE": {
        const injection = await deleteInjection(
          Number(injectionId),
        );

        if (injection?.id) {
          break;
        } else {
          return json({ error: "Error deleting news" });
        }
      }
      default: {
        return null;
      }
    }

    return redirect("/app/injections/list");
  } catch (err) {
    console.log('Error in news actions:')
    console.log(err)

    return null;
  }
};

export default function Injection() {
  const [injectionData, setInjectionData] = useState({});
  const [settingsData, setSettingsData] = useState({
    listInjections: 4,
    searchInjections: 4,
  });
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
    if (loaderData?.injectionData?.id) {
      setInjectionData(loaderData.injectionData);
    }

    if (loaderData?.settingsData?.id) {
      setSettingsData(loaderData.settingsData);
    }
  }, [loaderData, setInjectionData, setSettingsData]);

  const handleChange = useCallback(
    (newValue: string, fieldName: string) => {
      setInjectionData((prevState) => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setInjectionData],
  );

  const handleSettingsChange = useCallback(
    (newValue: string, fieldName: string) => {
      setSettingsData((prevState) => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setSettingsData],
  );

  const handleCreateInjection = useCallback(() => {
    const formData = new FormData();

    Object.keys(injectionData).forEach((key) => {
      formData.append(key, injectionData[key]);
    });

    Object.keys(settingsData).forEach((key) => {
      if (key === 'id') {
        formData.append('settingsId', settingsData[key]);
      } else {
        formData.append(key, settingsData[key]);
      }
    });

    submit(formData, { method: "POST", encType: "multipart/form-data" });
  }, [injectionData, settingsData, submit]);

  const handleEditInjection = useCallback(() => {
    const formData = new FormData();

    Object.keys(injectionData).forEach((key) => {
      formData.append(key, injectionData[key]);
    });

    Object.keys(settingsData).forEach((key) => {
      if (key === 'id') {
        formData.append('settingsId', settingsData[key]);
      } else {
        formData.append(key, settingsData[key]);
      }
    });

    submit(formData, { method: "PUT", encType: "multipart/form-data" });
  }, [injectionData, settingsData, submit]);

  const handleDeleteInjection = useCallback(() => {
    const formData = new FormData();

    formData.append('id', injectionData?.id);

    submit(formData, { method: "DELETE", encType: "multipart/form-data" });
  }, [injectionData, submit]);

  console.log('injectionData in Injection:')
  console.log(injectionData)

  const newsIds = checkIsArray(loaderData?.newsData?.news)
    && loaderData.newsData.news.map((news) => ({
      label: news?.title,
      value: news.id
    }));

  return (
    <Page
      title={"Create/edit injection"}
      backAction={{
        content: 'Go back',
        onAction() {
          navigate(-1)
        }
      }}
    >
      <InjectionsForm
        injectionData={injectionData}
        settingsData={settingsData}
        news={newsIds}
        handleChange={handleChange}
        handleSettingsChange={handleSettingsChange}
        handleCreateInjection={handleCreateInjection}
        handleEditInjection={handleEditInjection}
        handleDeleteInjection={handleDeleteInjection}
      />
    </Page>
  );
}
