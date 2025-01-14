import { ActionFunction, redirect, json } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";
import { createUser } from "~/repositories/userRepository.server";
import { hashPassword } from "~/utils/hash.server";

export async function action({ request }: { request: Request }) {
  const body = await request.formData();

  const firstName = body.get("firstName")?.toString();
  const lastName = body.get("lastName")?.toString();
  const email = body.get("email")?.toString();
  const password = body.get("password")?.toString();

  const hashPass = await hashPassword(password);

  const user = await createUser({
    firstName,
    lastName,
    email,
    password: hashPass
  });

  if (user) {
    const session = await sessionStorage.getSession(request.headers.get("cookie"));
    session.set("user", user);

    /** Save the session and redirect to the main page */
    throw redirect("/app", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } else {
    throw new Error("Create user error");
  }
}
