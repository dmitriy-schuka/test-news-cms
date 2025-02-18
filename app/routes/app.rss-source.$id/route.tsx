import { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { Page, Button, TextField, Card, Checkbox } from "@shopify/polaris";
import {
  getRssSourceById,
  createRssSource,
  updateRssSource,
  deleteRssSource
} from "~/repositories/rssSourceRepository.server";
import { RssSource } from "~/@types/rssSource";

export const loader: LoaderFunction = async ({ params }) => {
  const rssSource = params?.id !== "new" ? await getRssSourceById(Number(params.id)) : null;
  return json({ rssSourceData: rssSource });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = formData.get("id");
  const name = formData.get("name")?.toString();
  const url = formData.get("url")?.toString();
  const isActive = formData.get("isActive") === "true";
  const fieldMapping = JSON.parse(formData.get("fieldMapping") || "{}");
  const stopTags = JSON.parse(formData.get("stopTags") || "[]");
  const importInterval = Number(formData.get("importInterval")) || 60;

  try {
    switch (request.method) {
      case "POST": {
        await createRssSource({ name, url, isActive, fieldMapping, stopTags, importInterval });
        return redirect("/app/rss-sources/list");
      }
      case "PUT": {
        await updateRssSource(Number(id), { name, url, isActive, fieldMapping, stopTags, importInterval });
        return redirect("/app/rss-sources/list");
      }
      case "DELETE": {
        await deleteRssSource(Number(id));
        return redirect("/app/rss-sources/list");
      }
      default:
        return null;
    }
  } catch (err) {
    return json({ error: "Error processing request" }, { status: 400 });
  }
};

export default function RssSourceForm() {
  const [rssData, setRssData] = useState<RssSource>({});
  const [fieldMapping, setFieldMapping] = useState(JSON.stringify(rssData?.fieldMapping || {}));
  const [stopTags, setStopTags] = useState(JSON.stringify(rssData?.stopTags || []));
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaderData?.rssSourceData?.id) {
      setRssData(loaderData.rssSourceData);
    }
  }, [loaderData, setRssData]);

  const handleChange = useCallback(
    (newValue: string, fieldName: string) => {
      setRssData((prevState) => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setRssData],
  );

  return (
    <Page
      title={rssData?.id ? "Edit RSS Source" : "Create RSS Source"}
      backAction={{ content: "Go back", onAction: () => navigate(-1) }}
    >
      <Form method={rssData?.id ? "put" : "post"}>
        <Card sectioned>
          {
            actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>
          }
          {
            rssData?.id && <input type="hidden" name="id" value={rssData.id} />
          }
          <TextField
            label="Name"
            name="name"
            value={rssData?.name}
            onChange={(value) => handleChange(value, "name")}
            autoComplete="off"
          />
          <TextField
            label="URL"
            name="url"
            value={rssData?.url}
            onChange={(value) => handleChange(value, "url")}
            autoComplete="off"
          />
          <TextField
            label="Import Interval (minutes)"
            name="importInterval"
            type="number"
            value={rssData?.importInterval?.toString()}
            onChange={(value) => handleChange(value, "importInterval")}
            autoComplete="off"
          />
          <Checkbox
            label="Active"
            name="isActive"
            checked={rssData?.isActive}
            onChange={(value) => handleChange(value, "isActive")}
          />
          <TextField
            label="Field Mapping (JSON)"
            name="fieldMapping"
            value={fieldMapping}
            onChange={setFieldMapping}
            autoComplete="off"
            multiline
          />
          <TextField
            label="Stop Tags (JSON)"
            name="stopTags"
            value={stopTags}
            onChange={setStopTags}
            autoComplete="off"
            multiline
          />
        </Card>

        <Button submit primary>
          {rssData?.id ? "Update" : "Create"}
        </Button>

        {
          rssData?.id &&
            <Button destructive type="submit" formAction="delete">
              Delete
            </Button>
        }
      </Form>
    </Page>
  );
};
