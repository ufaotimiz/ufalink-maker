"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientPage } from "@/lib/page-actions";
import { slugify } from "@/lib/slug";

export function NewClientForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createClientPage({ name, slug });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
      }
      // On success: server action redirects, no need to handle here.
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/dashboard" aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <CardTitle className="text-xl">Novo cliente</CardTitle>
            <CardDescription>
              Comece pelo nome — o slug é gerado automaticamente.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome do cliente</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: Padaria do João"
              autoFocus
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">URL pública</Label>
            <div className="flex overflow-hidden rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="flex items-center bg-muted px-3 text-sm text-muted-foreground">
                /p/
              </span>
              <input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value.toLowerCase());
                }}
                placeholder="padaria-do-joao"
                pattern="[a-z0-9][a-z0-9\-]{0,48}[a-z0-9]"
                minLength={2}
                maxLength={50}
                required
                className="flex h-11 w-full border-0 bg-background px-3 py-2 text-base outline-none focus-visible:outline-none md:text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Letras, números e hífens. Mínimo 2, máximo 50.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending || !name || !slug}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar cliente"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
