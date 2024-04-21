"use server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

export async function signIn(data: FormData) {
  const email = String(data.get("email"));

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    return {
      error: "error",
      message: "Invalid email",
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
  console.log("✅ Sign in code: ", code);

  cookies().set("auth:email", email, {
    maxAge: new TimeSpan(1, "m").seconds(),
  });
  return redirect("/verify");
}
