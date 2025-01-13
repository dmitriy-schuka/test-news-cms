import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { PolarisProvider } from "~/components/providers/PolarisProvider";

// import styles from "@shopify/polaris/build/esm/styles.css";
import "@shopify/polaris/build/esm/styles.css";
import "./tailwind.css";

// export const loader = async ({ request }: { request: Request }) => {
//   const session = await sessionStorage.getSession(request.headers.get("cookie"));
//   const user = session.get("user");
//   return json({ user });
// };

export const links: LinksFunction = () => [
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  //   crossOrigin: "anonymous",
  // },
  // {
  //   rel: "stylesheet",
  //   href: styles,
  // },
  //   {
  //     rel: "stylesheet",
  //     href: "@shopify/polaris/build/esm/styles.css",
  //   },
  { rel: "stylesheet", href: "https://unpkg.com/@shopify/polaris/build/esm/styles.css" },
];

export default function App() {
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
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </PolarisProvider>
      </body>
    </html>
  );
}
