"use client";

import { useCallback, useState } from "react";

import { AutosaveIndicator } from "@/components/AutosaveIndicator";
import { MediaUploadField } from "@/components/MediaUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAutosave } from "@/hooks/useAutosave";
import { updateClientPage } from "@/lib/page-actions";

type ThemeMode = "LIGHT" | "DARK" | "AUTO";

const THEME_LABELS: Record<ThemeMode, string> = {
  LIGHT: "Claro",
  DARK: "Escuro",
  AUTO: "Automático",
};

type FormState = {
  name: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  themeColor: string;
  themeMode: ThemeMode;
};

type Props = {
  clientPageId: string;
  initial: FormState;
  onLiveChange?: (patch: Partial<FormState>) => void;
};

export function PageHeaderEditor({ clientPageId, initial, onLiveChange }: Props) {
  const [form, setForm] = useState<FormState>(initial);

  const save = useCallback(
    async (v: FormState): Promise<boolean> => {
      if (!v.name.trim()) return false;
      if (!/^#[0-9a-fA-F]{6}$/.test(v.themeColor)) return false;
      const result = await updateClientPage(clientPageId, v);
      return result.ok;
    },
    [clientPageId],
  );

  const { status, lastSavedAt } = useAutosave({
    value: form,
    onSave: save,
    delay: 800,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    onLiveChange?.({ [key]: value } as Partial<FormState>);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome do cliente</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio curta (opcional)</Label>
        <textarea
          id="bio"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          maxLength={280}
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Uma frase curta sobre o cliente. Aparece embaixo do nome."
        />
        <p className="text-right text-xs text-muted-foreground">
          {form.bio.length}/280
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="avatarUrl">Avatar (opcional)</Label>
          <MediaUploadField
            id="avatarUrl"
            value={form.avatarUrl}
            onChange={(v) => update("avatarUrl", v)}
            kind="image"
            emptyHint="Clique ou arraste a foto do cliente"
            urlPlaceholder="https://..."
          />
          <p className="text-xs text-muted-foreground">
            Quadrado, ~400×400. Aparece no topo da página.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coverUrl">Imagem de capa (opcional)</Label>
          <MediaUploadField
            id="coverUrl"
            value={form.coverUrl}
            onChange={(v) => update("coverUrl", v)}
            kind="image"
            emptyHint="Clique ou arraste a capa"
            urlPlaceholder="https://..."
          />
          <p className="text-xs text-muted-foreground">
            Banner horizontal, ~1200×400.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="themeColor">Cor principal</Label>
          <div className="flex gap-2">
            <input
              id="themeColor"
              type="color"
              value={form.themeColor}
              onChange={(e) => update("themeColor", e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-md border border-input bg-background"
            />
            <Input
              value={form.themeColor}
              onChange={(e) => update("themeColor", e.target.value)}
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
                {THEME_LABELS[form.themeMode]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              {(Object.keys(THEME_LABELS) as ThemeMode[]).map((mode) => (
                <DropdownMenuItem
                  key={mode}
                  onSelect={() => update("themeMode", mode)}
                >
                  {THEME_LABELS[mode]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-end pt-1">
        <AutosaveIndicator status={status} lastSavedAt={lastSavedAt} />
      </div>
    </div>
  );
}
