"use server";

import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isWithinExpirationDate } from "oslo";

export async function verify(data: FormData) {
  const code = String(data.get("code"));

  const verification = await prisma.verification.findUnique({
    where: { code },
  });

  if (!verification) {
    return {
      error: "error",
      message: "Invalid code",
    };
  }

  if (
    verification.expiresAt &&
    !isWithinExpirationDate(new Date(verification.expiresAt))
  ) {
    return {
      error: "error",
      message: "Verification code expired",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: verification.email },
  });

  if (existingUser) {
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie);

    await prisma.verification.deleteMany({
      where: { code },
    });
    cookies().delete("auth:email");
    return redirect("/");
  } else {
    const user = await prisma.user.create({
      data: { email: verification.email },
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie);

    await prisma.verification.deleteMany({
      where: { code },
    });
    cookies().delete("auth:email");
    return redirect("/setup");
  }
}
