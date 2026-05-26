import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/auth";
import { ClientEditorShell } from "@/components/ClientEditorShell";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const { id } = await params;
  const page = await prisma.clientPage.findUnique({
    where: { id },
    include: {
      socialLinks: { orderBy: { order: "asc" } },
      buttons: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
      blocks: { orderBy: { order: "asc" } },
    },
  });
  if (!page) notFound();
  if (page.ownerId !== session.user.id) redirect("/dashboard");

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}/p/${page.slug}`;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <ClientEditorShell page={page} publicUrl={publicUrl} />
    </div>
  );
}
