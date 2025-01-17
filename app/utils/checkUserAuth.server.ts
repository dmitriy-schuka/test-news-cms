import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";

export const checkUserAuth = async (request) => {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");

  if (!user) {
    throw redirect("/app");
  }

  return user;
}