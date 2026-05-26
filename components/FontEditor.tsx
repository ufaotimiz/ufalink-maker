"use client";

import { useCallback, useMemo, useState } from "react";

import { AutosaveIndicator } from "@/components/AutosaveIndicator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAutosave } from "@/hooks/useAutosave";
import {
  FONT_CATEGORY_LABEL,
  FONT_OPTIONS,
  findFont,
  googleFontsHref,
  type FontCategory,
} from "@/lib/fonts";
import { updateClientPageFonts } from "@/lib/page-actions";

type Props = {
  clientPageId: string;
  initial: { headingFont: string; bodyFont: string };
};

type FormState = { headingFont: string; bodyFont: string };

const CATEGORIES: FontCategory[] = [
  "sans",
  "serif",
  "display",
  "handwriting",
  "mono",
];

export function FontEditor({ clientPageId, initial }: Props) {
  const [form, setForm] = useState<FormState>(initial);

  const save = useCallback(
    async (v: FormState): Promise<boolean> => {
      const result = await updateClientPageFonts(clientPageId, v);
      return result.ok;
    },
    [clientPageId],
  );

  const { status, lastSavedAt } = useAutosave({
    value: form,
    onSave: save,
    delay: 600,
  });

  // Carrega no editor as fontes que estão sendo previsualizadas + a selecionada
  const previewHref = useMemo(
    () => googleFontsHref([form.headingFont, form.bodyFont]),
    [form.headingFont, form.bodyFont],
  );

  const headingStack = findFont(form.headingFont).stack;
  const bodyStack = findFont(form.bodyFont).stack;

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      items: FONT_OPTIONS.filter((f) => f.category === cat),
    }));
  }, []);

  return (
    <div className="space-y-5">
      {/* Carrega Google Fonts no editor para preview live */}
      {previewHref ? (
        // eslint-disable-next-line @next/next/no-css-tags
        <link href={previewHref} rel="stylesheet" />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FontPicker
          id="headingFont"
          label="Fonte dos títulos"
          value={form.headingFont}
          onChange={(v) => setForm((p) => ({ ...p, headingFont: v }))}
          grouped={grouped}
        />
        <FontPicker
          id="bodyFont"
          label="Fonte do corpo do texto"
          value={form.bodyFont}
          onChange={(v) => setForm((p) => ({ ...p, bodyFont: v }))}
          grouped={grouped}
        />
      </div>

      <div className="rounded-lg border bg-muted/30 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Preview
        </p>
        <p
          className="text-2xl font-bold leading-tight tracking-tight"
          style={{ fontFamily: headingStack }}
        >
          Título de exemplo
        </p>
        <p
          className="mt-2 text-sm leading-relaxed text-muted-foreground"
          style={{ fontFamily: bodyStack }}
        >
          Esta é uma demonstração de como o corpo de texto vai aparecer na página
          pública. Ajuste as fontes acima até encontrar a combinação certa para o
          cliente.
        </p>
      </div>

      <div className="flex items-center justify-end pt-1">
        <AutosaveIndicator status={status} lastSavedAt={lastSavedAt} />
      </div>
    </div>
  );
}

type PickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  grouped: { category: FontCategory; items: typeof FONT_OPTIONS }[];
};

function FontPicker({ id, label, value, onChange, grouped }: PickerProps) {
  const selected = findFont(value);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="h-11 w-full justify-start"
            style={{ fontFamily: selected.stack }}
          >
            {selected.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 w-[--radix-dropdown-menu-trigger-width] overflow-y-auto">
          {grouped.map(({ category, items }, idx) => (
            <div key={category}>
              {idx > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {FONT_CATEGORY_LABEL[category]}
              </DropdownMenuLabel>
              {items.map((f) => (
                <DropdownMenuItem
                  key={f.key}
                  onSelect={() => onChange(f.key)}
                  style={{ fontFamily: f.stack }}
                >
                  {f.label}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
