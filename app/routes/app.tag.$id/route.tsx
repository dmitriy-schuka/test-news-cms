import React, { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import TagsForm from "~/components/TagsForm/TagsForm";
import type { Tag } from "~/@types/tag";
import { createTag, deleteTag, getTagById, updateTag } from "~/repositories/tagRepository.server";

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
  // TODO: uncomment for production
  // await checkUserAuth(request);

  if (params?.id !== 'new') {
    const tagData = await getTagById(Number(params.id));
    return json({ tagData });
  }

  return json({ tagData: null });
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData();

    const tagId = body.get("id");
    const tagName = body.get("name")?.toString();

    switch (request.method) {
      case "POST": {
        const tag = await createTag({
          name: tagName,
        });

        if (tag?.id) {
          return redirect("/app/tags/list");
        } else {
          return json({ error: "Error create tag data" }, { status: 400 });
        }
      }
      case "PUT": {
        const tag = await updateTag(Number(tagId),{
          name: tagName,
        });

        if (tag?.id) {
          return redirect("/app/tags/list");
        } else {
          return json({ error: "Error update tag data" }, { status: 400 });
        }
      }
      case "DELETE": {
        const tag = await deleteTag(Number(tagId));

        if (tag?.id) {
          return redirect("/app/tags/list");
        } else {
          return json({ error: "Error delete tag" }, { status: 400 });
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

export default function TagsCreate() {
  const [tagData, setTagData] = useState<Tag>({});
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
    if (loaderData?.tagData?.id) {
      setTagData(loaderData.tagData);
    }
  }, [loaderData, setTagData]);

  const handleChange = useCallback(
    (newValue: string, fieldName: string) => {
      setTagData((prevState) => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setTagData],
  );

  const handleCreateTag = useCallback(() => {
      submit(tagData, {
        method: "POST"
      });
    }, [tagData, submit]);

  const handleEditTag = useCallback(() => {
      submit(tagData, {
        method: "PUT"
      });
    }, [tagData, submit]);

  const handleDeleteTag = useCallback(() => {
      submit({
        id: tagData?.id,
      }, {
        method: "DELETE"
      });
    }, [tagData, submit]);

  return (
    <Page
      title={"Create/edit tag"}
      backAction={{
        content: 'Go back',
        onAction() {
          navigate(-1)
        }
      }}
    >
      <TagsForm
        tagData={tagData}
        handleChange={handleChange}
        handleCreateTag={handleCreateTag}
        handleEditTag={handleEditTag}
        handleDeleteTag={handleDeleteTag}
      />
    </Page>
  );
}
