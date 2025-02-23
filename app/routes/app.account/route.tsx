import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { checkUserAuth } from "~/utils/checkUserAuth.server";
import type { User } from "~/@types/user";
import { deleteUser, getUserById, updateUser } from "~/repositories/userRepository.server";
import AccountForm from "~/components/AccountForm/AccountForm";
import { hashPassword, verifyPassword } from "~/utils/hash.server";
import { sessionStorage } from "~/services/session.server";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await checkUserAuth(request);
  const fetchedUser = await getUserById(user?.id);

  return json({ user: fetchedUser });
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData();

    const userId = Number(body.get("id"));

    const firstName = body.get("firstName")?.toString();
    const lastName = body.get("lastName")?.toString();
    const email = body.get("email")?.toString();
    const password = body.get("password");
    const newPassword = body.get("newPassword");
    const enteredPassword = body.get("enteredPassword");

    const session = await sessionStorage.getSession(request.headers.get("cookie"));

    switch (request.method) {
      case "PUT": {
        const user = await updateUser(userId, {
          firstName,
          lastName,
          email,
        });

        if (user?.id) {
          delete user?.password;

          session.set("user", user);

          return redirect("/app/account", {
            headers: {
              "Set-Cookie": await sessionStorage.commitSession(session),
            },
          });
        } else {
          return json({ error: "Error update account data" }, { status: 400 });
        }
      }
      case "PATCH": {
        if (!enteredPassword || !password || !newPassword) {
          return json({ error: "All fields are required" }, { status: 400 });
        }

        const isVerify = await verifyPassword(enteredPassword, password);

        if (isVerify) {
          const hashPass = await hashPassword(newPassword);

          await updateUser(userId, { password: hashPass });

          return json({ result: "ok", isPassVerify: true }, { status: 200 });
        } else {
          return json({ isPassVerify: false });
        }
      }
      case "DELETE": {
        const user = await deleteUser(userId);

        if (user?.id) {
          return redirect("/app/news/grid", {
            headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
          });
        } else {
          return json({ error: "Error delete account" }, { status: 400 });
        }
      }
      default: {
        return json({ error: "Method not allowed" }, { status: 405 });
      }
    }
  } catch (err) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export default function Account() {
  const [state, setState] = useState({
    userData: {} as User,
    currentPassword: "",
    newPassword: "",
    isPassVerify: true,
  });

  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const updateState = (field: keyof typeof state, value: any) =>
    setState(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    updateState("isPassVerify", actionData?.isPassVerify !== false);
    if (actionData?.isPassVerify) {
      updateState("newPassword", "");
      updateState("currentPassword", "");
    }
  }, [actionData]);

  useEffect(() => {
    if (loaderData?.user) {
      updateState("userData", loaderData.user);
    }
  }, [loaderData]);

  const handleChange = (fieldName: keyof User, value: any) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, [fieldName]: value },
    }));
  };

  const handleSubmit = (method: "PUT" | "PATCH" | "DELETE", extraData = {}) => {
    submit({ id: state?.userData?.id, ...extraData }, { method });
  };

  const handleEditAccount = () => handleSubmit("PUT", {
    firstName: state.userData.firstName,
    lastName: state.userData.lastName,
    email: state.userData.email,
  });

  const handleEditPassword = () => handleSubmit("PATCH", {
    password: state.userData.password,
    enteredPassword: state.currentPassword,
    newPassword: state.newPassword,
  });

  const handleDeleteAccount = () => handleSubmit("DELETE");

  return (
    <Page
      title={"Account page"}
      titleHidden
    >
      <AccountForm
        accountData={state.userData}
        handleChange={handleChange}
        handleEditAccount={handleEditAccount}
        newPassword={state.newPassword}
        currentPassword={state.currentPassword}
        handlePasswordChange={updateState}
        isPassVerify={state.isPassVerify}
        handleEditPassword={handleEditPassword}
        handleDeleteAccount={handleDeleteAccount}
      />
    </Page>
  );
}
