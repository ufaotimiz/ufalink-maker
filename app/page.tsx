import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  Link2,
  Palette,
  Share2,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Share2,
    title: "Redes sociais centralizadas",
    body: "Instagram, TikTok, WhatsApp, YouTube e mais — todos os links do cliente em um único lugar.",
  },
  {
    icon: Link2,
    title: "Botões customizados",
    body: "Adicione botões pra portfólio, agendamento, lojas, qualquer link importante do cliente.",
  },
  {
    icon: ImageIcon,
    title: "Galeria de imagens",
    body: "Vitrine visual com fotos editáveis. Ideal para produtos, serviços ou portfólio.",
  },
  {
    icon: Palette,
    title: "Tema da marca",
    body: "Cor principal, modo claro/escuro. Cada cliente fica com a cara da própria marca.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="container flex-1 py-12 lg:py-20">
        <section className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Páginas prontas em minutos
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Crie páginas{" "}
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              pros seus clientes
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            Uma página simples e bonita pra cada cliente da agência — com redes
            sociais, botões e galeria. Compartilhe um link único, edite quando
            quiser.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" disabled>
              Entrar com Google
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/utm-builder">
                <Wrench className="mr-2 h-4 w-4" />
                Ver UTM Builder
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Login chega em breve — estamos finalizando.
          </p>
        </section>

        <section className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-foreground/10 transition-colors hover:border-foreground/30"
              >
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mx-auto mt-20 max-w-3xl rounded-2xl border bg-gradient-to-br from-card to-muted/40 p-8 text-center shadow-sm sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Pra agências, freelas e gestores
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Gerencie a presença digital dos seus clientes em um só lugar. Cada
            cliente ganha o próprio link público — você edita, ele compartilha.
          </p>
        </section>

        <footer className="mx-auto mt-16 max-w-6xl border-t pt-6 text-center text-xs text-muted-foreground">
          <p>Link Maker — feito com Next.js + Tailwind.</p>
        </footer>
      </main>
    </div>
  );
}
