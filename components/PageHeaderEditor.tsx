"use client";

import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateClientPage } from "@/lib/page-actions";

type ThemeMode = "LIGHT" | "DARK" | "AUTO";

const THEME_LABELS: Record<ThemeMode, string> = {
  LIGHT: "Claro",
  DARK: "Escuro",
  AUTO: "Automático",
};

type Props = {
  clientPageId: string;
  initial: {
    name: string;
    bio: string;
    avatarUrl: string;
    coverUrl: string;
    themeColor: string;
    themeMode: ThemeMode;
  };
};

export function PageHeaderEditor({ clientPageId, initial }: Props) {
  const [name, setName] = useState(initial.name);
  const [bio, setBio] = useState(initial.bio);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(initial.coverUrl);
  const [themeColor, setThemeColor] = useState(initial.themeColor);
  const [themeMode, setThemeMode] = useState<ThemeMode>(initial.themeMode);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateClientPage(clientPageId, {
        name,
        bio,
        avatarUrl,
        coverUrl,
        themeColor,
        themeMode,
      });
      if (!result.ok) toast.error(result.error);
      else toast.success("Salvo");
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome do cliente</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="avatarUrl">URL do avatar (opcional)</Label>
          <Input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio curta (opcional)</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={280}
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Uma frase curta sobre o cliente. Aparece embaixo do nome."
        />
        <p className="text-right text-xs text-muted-foreground">
          {bio.length}/280
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverUrl">URL da imagem de capa (opcional)</Label>
        <Input
          id="coverUrl"
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground">
          Imagem grande no topo da página. Recomendamos 1200x400.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="themeColor">Cor principal</Label>
          <div className="flex gap-2">
            <input
              id="themeColor"
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-md border border-input bg-background"
            />
            <Input
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              pattern="^#[0-9a-fA-F]{6}$"
              maxLength={7}
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Modo do tema</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-start"
              >
                {THEME_LABELS[themeMode]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              {(Object.keys(THEME_LABELS) as ThemeMode[]).map((mode) => (
                <DropdownMenuItem
                  key={mode}
                  onSelect={() => setThemeMode(mode)}
                >
                  {THEME_LABELS[mode]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </div>
    </form>
  );
}
