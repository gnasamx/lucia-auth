import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = params.id;

  if (!token) {
    return NextResponse.json({
      error: "error",
      message: "Wrong invitation link, Please contact support",
    });
  }

  const invitation = await prisma.workspaceInvite.findFirst({
    where: { id: token },
  });

  if (!invitation) {
    return NextResponse.json({
      error: "error",
      message: "Invalid invitation",
    });
  }

  const workspace = await prisma.workspace.findFirst({
    where: { id: invitation.workspaceId },
  });

  const existingUser = await prisma.user.findFirst({
    where: { email: invitation.email },
  });

  if (existingUser) {
    await prisma.workspaceUser.create({
      data: {
        role: invitation.role,
        userId: existingUser.id,
        workspaceId: invitation.workspaceId,
      },
    });
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie);
  } else {
    const user = await prisma.user.create({
      data: { email: invitation.email },
    });

    await prisma.workspaceUser.create({
      data: {
        role: invitation.role,
        userId: user.id,
        workspaceId: invitation.workspaceId,
      },
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie);
  }

  await prisma.workspaceInvite.delete({ where: { id: token } });

  redirect(`/${workspace?.slug}`);
}
