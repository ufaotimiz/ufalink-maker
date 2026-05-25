"use client";

import { useFormContext } from "react-hook-form";
import { Eraser } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialPresets } from "@/components/SocialPresets";
import { Separator } from "@/components/ui/separator";
import type { LinkSchema } from "@/lib/link-schema";

const UTM_FIELDS: Array<{
  name: keyof Omit<LinkSchema, "url">;
  label: string;
  hint: string;
  placeholder: string;
}> = [
  {
    name: "utm_source",
    label: "Origem (source)",
    hint: "De onde vem o tráfego. Ex: instagram, newsletter, google.",
    placeholder: "instagram",
  },
  {
    name: "utm_medium",
    label: "Meio (medium)",
    hint: "Canal/formato. Ex: bio, stories, email, cpc.",
    placeholder: "bio",
  },
  {
    name: "utm_campaign",
    label: "Campanha",
    hint: "Nome da campanha ou promoção.",
    placeholder: "lancamento-outubro",
  },
  {
    name: "utm_content",
    label: "Conteúdo (opcional)",
    hint: "Diferencia variações: botão, banner, criativo.",
    placeholder: "botao-cta-amarelo",
  },
  {
    name: "utm_term",
    label: "Termo (opcional)",
    hint: "Palavra-chave, geralmente para ads pagas.",
    placeholder: "marketing+digital",
  },
];

export function LinkForm() {
  const {
    register,
    formState: { errors },
    reset,
  } = useFormContext<LinkSchema>();

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-base">
          URL de destino
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://seusite.com/pagina"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(errors.url)}
          {...register("url")}
        />
        {errors.url ? (
          <p className="text-xs text-destructive">{errors.url.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Cole a página completa, com https://
          </p>
        )}
      </div>

      <Separator />

      <SocialPresets />

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        {UTM_FIELDS.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              placeholder={field.placeholder}
              autoComplete="off"
              spellCheck={false}
              {...register(field.name)}
            />
            <p className="text-xs text-muted-foreground">{field.hint}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            reset({
              url: "",
              utm_source: "",
              utm_medium: "",
              utm_campaign: "",
              utm_content: "",
              utm_term: "",
            })
          }
        >
          <Eraser className="mr-1 h-4 w-4" />
          Limpar tudo
        </Button>
      </div>
    </form>
  );
}
