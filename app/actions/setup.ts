"use server";

import { auth, lucia } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createWorkspace(data: FormData) {
  const { user } = await auth();

  if (!user?.id) {
    return {
      error: "error",
      message: "Unauthorized",
    };
  }

  const name = String(data.get("name"));
  const slug = String(data.get("slug"));

  const existingWorkspace = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (existingWorkspace) {
    return {
      error: "info",
      message: "Workspace name has already been taken",
    };
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      users: {
        create: {
          userId: user.id,
          role: "admin",
        },
      },
    },
  });

  if (!workspace) {
    return {
      error: "error",
      message: "Something went wrong",
    };
  }

  cookies().set("workspace:id", workspace.id);
  cookies().set("workspace:slug", workspace.slug);

  redirect(`/${slug}/invite`);
}
