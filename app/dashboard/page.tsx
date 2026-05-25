import { redirect } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

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
      updatedAt: true,
      _count: { select: { socialLinks: true, buttons: true, gallery: true } },
    },
  });

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
            <Button size="lg" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Novo cliente
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
                <Button disabled className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar primeiro cliente
                </Button>
                <p className="text-xs text-muted-foreground">
                  Editor chega na próxima fase.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clientPages.map((page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{page.name}</CardTitle>
                    <CardDescription className="truncate">
                      /p/{page.slug}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {page._count.socialLinks} redes · {page._count.buttons}{" "}
                    botões · {page._count.gallery} imagens
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
