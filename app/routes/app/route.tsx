import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header/Header";
import { sessionStorage } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Latest world news" },
    { name: "description", content: "News from around the world." },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const user = session.get("user");

  return json({ user });
};

export default function App() {
  const { user } = useLoaderData();

  return (
    <div style={{paddingBottom: "50px"}}>
      <Header user={user}/>
      <Outlet />
    </div>
  );
}