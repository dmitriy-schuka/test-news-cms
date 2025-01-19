import { useEffect, useState, useCallback } from "react";
import { json, redirect } from "@remix-run/node";
// import { ActionFunction, LoaderFunction } from "@remix-run/node";
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

  // return json({ user: null });
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const userId = body.get("id");
  const firstName = body.get("firstName")?.toString();
  const lastName = body.get("lastName")?.toString();
  const email = body.get("email")?.toString();
  const password = body.get("password")?.toString();
  const newPassword = body.get("newPassword")?.toString();
  const enteredPassword = body.get("enteredPassword")?.toString();

  switch (request.method) {
    case "PUT": {
      const user = await updateUser(Number(userId), {
        firstName,
        lastName,
        email,
      });

      if (user?.id) {
        const session = await sessionStorage.getSession(request.headers.get("cookie"));
        delete user?.password;

        session.set("user", user);

        return redirect("/app/account", {
          headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
          },
        });
      } else {
        return json({ error: "Error update account data" });
      }
    }
    case "PATCH": {
      const isVerify = await verifyPassword(enteredPassword, password);

      if (isVerify) {
        const hashPass = await hashPassword(newPassword);

        await updateUser(Number(userId), {
          password: hashPass,
        });

        return json({ result: "ok", isPassVerify: true });
      } else {
        return json({ isPassVerify: false });
      }
    }
    case "DELETE": {
      const user = await deleteUser(Number(userId));

      if (user?.id) {
        const session = await sessionStorage.getSession(request.headers.get("cookie"));

        return redirect("/app", {
          headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
        });
      } else {
        return json({ error: "Error delete account" });
      }
    }
    default: {
      return json({ result: "ok" });
    }
  }
};

export default function Account() {
  const [newUserData, setNewUserData] = useState<User>({});
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [isPassVerify, setIsPassVerify] = useState<boolean>(true);
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  useEffect(() =>  {
    if (actionData?.isPassVerify === false) {
      setIsPassVerify(false);
    } else {
      setIsPassVerify(true);
      setNewPassword();
      setCurrentPassword();
    }
  }, [setIsPassVerify, actionData])

  const { user } = loaderData;

  useEffect(() => {
    if (user) {
      setNewUserData(user);
    }
  }, [user]);

  const handleChange = useCallback(
    (newValue: string, fieldName: string) => {
      setNewUserData((prevState) => ({
        ...prevState,
        [fieldName]: newValue,
      }));
    },
    [setNewUserData],
  );

  const handleCurrentPass = useCallback(
    (newValue: string ) => {
      setCurrentPassword(newValue);
      setIsPassVerify(true);
    },
    [setCurrentPassword, setIsPassVerify],
  );

  const handleEditAccount = useCallback(() => {
    submit(newUserData, {
      method: "PUT"
    })
  }, [newUserData, submit]);

  const handleDeleteAccount = useCallback(() => {
    submit({
      id: newUserData?.id,
    }, {
      method: "DELETE"
    });
  }, [newUserData, submit]);

  const handleEditPassword = useCallback(() => {
    submit({
      id: newUserData?.id,
      password: newUserData?.password,
      enteredPassword: currentPassword,
      newPassword: newPassword,
    }, {
      method: "PATCH"
    });
  }, [newUserData, currentPassword, newPassword, submit]);

  return (
    <Page
      title={"Account page"}
      titleHidden
    >
      <AccountForm
        accountData={newUserData}
        handleChange={handleChange}
        handleEditAccount={handleEditAccount}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        currentPassword={currentPassword}
        handleCurrentPass={handleCurrentPass}
        isPassVerify={isPassVerify}
        handleEditPassword={handleEditPassword}
        handleDeleteAccount={handleDeleteAccount}
      />
    </Page>
  );
}
