import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import { PolarisProvider } from "~/components/providers/PolarisProvider";

import Header from "~/components/Header/Header";
import styles from "@shopify/polaris/build/esm/styles.css";
import "./tailwind.css";

export const loader = async ({ request }: { request: Request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  return json({ user });
};

export const links: LinksFunction = () => [
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  //   crossOrigin: "anonymous",
  // },
  {
    rel: "stylesheet",
    href: styles,
  },
  //   {
  //     rel: "stylesheet",
  //     href: "@shopify/polaris/build/esm/styles.css",
  //   },
];

export default function App() {
  const { user } = useLoaderData();

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <Meta />
        <Links />
      </head>
      <body>
        <PolarisProvider>
          <Header user={user} />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </PolarisProvider>
      </body>
    </html>
  );
}
