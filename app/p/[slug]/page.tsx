import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicPage } from "@/components/PublicPage";
import { prisma } from "@/lib/prisma";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.clientPage.findUnique({
    where: { slug },
    select: { name: true, bio: true, avatarUrl: true, coverUrl: true },
  });
  if (!page) return { title: "Página não encontrada" };

  return {
    title: page.name,
    description: page.bio ?? `Página de ${page.name}`,
    openGraph: {
      title: page.name,
      description: page.bio ?? `Página de ${page.name}`,
      images: page.coverUrl
        ? [{ url: page.coverUrl }]
        : page.avatarUrl
          ? [{ url: page.avatarUrl }]
          : undefined,
    },
  };
}

export default async function PublicClientPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await prisma.clientPage.findUnique({
    where: { slug },
    include: {
      socialLinks: { orderBy: { order: "asc" } },
      buttons: { orderBy: { order: "asc" } },
    },
  });
  if (!page) notFound();

  return <PublicPage page={page} />;
}
