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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BlocksEditor } from "@/components/BlocksEditor";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { CustomButtonsEditor } from "@/components/CustomButtonsEditor";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { FontEditor } from "@/components/FontEditor";
import { GalleryEditor } from "@/components/GalleryEditor";
import { PageHeaderEditor } from "@/components/PageHeaderEditor";
import { SocialLinksEditor } from "@/components/SocialLinksEditor";
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

          <Tabs defaultValue="header" className="w-full">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 sm:h-10">
              <TabsTrigger value="header">Cabeçalho</TabsTrigger>
              <TabsTrigger value="fonts">Fontes</TabsTrigger>
              <TabsTrigger value="social">Redes</TabsTrigger>
              <TabsTrigger value="buttons">Botões</TabsTrigger>
              <TabsTrigger value="blocks">Blocos</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
            </TabsList>

            <TabsContent value="header" className="mt-4">
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
            </TabsContent>

            <TabsContent value="fonts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tipografia</CardTitle>
                  <CardDescription>
                    Escolha as fontes dos títulos e do corpo do texto. Aplica-se
                    em toda a página pública.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FontEditor
                    clientPageId={page.id}
                    initial={{
                      headingFont: page.headingFont,
                      bodyFont: page.bodyFont,
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="mt-4">
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
            </TabsContent>

            <TabsContent value="buttons" className="mt-4">
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
            </TabsContent>

            <TabsContent value="blocks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Blocos de conteúdo</CardTitle>
                  <CardDescription>
                    Monte a página com títulos, parágrafos, imagens, áudios,
                    vídeos, documentos, arquivos e embeds. Arraste a ordem com as
                    setas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BlocksEditor
                    clientPageId={page.id}
                    blocks={page.blocks}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
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
            </TabsContent>
          </Tabs>

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
