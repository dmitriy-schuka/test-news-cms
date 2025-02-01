import { ActionFunction, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));

  return redirect("/app/news/grid", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};
