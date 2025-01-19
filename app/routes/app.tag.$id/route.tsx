import React, { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
// import { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import TagsForm from "~/components/TagsForm/TagsForm";
import type { Tag } from "~/@types/tag";
import { createTag, deleteTag, getTagById, updateTag } from "~/repositories/tagRepository.server";

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
  if (params?.id !== 'new') {
    const tagData = await getTagById(Number(params.id));
    return json({ tagData });
  }

  return json({ tagData: null });
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const tagId = body.get("id");
  const name = body.get("name")?.toString();

  switch (request.method) {
    case "POST": {
      const tag = await createTag({
        name
      });

      if (tag?.id) {
        // return json({ result: "ok", tagData: tag });

        return redirect("/app/tags/list");
      } else {
        return json({ error: "Error create tag data" });
      }
    }
    case "PUT": {
      const tag = await updateTag(Number(tagId),{
        name
      });

      if (tag?.id) {
        // return json({ result: "ok", tagData: tag });

        return redirect("/app/tags/list");
      } else {
        return json({ error: "Error update tag data" });
      }
    }
    case "DELETE": {
      const tag = await deleteTag(Number(tagId));

      if (tag?.id) {
        // return json({ result: "ok" });

        return redirect("/app/tags/list");
      } else {
        return json({ error: "Error delete tag" });
      }
    }
    default: {
      return json();
    }
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
  }, [actionData]);

  useEffect(() => {
    if (loaderData?.tagData?.id) {
      setTagData(loaderData.tagData);
    }
  }, [loaderData]);

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
      })
    }, [tagData, submit]);

  const handleEditTag = useCallback(() => {
      submit(tagData, {
        method: "PUT"
      })
    }, [tagData, submit]);

  const handleDeleteTag = useCallback(() => {
      submit({
        id: tagData?.id,
      }, {
        method: "DELETE"
      })
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
