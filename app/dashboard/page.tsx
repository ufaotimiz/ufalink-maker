import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ExternalLink, Pencil, Plus, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { DeleteClientButton } from "@/components/DeleteClientButton";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const clientPages = await prisma.clientPage.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      bio: true,
      avatarUrl: true,
      themeColor: true,
      updatedAt: true,
      _count: { select: { socialLinks: true, buttons: true, gallery: true } },
    },
  });

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="container flex-1 py-8 lg:py-12">
        <section className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Olá, {session.user.name?.split(" ")[0] ?? "agência"} 👋
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Seus clientes
              </h1>
            </div>
            <Button size="lg" asChild>
              <Link href="/dashboard/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Novo cliente
              </Link>
            </Button>
          </div>

          {clientPages.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Nenhum cliente ainda</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Crie a primeira página de cliente e tenha um link público
                    pronto pra compartilhar.
                  </p>
                </div>
                <Button asChild className="mt-2">
                  <Link href="/dashboard/clients/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar primeiro cliente
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clientPages.map((page) => {
                const publicUrl = `${baseUrl}/p/${page.slug}`;
                const initials = page.name
                  .split(/\s+/)
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <Card key={page.id} className="overflow-hidden">
                    <div
                      className="h-16"
                      style={{
                        background: `linear-gradient(135deg, ${page.themeColor}, ${page.themeColor}80)`,
                      }}
                    />
                    <CardHeader className="-mt-8 pb-2">
                      <div className="flex items-end justify-between">
                        {page.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={page.avatarUrl}
                            alt={page.name}
                            className="h-14 w-14 rounded-full border-4 border-card object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-card text-sm font-bold text-white"
                            style={{ backgroundColor: page.themeColor }}
                          >
                            {initials}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-base">{page.name}</CardTitle>
                      <CardDescription className="truncate font-mono text-xs">
                        /p/{page.slug}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      {page._count.socialLinks} redes · {page._count.buttons}{" "}
                      botões
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                      <Button size="sm" variant="default" asChild>
                        <Link href={`/dashboard/clients/${page.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir página"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <CopyLinkButton
                        value={publicUrl}
                        label=""
                        variant="outline"
                      />
                      <DeleteClientButton
                        clientPageId={page.id}
                        clientName={page.name}
                        iconOnly
                      />
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
