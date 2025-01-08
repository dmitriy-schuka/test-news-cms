import React from 'react';
import { Form } from "@remix-run/react";
import { Button, Avatar } from "@shopify/polaris";

const UserMenu = ({ user }: { user: { email: string, name: string } | null }) => {
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
    : "U";

  if (user) {
    return (
      <Form method="post" action="/logout">
        <Button variant={"plain"} submit>
          {/*<Avatar initials={user.email[0].toUpperCase()} name={user.name} size={"xl"} />*/}
          <Avatar initials={initials} name={user.name || "User"} size={"xl"} />
        </Button>
      </Form>
    );
  }

  return (
    <Button variant={"plain"} /*href="/login"*/>
      <Avatar customer size={"xl"} />
    </Button>
  );
};

export default UserMenu;