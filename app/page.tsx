import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signOut } from "./actions/sign-out";

export default async function Home() {
  const { user } = await auth();
  if (!user?.id) {
    redirect("/sign-up");
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <main>
      <h1>Welcome, {user.email}</h1>
      <p>Start from here</p>
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
      <h2>Team</h2>
      <h2>Workspaces</h2>
      <ul>
        {workspaces.map((workspace) => (
          <li key={workspace.id}>
            <Link href={`/${workspace.slug}`}>{workspace.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
