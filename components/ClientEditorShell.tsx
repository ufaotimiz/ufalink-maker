"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Eye, EyeOff } from "lucide-react";

import { BlocksEditor } from "@/components/BlocksEditor";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { CustomButtonsEditor } from "@/components/CustomButtonsEditor";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { FontEditor } from "@/components/FontEditor";
import { GalleryEditor } from "@/components/GalleryEditor";
import { PageHeaderEditor } from "@/components/PageHeaderEditor";
import { PublicPage } from "@/components/PublicPage";
import { SocialLinksEditor } from "@/components/SocialLinksEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ThemeMode = "LIGHT" | "DARK" | "AUTO";

type Social =
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TIKTOK"
  | "X"
  | "YOUTUBE"
  | "LINKEDIN"
  | "WHATSAPP"
  | "WEBSITE"
  | "EMAIL";

type BlockType =
  | "HEADING"
  | "PARAGRAPH"
  | "IMAGE"
  | "AUDIO"
  | "VIDEO"
  | "FILE"
  | "DOCUMENT"
  | "EMBED"
  | "DIVIDER";

type BlockSize = "SMALL" | "MEDIUM" | "LARGE" | "FULL";

type SocialLink = { id: string; platform: Social; url: string };
type CustomButton = { id: string; label: string; url: string };
type GalleryImage = { id: string; url: string; caption: string | null };
type Block = {
  id: string;
  type: BlockType;
  size: BlockSize | null;
  text: string | null;
  url: string | null;
  caption: string | null;
};

export type ClientEditorPage = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  themeColor: string;
  bgColor: string | null;
  themeMode: ThemeMode;
  headingFont: string;
  bodyFont: string;
  socialLinks: SocialLink[];
  buttons: CustomButton[];
  gallery: GalleryImage[];
  blocks: Block[];
};

type Props = {
  page: ClientEditorPage;
  publicUrl: string;
};

type LiveHeader = {
  name: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  themeColor: string;
  bgColor: string;
  themeMode: ThemeMode;
};

type LiveFonts = {
  headingFont: string;
  bodyFont: string;
};

export function ClientEditorShell({ page, publicUrl }: Props) {
  const [showPreview, setShowPreview] = useState(true);

  const [liveHeader, setLiveHeader] = useState<LiveHeader>({
    name: page.name,
    bio: page.bio ?? "",
    avatarUrl: page.avatarUrl ?? "",
    coverUrl: page.coverUrl ?? "",
    themeColor: page.themeColor,
    bgColor: page.bgColor ?? "",
    themeMode: page.themeMode,
  });

  const [liveFonts, setLiveFonts] = useState<LiveFonts>({
    headingFont: page.headingFont,
    bodyFont: page.bodyFont,
  });

  const onHeaderLiveChange = (patch: Partial<LiveHeader>) => {
    setLiveHeader((prev) => ({ ...prev, ...patch }));
  };

  const onFontsLiveChange = (patch: Partial<LiveFonts>) => {
    setLiveFonts((prev) => ({ ...prev, ...patch }));
  };

  const previewPage = {
    name: liveHeader.name,
    bio: liveHeader.bio || null,
    avatarUrl: liveHeader.avatarUrl || null,
    coverUrl: liveHeader.coverUrl || null,
    themeColor: liveHeader.themeColor,
    bgColor: liveHeader.bgColor || null,
    themeMode: liveHeader.themeMode,
    headingFont: liveFonts.headingFont,
    bodyFont: liveFonts.bodyFont,
    socialLinks: page.socialLinks,
    buttons: page.buttons,
    gallery: page.gallery,
    blocks: page.blocks,
  };

  return (
    <main
      className={cn(
        "container flex-1 py-8 lg:py-12",
        showPreview ? "xl:max-w-[1600px]" : undefined,
      )}
    >
      <div
        className={cn(
          "mx-auto grid gap-6",
          showPreview
            ? "max-w-[1600px] xl:grid-cols-[minmax(0,1fr)_440px]"
            : "max-w-4xl",
        )}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard" aria-label="Voltar">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {liveHeader.name || page.name}
                </h1>
                <p className="font-mono text-xs text-muted-foreground">
                  /p/{page.slug}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview((v) => !v)}
                className="hidden xl:inline-flex"
                aria-label={showPreview ? "Esconder preview" : "Mostrar preview"}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" /> Esconder preview
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" /> Ver preview
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
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
                      bgColor: page.bgColor ?? "",
                      themeMode: page.themeMode,
                    }}
                    onLiveChange={onHeaderLiveChange}
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
                    onLiveChange={onFontsLiveChange}
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
                    vídeos, documentos, arquivos e embeds. Suba arquivos direto
                    do dispositivo ou cole URLs externas.
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
                    Imagens em grid no fim da página pública.
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
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir página
                </a>
              </Button>
            </div>
          </div>
        </div>

        {showPreview ? (
          <aside className="hidden xl:block">
            <div className="sticky top-6 space-y-2">
              <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Preview ao vivo
                </span>
                <span className="font-mono opacity-60">/p/{page.slug}</span>
              </div>
              <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">
                    {publicUrl.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-background">
                  <div className="origin-top scale-[0.78] [width:128.2%]">
                    <PublicPage page={previewPage} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
