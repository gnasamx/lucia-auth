import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function WorkspaceRoute({
  params,
}: {
  params: { slug: string };
}) {
  const workspace = await prisma?.workspace.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      users: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!workspace?.id) {
    redirect("/");
  }

  return (
    <main>
      <h1>{workspace.name}</h1>
      <ul>
        {workspace.users.map((workspaceUser) => (
          <li key={workspaceUser.id}>
            {workspaceUser.user.email} :- {workspaceUser.role}
          </li>
        ))}
      </ul>
    </main>
  );
}
