import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { PageHeaderEditor } from "@/components/PageHeaderEditor";
import { SocialLinksEditor } from "@/components/SocialLinksEditor";
import { CustomButtonsEditor } from "@/components/CustomButtonsEditor";
import { GalleryEditor } from "@/components/GalleryEditor";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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

      <main className="container flex-1 py-8 lg:py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard" aria-label="Voltar">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {page.name}
                </h1>
                <p className="font-mono text-xs text-muted-foreground">
                  /p/{page.slug}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir
                </a>
              </Button>
              <CopyLinkButton value={publicUrl} />
              <DeleteClientButton
                clientPageId={page.id}
                clientName={page.name}
                redirectTo="/dashboard"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cabeçalho e tema</CardTitle>
              <CardDescription>
                Nome, bio, imagens e visual da página.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageHeaderEditor
                clientPageId={page.id}
                initial={{
                  name: page.name,
                  bio: page.bio ?? "",
                  avatarUrl: page.avatarUrl ?? "",
                  coverUrl: page.coverUrl ?? "",
                  themeColor: page.themeColor,
                  themeMode: page.themeMode,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Redes sociais</CardTitle>
              <CardDescription>
                Aparecem como ícones no topo da página pública.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SocialLinksEditor
                clientPageId={page.id}
                links={page.socialLinks}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Botões</CardTitle>
              <CardDescription>
                Botões grandes — bom pra ações como Reserve, Ver portfólio,
                Comprar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomButtonsEditor
                clientPageId={page.id}
                buttons={page.buttons}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Galeria</CardTitle>
              <CardDescription>
                Imagens em grid no fim da página pública. Cole URLs externas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryEditor
                clientPageId={page.id}
                images={page.gallery}
              />
            </CardContent>
          </Card>

          <Separator />

          <div className="rounded-xl border bg-gradient-to-br from-card to-muted/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">URL pública</p>
            <p className="my-2 break-all font-mono text-sm font-medium">
              {publicUrl}
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <CopyLinkButton value={publicUrl} variant="default" />
              <Button variant="outline" size="sm" asChild>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir página
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
