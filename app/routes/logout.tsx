import { ActionFunction, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";

export let action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));

  return redirect("/app", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};
