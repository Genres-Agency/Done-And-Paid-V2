"use server";
import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { getUserByEmail } from "@/src/lib/actions/user.action";
import { LoginSchema } from "@/src/schema";

export const Login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  try {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const user = await getUserByEmail(email);
    if (!user) {
      return { error: "Email does not exist!" };
    }

    const decodedCallbackUrl = callbackUrl
      ? decodeURIComponent(callbackUrl)
      : DEFAULT_LOGIN_REDIRECT;
    await signIn("credentials", {
      email,
      password,
      redirectTo: decodedCallbackUrl,
      redirect: true,
    });

    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
