import { useCallback } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Page, InlineStack } from "@shopify/polaris";
import { getAllInjections } from "~/repositories/injectionRepository.server";
import InjectionsTable from "~/components/InjectionsTable/InjectionsTable";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  //await checkUserAuth(request);

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const sortOrder = url.searchParams.get("sort") as "asc" | "desc" ?? "asc";
  const sortColumn = url.searchParams.get("column") ?? "id";

  const fetchedInjections = await getAllInjections({
    page,
    sortOrder,
    sortColumn,
  });

  return json({ injectionsData: fetchedInjections });
};

export default function InjectionsList() {
  const { injectionsData } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleInjectionEdit = useCallback(
    (id: number) => {
      navigate(`/app/injection/${id}`)
    },
    [navigate],
  );

  return (
    <Page
      title={"Injections list"}
      primaryAction={{
        content: "Create injection",
        onAction: () => navigate('/app/injection/new'),
      }}
    >
      <InlineStack align={"center"}>
        <InjectionsTable
          injections={injectionsData?.injections}
          page={injectionsData?.page}
          handleInjectionEdit={handleInjectionEdit}
          sortDirection={injectionsData?.sortDirection}
          sortColumn={injectionsData?.sortColumn}
          hasNextPage={injectionsData?.hasNextPage}
          hasPreviousPage={injectionsData?.hasPreviousPage}
        />
      </InlineStack>
    </Page>
  );
}
