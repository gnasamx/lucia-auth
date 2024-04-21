"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { cookies } from "next/headers";
import { TimeSpan, createDate } from "oslo";

export async function invite(data: FormData) {
  const { user } = await auth();
  console.log("user", user);
  if (!user?.id) {
    return {
      error: "error",
      message: "Unauthorized",
    };
  }

  const workspaceId = cookies().get("workspace:id")?.value;
  const workspaceSlug = cookies().get("workspace:slug")?.value;

  if (workspaceId && workspaceSlug) {
    const email = String(data.get("email"));
    const role = String(data.get("role")) as Role;

    try {
      let invitation = await prisma.workspaceInvite.create({
        data: {
          email,
          role,
          expiresAt: createDate(new TimeSpan(2, "d")),
          workspaceId,
        },
      });

      // http://localhost:3000/api/invite/clv9e3qij0006zcusfq21gyhq/accept

      const invitationUrl = `http://localhost:3000/api/invite/${invitation.id}/accept`;
      console.log("✅ Invitation url: ", invitationUrl);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          code: "conflict",
          message: "User has already been invited to this workspace",
        };
      }
    }
  } else {
    return {
      error: "error",
      message: "Invite failed",
    };
  }
}
