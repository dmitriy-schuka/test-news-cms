import type { MetaFunction, LoaderFunction, json } from "@remix-run/node";
import { Card, Page, Button, TextField } from "@shopify/polaris";
import Header from "~/components/Header/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Page
      title={"Fox News"}
      fullWidth
      titleHidden
    >
      <Header />
      Hello!
    </Page>
  );
}
