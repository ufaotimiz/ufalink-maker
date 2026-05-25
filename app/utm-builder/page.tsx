"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Header } from "@/components/Header";
import { LinkForm } from "@/components/LinkForm";
import { GeneratedLinkCard } from "@/components/GeneratedLinkCard";
import { LinkHistory } from "@/components/LinkHistory";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { linkSchema, type LinkSchema } from "@/lib/link-schema";

const DEFAULT_VALUES: LinkSchema = {
  url: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
};

export default function UtmBuilderPage() {
  const methods = useForm<LinkSchema>({
    resolver: zodResolver(linkSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="container flex-1 py-8 lg:py-12">
        <section className="mx-auto max-w-3xl space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Construtor de links UTM
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Adicione UTMs ao seu link e descubra exatamente de qual rede,
            campanha ou post veio cada visita. Tudo no seu navegador, nada
            enviado pra servidor.
          </p>
        </section>

        <FormProvider {...methods}>
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              <GeneratedLinkCard />

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Configurar parâmetros
                  </CardTitle>
                  <CardDescription>
                    Quanto mais detalhado, mais fácil de analisar depois.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LinkForm />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <LinkHistory />
            </div>
          </div>
        </FormProvider>

        <footer className="mx-auto mt-16 max-w-6xl border-t pt-6 text-center text-xs text-muted-foreground">
          <p>
            Feito com Next.js + Tailwind. Histórico salvo localmente no seu
            navegador.
          </p>
        </footer>
      </main>
    </div>
  );
}
