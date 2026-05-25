"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Check, Copy, ExternalLink, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/useClipboard";
import { useLinkGenerator } from "@/hooks/useLinkGenerator";
import { useLinkHistory } from "@/hooks/useLinkHistory";
import type { LinkSchema } from "@/lib/link-schema";

export function GeneratedLinkCard() {
  const { control } = useFormContext<LinkSchema>();
  const values = useWatch({ control }) as LinkSchema;
  const { valid, finalUrl, hasUtm } = useLinkGenerator({
    url: values.url ?? "",
    utm_source: values.utm_source ?? "",
    utm_medium: values.utm_medium ?? "",
    utm_campaign: values.utm_campaign ?? "",
    utm_content: values.utm_content ?? "",
    utm_term: values.utm_term ?? "",
  });
  const { copy, copied } = useClipboard();
  const { add } = useLinkHistory();

  const ready = valid && finalUrl.length > 0;

  const handleSave = () => {
    if (!ready) return;
    add({
      url: values.url,
      finalUrl,
      utms: {
        utm_source: values.utm_source,
        utm_medium: values.utm_medium,
        utm_campaign: values.utm_campaign,
        utm_content: values.utm_content,
        utm_term: values.utm_term,
      },
    });
    toast.success("Salvo no histórico");
  };

  return (
    <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-card to-muted/40 shadow-md">
      <CardHeader className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Seu link rastreável</CardTitle>
          {hasUtm && ready ? (
            <Badge variant="secondary" className="ml-auto">
              {finalUrl.length} caracteres
            </Badge>
          ) : null}
        </div>
        <CardDescription>
          {ready
            ? "Pronto pra copiar e colar onde precisar."
            : "Preencha a URL de destino para gerar."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={
            "rounded-lg border bg-background/60 p-4 font-mono text-sm leading-relaxed " +
            (ready
              ? "break-all text-foreground"
              : "text-muted-foreground italic")
          }
        >
          {ready
            ? finalUrl
            : "https://exemplo.com/?utm_source=...&utm_medium=..."}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={!ready}
            onClick={() => copy(finalUrl)}
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copiado!" : "Copiar link"}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={!ready}
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            disabled={!ready}
            asChild
          >
            <a
              href={ready ? finalUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!ready}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Testar
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
