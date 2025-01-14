import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";
import { prisma } from "~/db/prisma.server";
import bcrypt from "bcryptjs";
import { User } from "~/@types/user";

/** Create an instance of Authenticator */
export let authenticator = new Authenticator<User>(sessionStorage);

/** Registering a From strategy */
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const isPassVerify = await bcrypt.compare(password, user.password);

    if (!user || !isPassVerify) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }),
  "user-pass"
);
