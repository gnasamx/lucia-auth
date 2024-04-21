"use server";

import { prisma } from "@/lib/prisma";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(data: FormData) {
  try {
    const email = String(data.get("email"));

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        code: "info",
        message: "Email has already been taken",
      };
    }

    const code = generateRandomString(6, alphabet("0-9", "A-Z"));
    await prisma.verification.create({
      data: {
        code,
        email,
        expiresAt: createDate(new TimeSpan(1, "d")),
      },
    });
    console.log("✅ Sign up code: ", code);

    cookies().set("auth:email", email, {
      maxAge: new TimeSpan(1, "m").seconds(),
    });
  } catch (error) {
    console.error("Sign up error", error);
  }
  return redirect("/verify");
}
